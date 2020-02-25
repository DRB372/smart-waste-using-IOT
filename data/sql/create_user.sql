SHOW DATABASES;

CREATE DATABASE swc_db CHARACTER SET utf8 COLLATE utf8_general_ci;;

CREATE USER 'greatdrb'@'localhost' IDENTIFIED BY 'Smart3720';

GRANT ALL PRIVILEGES ON swc_db TO 'greatdrb'@'localhost';