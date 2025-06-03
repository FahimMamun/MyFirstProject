<?php
/*
 * User Registration Script
 */

// Include the database connection script
require_once 'db_connect.php'; // $mysqli connection object is now available

// Set content type to JSON for the response
header('Content-Type: application/json');

// Initialize response array
$response = ['success' => false, 'message' => ''];

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get email and password from POST data
    // It's good practice to trim whitespace and potentially sanitize/validate further
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    // Basic validation
    if (empty($email)) {
        $response['message'] = 'Email is required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format.';
    } elseif (empty($password)) {
        $response['message'] = 'Password is required.';
    } elseif (strlen($password) < 8) { // Example: Minimum password length
        $response['message'] = 'Password must be at least 8 characters long.';
    } else {
        // Check if email already exists
        $stmt = $mysqli->prepare("SELECT id FROM users WHERE email = ?");
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $response['message'] = 'Email already registered.';
            } else {
                // Email does not exist, proceed with registration
                // Hash the password
                $password_hash = password_hash($password, PASSWORD_DEFAULT);

                if ($password_hash === false) {
                    $response['message'] = 'Error hashing password.';
                } else {
                    // Insert new user into the database
                    $insert_stmt = $mysqli->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
                    if ($insert_stmt) {
                        $insert_stmt->bind_param("ss", $email, $password_hash);
                        if ($insert_stmt->execute()) {
                            $response['success'] = true;
                            $response['message'] = 'Registration successful! You can now login.';
                        } else {
                            $response['message'] = 'Error registering user. Please try again. DB Error: ' . $insert_stmt->error;
                        }
                        $insert_stmt->close();
                    } else {
                        $response['message'] = 'Database error (prepare insert). ' . $mysqli->error;
                    }
                }
            }
            $stmt->close();
        } else {
            $response['message'] = 'Database error (prepare select). ' . $mysqli->error;
        }
    }
} else {
    // Not a POST request
    $response['message'] = 'Invalid request method.';
}

// Close the database connection
if (isset($mysqli)) {
    $mysqli->close();
}

// Send JSON response
echo json_encode($response);
exit;
?>
