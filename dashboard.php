<?php
// Start session at the very beginning
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if the user is logged in.
// If not, redirect to the login page (index.html).
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: index.html"); // Assuming your login page is index.html
    exit;
}

// If user is logged in, display dashboard content.
// Get user's email from session to personalize the welcome message (optional)
$user_email = isset($_SESSION['user_email']) ? htmlspecialchars($_SESSION['user_email']) : 'User';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <!-- Include Tailwind CSS via CDN (for consistency if you want to style it) -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <nav class="bg-blue-600 p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-white text-2xl font-bold">My Dashboard</h1>
            <div>
                <span class="text-white mr-4">Welcome, <?php echo $user_email; ?>!</span>
                <a href="logout.php" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150">
                    Logout
                </a>
            </div>
        </div>
    </nav>

    <div class="container mx-auto p-8 mt-8">
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">To-Do List Application</h2>
            <p class="text-gray-600">
                This is your main dashboard. Your to-do list items will appear here.
            </p>
            <!-- Placeholder for to-do list content -->
            <div class="mt-6 border-t pt-6">
                <p class="text-gray-500 italic">Your tasks will be displayed here soon...</p>
            </div>
        </div>
    </div>

    <!-- You can include a main script file here if needed for dashboard interactivity later -->
    <!-- <script src="dashboard_script.js"></script> -->
</body>
</html>
