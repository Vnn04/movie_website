CREATE DATABASE IF NOT EXISTS mlops;
USE mlops;

CREATE TABLE IF NOT EXISTS user (
    id INT,
    username VARCHAR(255),
    fullname VARCHAR(255),
    date_of_birth DATE,
    password VARCHAR(255),
    gender INT,
    phone VARCHAR(25),
    email VARCHAR(255),
    address VARCHAR(255),
    bought_vip BOOLEAN,
    PRIMARY KEY(id)
);

LOAD DATA INFILE '/var/lib/mysql-files/user.csv'
INTO TABLE user
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, username, fullname, date_of_birth, password, gender, phone, email, address, @bought_vip)
SET bought_vip = CASE
    WHEN @bought_vip='True' THEN 1
    ELSE 0
END;

CREATE TABLE IF NOT EXISTS movie (
    movieID INT,
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
    PRIMARY KEY(movieID)
);

LOAD DATA INFILE '/var/lib/mysql-files/movie.csv'
INTO TABLE movie
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE IF NOT EXISTS rating (
    userID INT,
    movieID INT,
    rating INT,
    PRIMARY KEY(userID, movieID),
    FOREIGN KEY (userID) REFERENCES user(id),
    FOREIGN KEY (movieID) REFERENCES movie(movieID)
);

LOAD DATA INFILE '/var/lib/mysql-files/rating.csv'
INTO TABLE rating
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE IF NOT EXISTS view (
    userID INT,
    movieID INT,
    view INT,
    PRIMARY KEY(userID, movieID),
    FOREIGN KEY (userID) REFERENCES user(id),
    FOREIGN KEY (movieID) REFERENCES movie(movieID)
);

LOAD DATA INFILE '/var/lib/mysql-files/view.csv'
INTO TABLE view
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

CREATE TABLE IF NOT EXISTS watch_trailer (
    userID INT,
    movieID INT,
    watch INT,
    PRIMARY KEY(userID, movieID),
    FOREIGN KEY (userID) REFERENCES user(id),
    FOREIGN KEY (movieID) REFERENCES movie(movieID)
);

LOAD DATA INFILE '/var/lib/mysql-files/watch_trailer.csv'
INTO TABLE watch_trailer
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
