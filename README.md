# Movie Theater Website

It's just a regular movie theater website

# Technologies

- sqlite3 for database managment

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
