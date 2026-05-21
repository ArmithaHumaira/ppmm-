CREATE DATABASE IF NOT EXISTS ppmm_db;
USE ppmm_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL
);

CREATE TABLE public_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  header VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  user_id INT,
  category_id INT,
  image VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  body TEXT NOT NULL,
  user_id INT,
  public_report_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (public_report_id) REFERENCES public_reports(id) ON DELETE CASCADE
);

INSERT INTO categories (category_name) VALUES
('Infrastruktur'),
('Kebersihan'),
('Keamanan'),
('Fasilitas Umum'),
('Pelayanan Publik');

UPDATE users SET role = 'admin' WHERE email = 'admin@ppmm.com';
UPDATE users SET role = 'super_admin' WHERE email = 'superadmin@ppmm.com';

SELECT id, username, email, role FROM users;