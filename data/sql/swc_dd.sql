DROP TABLE IF EXISTS fund;
DROP TABLE IF EXISTS signin;
DROP TABLE IF EXISTS complaint;

DROP TABLE IF EXISTS vehicleroute;
DROP TABLE IF EXISTS salary;
DROP TABLE IF EXISTS attendance;

DROP TABLE IF EXISTS bininstallation;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS track;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS person;

ALTER TABLE employee CHANGE COLUMN avatar avatar varchar(100);

CREATE TABLE person (
    person_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255),
    cnic NCHAR(15) NULL UNIQUE,
    contact NCHAR(12),
    home_address VARCHAR(255),
    gender ENUM('male', 'female') NOT NULL,
    email VARCHAR(50) NULL UNIQUE,
    dob DATE,
    created_at DATETIME NOT NULL,
    is_active BOOLEAN Default "1" ,
    remarks varchar(255)
);


CREATE TABLE employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    avatar VARCHAR(100),
    employee_type VARCHAR(50) NOT NULL,
    shift ENUM('morning', 'noon', 'night') NOT NULL,
    bank_account varchar(100) NULL UNIQUE,
    passwrd VARCHAR(60),
    last_login DATETIME NOT NULL,
    person_id INT,
    FOREIGN KEY (person_id) REFERENCES person (person_id)
);
create table Salary(
Employee_ID int,
Salary_Month varchar(15),
Salary_Amount float,
foreign key (Employee_ID) references Employee(Employee_ID)
);

create table Attendance(
Employee_ID int,
Attendance_Status varchar(50),
foreign key (Employee_ID) references Employee(Employee_ID)
);

create table Track(
Track_ID int,
Track_Name varchar(50),
Track_Description varchar(255),
primary key(Track_ID)
);

create table Track_Assigned(
Employee_ID int,
Track_ID int,
foreign key (Employee_ID) references Employee(Employee_ID),
foreign key (Track_ID) references Track(Track_ID)
);

create table BinInstallation(
Bin_ID int,
Bin_Address varchar(50),
Bin_Install_Date datetime,
Bin_Install_By varchar(50),
Bin_Description varchar(255),
Bin_Image binary,
primary key(Bin_ID)
);

create table Bin_Location(
Bin_ID int,
Bin_location float(53),
Bin_level float(53),
Bin_Status int,
foreign key (Bin_ID) references BinInstallation (Bin_ID)
);

create table BinRoute(
Bin_ID int,
Track_ID int,
foreign key (Bin_ID) references BinInstallation (Bin_ID),
foreign key (Track_ID) references Track (Track_ID)
);

create table Vehicle(
Vehicle_ID int,
Vehicle_Number int,
Vehicle_Image binary,
Vehicle_Company varchar(50),
Vehicle_Model int,
Vehicle_Description varchar(255),
Vehicle_Date datetime,
Vehicle_AddedBy varchar(50),
primary key(Vehicle_ID)
);


create table VehicleLocation(
Vehicle_ID int,
Vehicle_Location float(53),
foreign key (Vehicle_ID) references Vehicle(Vehicle_ID)
);


create table VehicleRoute(
Vehicle_ID int,
Employee_ID int,
foreign key (Vehicle_ID) references Vehicle(Vehicle_ID),
foreign key (Employee_ID) references Employee(Employee_ID)
);

create table Complaint(
CP_ID int,
CP_Name varchar(50),
CP_Address varchar(255),
CP_Mobile int,
CP_Email varchar(150),
CP_Type varchar(150),
CP_Description varchar (255),
CP_Status varchar(20),
primary key(CP_ID)
);


create table Fund(
Funding_ID int,
Funding_Date datetime,
Funding_Description varchar(255),
Funding_Ref varchar(255),
Funding_Type varchar(50),
Balance float(53),
primary key(Funding_ID)
);

create table Bill(
Person_ID int,
Bill_ID int,
Amount float(53),
House_ID int,
Bill_Month datetime,
Bill_Status varchar(30),
foreign key (Person_ID) references Person(Person_ID)
);
