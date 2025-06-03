<?php
/*
 * User Login Script
 */

// Start session before any output
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Include the database connection script
require_once 'db_connect.php'; // $mysqli connection object is now available

// Set content type to JSON for the response
header('Content-Type: application/json');

// Initialize response array
$response = ['success' => false, 'message' => '', 'redirectUrl' => ''];

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';

    // Basic validation
    if (empty($email)) {
        $response['message'] = 'Email is required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format.';
    } elseif (empty($password)) {
        $response['message'] = 'Password is required.';
    } else {
        // Prepare to fetch user from database
        $stmt = $mysqli->prepare("SELECT id, email, password_hash FROM users WHERE email = ?");
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();

                // Verify password
                if (password_verify($password, $user['password_hash'])) {
                    // Password is correct, login successful
                    $response['success'] = true;
                    $response['message'] = 'Login successful!';

                    // Store user information in session
                    // Avoid storing sensitive info like password hash in session
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['user_email'] = $user['email'];
                    $_SESSION['loggedin'] = true;

                    // Define a redirect URL (e.g., to a dashboard page)
                    $response['redirectUrl'] = 'dashboard.php';

                } else {
                    // Incorrect password
                    $response['message'] = 'Incorrect email or password.';
                }
            } else {
                // User not found
                $response['message'] = 'Incorrect email or password.'; // Generic message for security
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
