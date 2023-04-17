# Movie Theater Website

This project is an interactive client-server application that simulates a movie theater that can sell tickets.

### Functionality

The website supports two categories of users: anonymous users (AU) and registered users (RU). AU can browse through all pages, while RU can do the same while also having the ability to buy tickets for movies. The website displays a schedule of movies retrieved from the database and provides pagination for displaying more movies. RUs are able to select a movie, date/time, ticket count, and confirm the order. The website displays all chosen tickets and allows the user to make changes (if necessary) and confirm the final selection. Users can also return to uncompleted orders. RUs are able to browse through their order history. A user profile page has also been implemented, which provides access to the user information (name, email, login, password, address, credit card, order history). The website uses the Pug/Jade templating engine to generate its HTML. The website uses responsive web design to cater towards desktops as well as mobile phones and tablets, and follows accessibility standards.

### Backend

The backend of the website is built on Node.js (and its frameworks), and uses sessions, AJAX, and SQLite.

The website is protected against SQL injections and Cross-site scripting.

### Database Structures

| Users                             |                      |
| --------------------------------- | -------------------- |
| username VARCHAR(255) PRIMARY KEY | user username        |
| password VARCHAR(255)             | user hashed password |
| name VARCHAR(255)                 | user name            |
| email VARCHAR(255)                | user email           |
| address TEXT                      | user address         |
| creditcard VARCHAR(255)           | user creditcard      |

| Order Data             |                                                             |
| ---------------------- | ----------------------------------------------------------- |
| id INTEGER PRIMARY KEY | order id                                                    |
| data TEXT              | JSON of order data: {date,movieName,moviePosterURL,tickets} |
| username VARCHAR       | username of user who made the order                         |

| Movies                    |                                                 |
| ------------------------- | ----------------------------------------------- |
| id INTEGER PRIMARY KEY    | movie id                                        |
| name VARCHAR(255)         | movie name                                      |
| posterURL TEXT            | movie poster URL                                |
| description TEXT          | movie description                               |
| genre VARCHAR(255)        | movie genre                                     |
| trailerURLid VARCHAR(255) | youtube trailer id                              |
| releaseYear INTEGER       | release year of movie                           |
| timeslots TEXT            | JSON array of all movie timeslots as JSON dates |
| artists TEXT              | JSON of all artists {directors,actors, writers} |

```js
sql = `
    CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255),
        name VARCHAR(255),
		email VARCHAR(255),
		address TEXT,
		creditcard VARCHAR(255)
		
    );`;
db.run(sql);

sql = `
    CREATE TABLE IF NOT EXISTS orderData (
        id INTEGER PRIMARY KEY,
        data TEXT,
        username VARCHAR,
        FOREIGN KEY (username)  REFERENCES users (username)

    );`;
db.run(sql);

sql = `
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255) ,
        posterURL TEXT,
        description TEXT,
        genre VARCHAR(255),
        trailerURLid VARCHAR(255),
        releaseYear INTEGER,
        timeslots TEXT,
		artists TEXT

    );`;
db.run(sql);
```

### File Contents

All HTML, CSS, and JS files have comments at the top, and all JS methods and variables have dedicated comments explaining their purpose.

The server's main file is Server.js

# Submission Info

groupID: 35

Authors: Mary Zlateva (1506730), Mampenda Jobarteh (4424646), Deniz Türksen (9587098 )

URL: http://webtech.science.uu.nl/group35/

<!-- # Technologies

- sqlite3 for database managment -->

# Demo User Logins

WARNING: These logins are guarenteed to be on the deployed site but may not be present in this version.
| username | password |
| -------- | -------- |
| a | a |
| b | b |
| c | c |
| d | d |
| e | e |

# Deployment

## Accessing the Utrecht University Server

### 1. In Terminal:

```sh
$ ssh 1506730@gemini.science.uu.nl
```

password: University of Utrecht Portal Login password

### 2. Once in Server:

```sh
$ ssh group35@webtech.science.uu.nl
```

this is a public password: webtech

## Deploy

1. cd into project folder
2. run

```shell
  $ npm i
```

3. then use the keep alive method or the testing method

### Keep Alive

Will keep server running even when you kill the terminal

```sh
$ pm2 start npm -- run prod
```

### Deploy Test

Runs the server as the current process so it will terminate once you kill the terminal

```sh
$ npm run prod
```

website hosted on: http://webtech.science.uu.nl/group35/
