-- Active: 1685622877657@@127.0.0.1@3306@cs350db

DROP DATABASE cs350db;

CREATE DATABASE cs350db;

USE cs350db;

CREATE TABLE Users (
    userId VARCHAR(20) PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    hashedPw VARCHAR(50) NOT NULL,
    isAdmin BOOLEAN NOT NULL
);

INSERT INTO Users VALUES
    (
        'ytrewq271828',
        '01098342208',
        'klasjfdkljsdkljfsda',
        TRUE
    ),
    (
        'tanit23',
        '01066826915',
        'sfadlksadflkjsadkljs',
        FALSE
    ),
    (
        'derick321',
        '01004470447',
        'laiowjeivona',
        TRUE
    ),
    (
        'tpdus2155',
        '01000960096',
        'kasdjfklajseijija',
        FALSE
    ),
    (
        'antony',
        '01005770577',
        'qwerqwerqwer',
        FALSE
    );

CREATE TABLE Clubs (
    clubName VARCHAR(20) PRIMARY KEY,
    descriptions VARCHAR(100) NOT NULL,
    categoryName VARCHAR(30) NOT NULL
);

INSERT INTO Clubs VALUES
    (
        'Number',
        'KAIST Musical club',
        'Performance'
    ),
    (
        'K-Let',
        'KAIST Leadership Executing Team',
        'Social'
    ),
    (
        'KAIST Times',
        'KAIST Korean Newspaper',
        'Association'
    ),
    (
        'Bear Paw',
        'KAIST Handmaking',
        'Arts'
    );

CREATE TABLE Posts (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    clubName VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    uploadTime TIMESTAMP NOT NULL,
    contents VARCHAR(2000) NOT NULL,
    scheduleStart DATE,
    scheduleEnd DATE,
    isRecruit BOOLEAN NOT NULL,
    isOnly BOOLEAN NOT NULL
);

ALTER TABLE Posts
    ADD FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO Posts (
    clubName,
    title,
    uploadTime,
    contents,
    scheduleStart,
    scheduleEnd,
    isRecruit,
    isOnly
) VALUES
    (
        'Number',
        'Number President',
        "2023-05-29 12:34:56",
        'Seunghyeon Jeong becomes Number president',
        NULL,
        NULL,
        FALSE,
        FALSE
    ),
    (
        'Number',
        'Number Recruit',
        "2023-09-01 01:23:45",
        'Number recruits 23F new members!',
        "2023-09-01",
        "2023-09-08",
        TRUE,
        TRUE
    ),
    (
        'K-Let',
        'K-Let President',
        "2023-05-31 23:00:00",
        'Dakyung Seo becomes K-Let president',
        NULL,
        NULL,
        FALSE,
        FALSE
    ),
    (
        'K-Let',
        'K-Let Recruit',
        "2023-08-31 02:34:50",
        'K-Let wants 23F sinip members!',
        "2023-08-31",
        "2023-09-05",
        TRUE,
        TRUE
    );

CREATE TABLE Categories (
    categoryName VARCHAR(30) PRIMARY KEY
);

INSERT INTO Categories VALUES
    ('Performance'),
    ('Arts'),
    ('Social'),
    ('Association');

ALTER TABLE Clubs
    ADD FOREIGN KEY (categoryName) REFERENCES Categories (categoryName);

CREATE TABLE CreationRequests (
    clubName VARCHAR(20) PRIMARY KEY,
    userId VARCHAR(20) NOT NULL,
    descriptions VARCHAR(100) NOT NULL,
    reqTime TIMESTAMP NOT NULL,
    categoryName VARCHAR(30) NOT NULL
);

ALTER TABLE CreationRequests
    ADD FOREIGN KEY (categoryName) REFERENCES Categories (categoryName);

ALTER TABLE CreationRequests
    ADD FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

INSERT INTO CreationRequests VALUES
    (
        'Shakespeare',
        'antony',
        'KAIST English Literature club',
        "2023-07-07 07:07:07",
        'Arts'
    ),
    (
        'KISA',
        'ytrewq271828',
        'KAIST International Students Association',
        "2023-09-09 09:09:09",
        'Association'
    );

CREATE TABLE Subscribes (
    userId VARCHAR(20) NOT NULL,
    clubName VARCHAR(20) NOT NULL
);

ALTER TABLE Subscribes
    ADD FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE Subscribes
    ADD FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO Subscribes VALUES
    ('ytrewq271828', 'Number'),
    ('ytrewq271828', 'K-Let'),
    ('ytrewq271828', 'KAIST Times'),
    ('ytrewq271828', 'Bear Paw'),
    ('tanit23', 'Number'),
    ('tanit23', 'K-Let'),
    ('derick321', 'Number'),
    ('derick321', 'K-Let'),
    ('tpdus2155', 'Number'),
    ('antony', 'Number');

CREATE TABLE Joins (
    userId VARCHAR(20) NOT NULL,
    clubName VARCHAR(20) NOT NULL
);

ALTER TABLE Joins
    ADD FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE Joins
    ADD FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO Joins VALUES
    ('ytrewq271828', 'K-Let'),
    ('tanit23', 'K-Let'),
    ('tanit23', 'Number'),
    ('derick321', 'Number'),
    ('tpdus2155', 'Number'),
    ('antony', 'Number');

CREATE TABLE Represents (
    userId VARCHAR(20) NOT NULL,
    clubName VARCHAR(20) PRIMARY KEY
);

ALTER TABLE Represents
    ADD FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE Represents
    ADD FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO Represents VALUES
    ('tanit23', 'K-Let'),
    ('tpdus2155', 'Number');

CREATE TABLE HandoverRequests (
    fromId VARCHAR(20) NOT NULL,
    toId VARCHAR(20) NOT NULL,
    clubName VARCHAR(20) PRIMARY KEY
);

ALTER TABLE HandoverRequests
    ADD FOREIGN KEY (fromId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE HandoverRequests
    ADD FOREIGN KEY (toId) REFERENCES Users (userId) ON DELETE CASCADE;

ALTER TABLE HandoverRequests
    ADD FOREIGN KEY (clubName) REFERENCES Clubs (clubName) ON DELETE CASCADE;

INSERT INTO HandoverRequests VALUES
    ('tpdus2155', 'antony', 'Number');

CREATE TABLE AuthCodes (
    userId VARCHAR(20) PRIMARY KEY,
    code CHAR(6) NOT NULL,
    issuedAt TIMESTAMP NOT NULL
);
