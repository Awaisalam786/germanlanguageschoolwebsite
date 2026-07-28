-- GERMAN LANGUAGE SCHOOL SQL DATABASE SCHEMA (MySQL / PostgreSQL)
-- Production ready relational database structure for German Language Academy

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'EDITOR', 'VIEWER', 'STUDENT') DEFAULT 'STUDENT',
    is_2fa_enabled BOOLEAN DEFAULT TRUE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(36) PRIMARY KEY,
    level VARCHAR(10) NOT NULL, -- A1, A2, B1, B2, C1, C2
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    fees VARCHAR(100) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    total_seats INT DEFAULT 15,
    instructor_name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    passport_or_id VARCHAR(100),
    course_level VARCHAR(50),
    attendance_rate VARCHAR(10) DEFAULT '100%',
    grade VARCHAR(50) DEFAULT 'Pending',
    payment_status VARCHAR(50) DEFAULT 'Paid',
    learning_mode VARCHAR(50) DEFAULT 'Online',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    category ENUM('Certificates', 'ID Proofs', 'Receipts', 'Syllabus') NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size VARCHAR(50),
    ocr_extracted_data JSON,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    summary TEXT,
    content LONGTEXT,
    image_url VARCHAR(500),
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    course_interest VARCHAR(100),
    message TEXT NOT NULL,
    status ENUM('New Lead', 'In Progress', 'Resolved') DEFAULT 'New Lead',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_analytics (
    id VARCHAR(36) PRIMARY KEY,
    page_url VARCHAR(255) NOT NULL,
    page_title VARCHAR(255),
    views_count INT DEFAULT 1,
    traffic_source VARCHAR(100),
    device_type VARCHAR(50),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
