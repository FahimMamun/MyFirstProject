<?php
/*
 * Database Connection Script
 *
 * Establishes a connection to the MySQL database.
 * Replace placeholder values with your actual database credentials.
 */

// Define database connection parameters
// **IMPORTANT:** Replace these with your actual WAMPP MySQL credentials!
define('DB_SERVER', 'localhost');       // Usually 'localhost' for WAMPP/XAMPP
define('DB_USERNAME', 'root');          // Default username for WAMPP/XAMPP is often 'root'
define('DB_PASSWORD', '');              // Default password for WAMPP/XAMPP is often empty
define('DB_NAME', 'todo_app_db');       // Replace with your chosen database name (create it if it doesn't exist)

// Attempt to connect to MySQL database
$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($mysqli === false) {
    // Connection failed. Output error and exit.
    // In a production app, you might log this error instead of displaying it directly.
    die("ERROR: Could not connect to database. " . $mysqli->connect_error);
}

// Optional: Set character set to utf8mb4 for better Unicode support
if (!$mysqli->set_charset("utf8mb4")) {
    // In a production app, log this warning.
    // printf("Warning: Error loading character set utf8mb4: %s
", $mysqli->error);
}

// The $mysqli object can now be used by other scripts to interact with the database.
// Example: include 'db_connect.php';
// $result = $mysqli->query("SELECT * FROM users");

// No need to close the connection here if it's included at the start of scripts that need it.
// The connection will typically close when the script execution finishes.
// However, explicit close $mysqli->close(); can be used if a script finishes DB operations early.
?>
