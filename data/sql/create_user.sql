SHOW DATABASES;

CREATE DATABASE swc_db;

CREATE USER 'greatdrb'@'localhost' IDENTIFIED BY 'Smart3720';

GRANT ALL PRIVILEGES ON swc_db TO 'greatdrb'@'localhost';