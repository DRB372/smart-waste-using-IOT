DROP TABLE IF EXISTS fund;
DROP TABLE IF EXISTS signin;
DROP TABLE IF EXISTS complaint;

DROP TABLE IF EXISTS vehicleroute;
DROP TABLE IF EXISTS salary;
DROP TABLE IF EXISTS attendance;

DROP TABLE IF EXISTS bins;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS track;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS person;

ALTER TABLE employee CHANGE COLUMN avatar avatar varchar(100);

CREATE TABLE person (
    person_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    cnic NCHAR(15) UNIQUE NULL,
    home_address VARCHAR(255),
    gender ENUM ('male', 'female') NOT NULL,
    contact NCHAR(12),
    email VARCHAR(50) NOT NULL,
    dob DATE
) engine = InnoDB AUTO_INCREMENT = 1;


CREATE TABLE employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    avatar VARCHAR(100),
    employee_type ENUM ('user', 'driver', 'staff', 'security', 'manager') NOT NULL DEFAULT 'user',
    shift ENUM ('morning', 'noon', 'night') NOT NULL DEFAULT 'morning',
    account_no VARCHAR(100),
    passwrd VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    person_id INT NOT NULL,
    FOREIGN KEY (person_id) REFERENCES person (person_id)
) engine = InnoDB AUTO_INCREMENT = 1;

CREATE TABLE bins (
    bin_id INT PRIMARY KEY,
    bin_address VARCHAR(255),
    latitude FLOAT(10,6) NOT NULL,
    longitude FLOAT(10,6) NOT NULL,
    image VARCHAR(100),
    remarks VARCHAR(255),
    is_active BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES employee (employee_id)
) engine = InnoDB;
