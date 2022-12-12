CREATE DATABASE student;
use student;

CREATE TABLE students(
    StudentID int not null AUTO_INCREMENT,
    FirstName varchar(100) not null,
    Surname varchar(100) not null,
    PRIMARY KEY (StudentID)
);

INSERT INTO students(FirstName, Surname)
VALUES("Pera", "Peric"), ("Sara", "Saric");