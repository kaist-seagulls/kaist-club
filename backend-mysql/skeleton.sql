-- Active: 1685622877657@@127.0.0.1@3306@cs350db

drop database cs350db;

create database cs350db;

use cs350db;

create table
    Users(
        studentId int,
        userId varchar(20) primary key,
        userName varchar(30) not null,
        email varchar(50) unique not null,
        phone varchar(15) unique not null,
        hashedPW varchar(50),
        isRep boolean not null,
        isAdmin boolean not null
    );

insert into users
values (
        20190169,
        'ytrewq271828',
        'Junyup Kim',
        'ytrewq271828@kaist.ac.kr',
        '01098342208',
        'klasjfdkljsdkljfsda',
        false,
        false
    );

insert into users
values (
        20190194,
        'tanit23',
        'Taehan Kim',
        'tanit23@kaist.ac.kr',
        '01066826915',
        'sfadlksadflkjsadkljs',
        true,
        false
    );

insert into users
values (
        20190447,
        'derick321',
        'Dongseop Lee',
        'derick321@kaist.ac.kr',
        '01004470447',
        'laiowjeivona',
        false,
        true
    );

insert into users
values (
        20200096,
        'tpdus2155',
        'Seyeon Kim',
        'tpdus2155@kaist.ac.kr',
        '01000960096',
        'kasdjfklajseijija',
        true,
        false
    );

insert into users
values (
        20200577,
        'antony',
        'Seunghyeon Jeong',
        'antony@kaist.ac.kr',
        '01005770577',
        'qwerqwerqwer',
        false,
        false
    );

create table
    Clubs(
        clubName varchar(20) primary key,
        descriptions varchar(100) not null,
        clubCategory varchar(30) not null
    );

insert into Clubs
values (
        'Number',
        'KAIST Musical club',
        'Performance'
    );

insert into Clubs
values (
        'K-Let',
        'KAIST Leadership Executing Team',
        'Social'
    );

insert into Clubs
values (
        'KAIST Times',
        'KAIST Korean Newspaper',
        'Association'
    );

insert into Clubs values('Bear Paw', 'KAIST Handmaking', 'Arts');

create table
    Posts(
        postId int primary key,
        postClubName varchar(20) not null,
        title varchar(100) not null,
        uploadTime timestamp not null,
        contents varchar(2000) not null,
        scheduleStart date,
        scheduleEnd date,
        isRecruit boolean not null,
        isonly boolean not null
    );

alter table Posts
add
    foreign key (postClubName) references clubs (clubName) on delete cascade;

insert into Posts
values (
        1,
        'Number',
        'Number President',
        "2023-05-29 12:34:56",
        'Seunghyeon Jeong becomes Number president',
        null,
        null,
        false,
        false
    );

insert into Posts
values (
        2,
        'Number',
        'Number Recruit',
        "2023-09-01 01:23:45",
        'Number recruits 23F new members!',
        "2023-09-01",
        "2023-09-08",
        true,
        true
    );

insert into Posts
values (
        3,
        'K-Let',
        'K-Let President',
        "2023-05-31 23:00:00",
        'Dakyung Seo becomes K-Let president',
        null,
        null,
        false,
        false
    );

insert into Posts
values (
        4,
        'K-Let',
        'K-Let Recruit',
        "2023-08-31 02:34:50",
        'K-Let wants 23F sinip members!',
        "2023-08-31",
        "2023-09-05",
        true,
        true
    );

create table
    Category(
        categoryId int,
        categoryName varchar(30) primary key
    );

insert into category values(1, 'Performance');

insert into category values(2, 'Arts');

insert into category values(3, 'Social');

insert into category values(4, 'Association');

create table
    Creationrequests(
        clubName varchar(20) primary key,
        requestUser varchar(20) not null,
        descriptions varchar(100) not null,
        reqTime timestamp not null,
        clubCategory varchar(30) not null
    );

alter table creationrequests
add
    foreign key (clubCategory) references category (categoryName) on delete cascade;

insert into creationrequests
values (
        'Shakespeare',
        'antony',
        'KAIST English Literature club',
        "2023-07-07 07:07:07",
        'Arts'
    );

insert into creationrequests
values (
        'KISA',
        'ytrewq271828',
        'KAIST International Students Association',
        "2023-09-09 09:09:09",
        'Association'
    );

alter table Clubs
add
    foreign key (clubCategory) references category (categoryName) on delete cascade;

alter table creationrequests
add
    foreign key (clubCategory) references category (categoryName) on delete cascade;

alter table creationrequests
add
    foreign key (requestUser) references users (userId) on delete cascade;

create table
    Subscribes(
        userId varchar(20) not null,
        clubName varchar(20) not null
    );

alter table subscribes
add
    foreign key (userId) references users (userId) on delete cascade;

alter table subscribes
add
    foreign key (clubName) references clubs (clubName) on delete cascade;

insert into subscribes values('ytrewq271828', 'Number');

insert into subscribes values('ytrewq271828', 'K-Let');

insert into subscribes values('ytrewq271828', 'KAIST Times');

insert into subscribes values('ytrewq271828', 'Bear Paw');

insert into subscribes values('tanit23', 'Number');

insert into subscribes values('tanit23', 'K-Let');

insert into subscribes values('derick321', 'Number');

insert into subscribes values('derick321', 'K-Let');

insert into subscribes values('tpdus2155', 'Number');

insert into subscribes values('antony', 'Number');

create table
    Joins(
        userId varchar(20) not null,
        clubName varchar(20) not null
    );

alter table joins
add
    foreign key (userId) references users (userId) on delete CASCADE;

alter table joins
add
    foreign key (clubName) references clubs (clubName) on delete cascade;

insert into joins values('ytrewq271828', 'K-Let');

insert into joins values('tanit23', 'K-Let');

insert into joins values('tanit23', 'Number');

insert into joins values('derick321', 'Number');

insert into joins values('tpdus2155', 'Number');

insert into joins values('antony', 'Number');

create table
    Represents(
        userId varchar(20) not null,
        clubName varchar(20) primary key
    );

alter table represents
add
    foreign key (userId) references users (userId) on delete cascade;

alter table represents
add
    foreign key (clubName) references clubs (clubName) on delete cascade;

insert into represents values('tanit23', 'K-Let');

insert into represents values('tpdus2155', 'Number');

create table
    HandoverRequests(
        fromId varchar(20) not null,
        toId varchar(20) not null,
        ofClub varchar(20) primary key
    );

alter table HandoverRequests
add
    foreign key (fromId) references users (userId) on delete cascade;

alter table HandoverRequests
add
    foreign key (toId) references users (userId) on delete cascade;

alter table HandoverRequests
add
    foreign key (ofClub) references clubs (clubName) on delete cascade;

insert into HandoverRequests values('tpdus2155', 'antony', 'Number');

create table
    AuthCode(
        userId varchar(20) primary key,
        authCode int not null,
        timeAuth timestamp not null
    );
