CREATE DATABASE IF NOT EXISTS medical_reports;
USE medical_reports;

-- Drop existing tables if you want to start fresh
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  INDEX idx_email (email)
);

CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  status ENUM('UPLOADED', 'PROCESSING', 'COMPLETED') DEFAULT 'UPLOADED',
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
