# Movie Theater Website

This project is an interactive client-server application that simulates a movie theater that can sell tickets.

### Functionality

The website supports two categories of users: anonymous users (AU) and registered users (RU). AU can browse through all pages, while RU can do the same while also having the ability to buy tickets for movies. The website displays a schedule of movies retrieved from the database and provides pagination for displaying more movies. RUs are able to select a movie, date/time, ticket count, and confirm the order. The website displays all chosen tickets and allows the user to make changes (if necessary) and confirm the final selection. Users can also return to uncompleted orders. RUs are able to browse through their order history. A user profile page has also been implemented, which provides access to the user information (name, email, login, password, address, credit card, order history). The website uses the Pug/Jade templating engine to generate its HTML. The website uses responsive web design to cater towards desktops as well as mobile phones and tablets, and follows accessibility standards.

### Backend

The backend of the website is built on Node.js (and its frameworks), and uses sessions, AJAX, and SQLite.

The website is protected against SQL injections and Cross-site scripting.

### Additional information

All HTML, CSS, and JS files have comments at the top, and all JS methods and variables have dedicated comments explaining their purpose.

# Submission Info

groupID: 35

Authors: Mary Zlateva (1506730), Mampenda Jobarteh (4424646), Deniz Türksen

URL: http://webtech.science.uu.nl/group35/

<!-- # Technologies

- sqlite3 for database managment -->

# Demo User Logins

| username | password |
| -------- | -------- |
| a        | a        |
| b        | b        |
| c        | c        |
| d        | d        |
| e        | e        |

# Deployment

## Accessing the Utrecht University server

### 1. In terminal:

```sh
$ ssh 1506730@gemini.science.uu.nl
```

password: University of Utrecht Portal Login password

### 2. Once in server:

```sh
$ ssh group35@webtech.science.uu.nl
```

this is a public password: webtech

## Deploy

1. cd into project folder

2. then use the keep alive method or the testing method

### keep alive

```sh
$ pm2 start npm -- run prod
```

### deploy test

```sh
$ npm run prod
```

website hosted on: http://webtech.science.uu.nl/group35/
