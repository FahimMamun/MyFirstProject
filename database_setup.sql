-- SQL script to create the 'users' table for the to-do list application

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Instructions for use:
-- 1. Access your MySQL database management tool (e.g., phpMyAdmin in WAMPP/XAMPP, MySQL Workbench).
-- 2. Select your application's database (or create one if it doesn't exist).
-- 3. Run this SQL script to create the 'users' table.
