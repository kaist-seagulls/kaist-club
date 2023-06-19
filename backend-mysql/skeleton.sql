-- Active: 1685622877657@@127.0.0.1@3306@cs350db

DROP DATABASE cs350db;

CREATE DATABASE cs350db;

USE cs350db;

CREATE TABLE
    Users (
        userId VARCHAR(20) PRIMARY KEY,
        phone VARCHAR(15) NOT NULL,
        hashedPw VARCHAR(50) NOT NULL,
        isAdmin BOOLEAN NOT NULL
    );

INSERT INTO Users
VALUES (
        'ytrewq271828',
        '01098342208',
        'q1234567890',
        TRUE
    ), (
        'tanit23',
        '01066826915',
        'q1234567890',
        FALSE
    ), (
        'derick321',
        '01004470447',
        'q1234567890',
        TRUE
    ), (
        'tpdus2155',
        '01000960096',
        'q1234567890',
        FALSE
    ), (
        'antony',
        '01005770577',
        'q1234567890',
        FALSE
    );

CREATE TABLE
    Clubs (
        clubName VARCHAR(20) PRIMARY KEY,
        descriptions VARCHAR(100) NOT NULL,
        categoryName VARCHAR(30) NOT NULL,
        color CHAR(7) NOT NULL
    );

INSERT INTO Clubs
VALUES (
        'Number',
        'KAIST Musical club',
        'Performance',
        '#ff0000'
    ), (
        'K-Let',
        'KAIST Leadership Executing Team',
        'Social',
        '#00ff00'
    ), (
        'KAIST Times',
        'KAIST Korean Newspaper',
        'Association',
        '#0000ff'
    ), (
        'Bear Paw',
        'KAIST Handmaking',
        'Arts',
        '#ffff00'
    );

CREATE TABLE
    Posts (
        postId INT AUTO_INCREMENT PRIMARY KEY,
        clubName VARCHAR(20) NOT NULL,
        title VARCHAR(100) NOT NULL,
        uploadTime TIMESTAMP NOT NULL,
        contents VARCHAR(2000) NOT NULL,
        scheduleStart DATE,
        scheduleEnd DATE,
        isRecruit BOOLEAN NOT NULL,
        isOnly BOOLEAN NOT NULL,
        postFileIndex INT
    );

ALTER TABLE Posts
ADD
    FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO
    Posts (
        clubName,
        title,
        uploadTime,
        contents,
        scheduleStart,
        scheduleEnd,
        isRecruit,
        isOnly,
        postFileIndex
    )
VALUES (
        'Number',
        'Number President',
        "2023-05-29 12:34:56",
        'Seunghyeon Jeong becomes Number president',
        NULL,
        NULL,
        FALSE,
        FALSE,
        NULL
    ), (
        'Number',
        'Number Recruit',
        "2023-09-01 01:23:45",
        'Number recruits 23F new members!',
        "2023-09-01",
        "2023-09-08",
        TRUE,
        TRUE,
        NULL
    ), (
        'K-Let',
        'K-Let President',
        "2023-05-31 23:00:00",
        'Dakyung Seo becomes K-Let president',
        NULL,
        NULL,
        FALSE,
        FALSE,
        NULL
    ), (
        'K-Let',
        'K-Let Recruit',
        "2023-08-31 02:34:50",
        'K-Let wants 23F sinip members!',
        "2023-08-31",
        "2023-09-05",
        TRUE,
        TRUE,
        NULL
    );

drop table postfiles;

CREATE TABLE
    PostFiles (
        postId INT not null,
        clubName varchar(30) NOT NULL,
        imageName varchar(50) Primary key
    );

ALTER TABLE PostFiles
ADD
    FOREIGN KEY (postID) REFERENCES Posts (postId);

ALTER TABLE PostFiles
ADD
    FOREIGN KEY (clubName) REFERENCES Clubs (clubName);

CREATE TABLE Categories ( categoryName VARCHAR(30) PRIMARY KEY );

INSERT INTO Categories
VALUES ('Performance'), ('Arts'), ('Social'), ('Association');

ALTER TABLE Clubs
ADD
    FOREIGN KEY (categoryName) REFERENCES Categories (categoryName);

CREATE TABLE
    CreationRequests (
        requestId INT AUTO_INCREMENT PRIMARY KEY,
        clubName VARCHAR(20),
        userId VARCHAR(20) NOT NULL,
        descriptions VARCHAR(100) NOT NULL,
        reqTime TIMESTAMP NOT NULL,
        categoryName VARCHAR(30) NOT NULL,
        logoImg LONGBLOB,
        headerImg LONGBLOB
    );

ALTER TABLE CreationRequests
ADD
    FOREIGN KEY (categoryName) REFERENCES Categories (categoryName);

ALTER TABLE CreationRequests
ADD
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

INSERT INTO CreationRequests
VALUES (
        0,
        'Shakespeare',
        'antony',
        'KAIST English Literature club',
        "2023-07-07 07:07:07",
        'Arts',
        Null,
        Null
    ), (
        0,
        'KISA',
        'ytrewq271828',
        'KAIST International Students Association',
        "2023-09-09 09:09:09",
        'Association',
        Null,
        Null
    );

CREATE TABLE
    CreationRequestFiles (
        requestId INT not null,
        isheader BOOLEAN not null,
        img longblob
    );

ALTER Table
    CreationRequestFiles
Add
    foreign key (requestId) references CreationRequests (requestId);

CREATE TABLE
    Subscribes (
        userId VARCHAR(20) NOT NULL,
        clubName VARCHAR(20) NOT NULL
    );

ALTER TABLE Subscribes
ADD
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE Subscribes
ADD
    FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO Subscribes
VALUES ('ytrewq271828', 'Number'), ('ytrewq271828', 'K-Let'), ('ytrewq271828', 'KAIST Times'), ('ytrewq271828', 'Bear Paw'), ('tanit23', 'Number'), ('tanit23', 'K-Let'), ('derick321', 'Number'), ('derick321', 'K-Let'), ('tpdus2155', 'Number'), ('antony', 'Number');

CREATE TABLE
    Joins (
        userId VARCHAR(20) NOT NULL,
        clubName VARCHAR(20) NOT NULL
    );

ALTER TABLE Joins
ADD
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE Joins
ADD
    FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO Joins
VALUES ('ytrewq271828', 'K-Let'), ('tanit23', 'K-Let'), ('tanit23', 'Number'), ('derick321', 'Number'), ('tpdus2155', 'Number'), ('antony', 'Number');

CREATE TABLE
    Represents (
        userId VARCHAR(20) NOT NULL,
        clubName VARCHAR(20) PRIMARY KEY
    );

ALTER TABLE Represents
ADD
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE Represents
ADD
    FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO Represents
VALUES ('tanit23', 'K-Let'), ('tpdus2155', 'Number');

CREATE TABLE
    HandoverRequests (
        fromId VARCHAR(20) NOT NULL,
        toId VARCHAR(20) NOT NULL,
        clubName VARCHAR(20) PRIMARY KEY
    );

ALTER TABLE HandoverRequests
ADD
    FOREIGN KEY (fromId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE HandoverRequests
ADD
    FOREIGN KEY (toId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE HandoverRequests
ADD
    FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO HandoverRequests
VALUES (
        'tpdus2155',
        'antony',
        'Number'
    );

CREATE TABLE
    AuthCodes (
        userId VARCHAR(20) PRIMARY KEY,
        code CHAR(6) NOT NULL,
        issuedAt TIMESTAMP NOT NULL
    );

create table
    JoinRequests(
        userId varchar(20) primary key,
        clubName varchar(20) not null,
        reqTime timestamp not null
    );

insert into JoinRequests
values (
        'ytrewq271828',
        "KAIST Times",
        "2023-08-08 08:08:08"
    )