CREATE DATABASE IF NOT EXISTS mlops;
USE mlops;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT,
    userID INT,
    username VARCHAR(255),
    fullname VARCHAR(255),
    date_of_birth DATE,
    password VARCHAR(255),
    gender INT,
    phone VARCHAR(25),
    email VARCHAR(255),
    address VARCHAR(255),
    bought_vip BOOLEAN DEFAULT 0,
    PRIMARY KEY(id)
);

LOAD DATA INFILE '/var/lib/mysql-files/user.csv'
INTO TABLE Users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(userID, username, fullname, date_of_birth, password, gender, phone, email, address, @bought_vip)
SET bought_vip = CASE
    WHEN @bought_vip='True' THEN 1
    ELSE 0
END;

CREATE TABLE IF NOT EXISTS Movies (
    id INT,
    title VARCHAR(255),
    overview TEXT,
    poster_path VARCHAR(255),
    release_date DATE,
    rating FLOAT,
    link VARCHAR(255),
    Action INT,
    Adventure INT,
    Animation INT,
    Comedy INT,
    Crime INT,
    Documentary INT,
    Drama INT,
    Family INT,
    Fantasy INT,
    History INT,
    Horror INT,
    Music INT,
    Mystery INT,
    Romance INT,
    `Science Fiction` INT,
    `TV Movie` INT,
    Thriller INT,
    War INT,
    Western INT,
    cast TEXT,
    PRIMARY KEY(id)
);

LOAD DATA INFILE '/var/lib/mysql-files/movie.csv'
INTO TABLE Movies
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE IF NOT EXISTS rating (
    userID INT,
    movieID INT,
    rating INT,
    PRIMARY KEY(userID, movieID),
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (movieID) REFERENCES Movies(id)
);

LOAD DATA INFILE '/var/lib/mysql-files/rating.csv'
INTO TABLE rating
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE IF NOT EXISTS Viewed (
    userID INT,
    movieID INT,
    view INT,
    PRIMARY KEY(userID, movieID),
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (movieID) REFERENCES Movies(id)
);

LOAD DATA INFILE '/var/lib/mysql-files/view.csv'
INTO TABLE Viewed
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE IF NOT EXISTS watch_trailer (
    userID INT,
    movieID INT,
    watch INT,
    PRIMARY KEY(userID, movieID),
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (movieID) REFERENCES Movies(id)
);

LOAD DATA INFILE '/var/lib/mysql-files/watch_trailer.csv'
INTO TABLE watch_trailer
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE IF NOT EXISTS Visits (
    id INT AUTO_INCREMENT,
    userID INT,
    PRIMARY KEY(id),
    FOREIGN KEY (userID) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Histories (
    id INT AUTO_INCREMENT,
    userID INT,
    movieID INT,
    PRIMARY KEY(id),
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (movieID) REFERENCES Movies(id)
);
