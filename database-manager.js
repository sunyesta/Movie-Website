const sqlite3 = require("sqlite3").verbose();
const { reject } = require("bcrypt/promises");
const dbUtils = require("./dbUtils");

require("dotenv").config();

// create db file if file not found
var fs = require("fs");

const [db, isNew] = openDB();
if (isNew) {
	resetMovies();
}

function openDB() {
	const isNew = !fs.existsSync(process.env.DATABASE_URL);
	if (isNew) {
		fs.openSync(process.env.DATABASE_URL, "w");
	}
	return [
		new sqlite3.Database(
			process.env.DATABASE_URL,
			sqlite3.OPEN_READWRITE,
			handleErr
		),
		isNew,
	];
}

// --- config
sql = `PRAGMA foreign_keys = ON;`;
db.run(sql);

// --- create tables

// dbUtils.dropTables(db);

function buildTables() {
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
    CREATE TABLE IF NOT EXISTS ticketData (
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
}
buildTables();

// helper functions

function handleErr(err) {
	if (err) {
		return console.log(err);
	}
}

function getData(sql) {
	return new Promise((resolve, reject) => {
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			}
			resolve(rows);
		});
	});
}

class TicketDataEntry {
	constructor(date, movieName, moviePosterURL, tickets) {
		this.movieDate = date;
		this.movieName = movieName;
		this.moviePosterURL = moviePosterURL;
		this.tickets = tickets;
		this.purchaseDate = new Date();
	}
}

class movie {
	constructor(
		name,
		posterURL,
		description,
		genre,
		trailerURLid,
		releaseYear,
		timeSlots
	) {
		this.name = name || "Default Movie Name";
		this.posterURL = posterURL || "https://i.imgur.com/removed.png";
		this.description = description || loremIpsum;
		this.genre = genre || "generic";
		this.trailerURLid = trailerURLid || "fgxclUnQI8A";
		this.releaseYear = releaseYear || 2000;
		this.timeSlots = timeSlots || randomTimeSlots();
	}
}

function addUser(username, hashedPassword, name, email, address, creditcard) {
	const sql = `INSERT INTO users(username,password,name,email,address,creditcard ) VALUES(?,?,?,?,?,?)`;
	db.run(
		sql,
		[username, hashedPassword, name, email, address, creditcard],
		(err) => {
			console.error(err);
		}
	);
}

// addUser("sunyesta", "dfsd", "dasf", "daf", "sadf", "asf");

async function getUser(username) {
	const sql = `SELECT * FROM users WHERE username = "${username}";`;
	const data = (await getData(sql))[0];
	return data;
}

// test getUser
// getUser("sunyesta").then((user) => {
//  console.log("USERRRRR:", user);
// });

function addTicketData(username, date, movieName, moviePosterURL, tickets) {
	const newTicketDataEntry = new TicketDataEntry(
		(date = date),
		(movieName = movieName),
		(moviePosterURL = moviePosterURL),
		(tickets = tickets)
	);

	const sql = `INSERT INTO ticketData(username, data) VALUES(?,?)`;

	db.run(sql, [username, JSON.stringify(newTicketDataEntry)], handleErr);
}

// addTicketData("sunyesta", new Date(), "daf", 1);

async function getTicketHistory(username) {
	const sql = `SELECT data FROM ticketData WHERE username = "${username}";`;
	const ticketDatas = await getData(sql);
	return ticketDatas.map((td) => {
		let newTD = JSON.parse(td.data);
		newTD.movieDate = new Date(newTD.movieDate);
		newTD.purchaseDate = new Date(newTD.purchaseDate);
		return newTD;
	});
}

function addMovie(movie) {
	const sql = `INSERT INTO movies(name, posterURL,description,genre,trailerURLid,releaseYear,timeslots,artists) VALUES(?,?,?,?,?,?,?,?)`;

	db.run(
		sql,
		[
			movie.name,
			movie.posterURL,
			movie.description,
			movie.genre,
			movie.trailerURLid,
			movie.releaseYear,
			JSON.stringify(movie.timeSlots),
			JSON.stringify(movie.artists),
		],
		handleErr
	);
}

function convertMovieData(movieData) {
	// console.log("movie data = ", movieData.timeslots);
	// let movies = new movie(movieData.name,movieData.posterURL,movieData.description,movieData.genre,movieData.trailerURLid,moviesData.releaseYear,movieData.time)
	let timeslots = JSON.parse(movieData.timeslots);
	movieData.timeSlots = timeslots.map((date) => {
		return new Date(date);
	});

	movieData.artists = JSON.parse(movieData.artists);
	return movieData;
}

async function getMovie(movieName) {
	const sql = `SELECT * FROM movies WHERE name = "${movieName}";`;
	const movieDatas = await getData(sql);
	if (movieDatas.length == 0) {
		console.error("no movie found with name:", movieName);
		return null;
	}
	return movieDatas.map((movieData) => {
		return convertMovieData(movieData);
	})[0];
}

async function getMovieRange(min, max) {
	const sql = `SELECT * FROM movies WHERE id >= ${min} AND id < ${max} ;`;
	const movieDatas = await getData(sql);

	return movieDatas.map((movieData) => {
		return convertMovieData(movieData);
	});
}

// getMovie("Solar Opposites").then((movie) => {
// 	console.log(movie);
// });

//test getTicketData
// getTicketData("sunyesta").then((user) => {
//  console.log("USERRRRR:", user);
// });

function useTicketHistory(userId, callback) {
	const sql = `SELECT data FROM ticketData WHERE id = ${userId}`;
	const result = db.all(sql, [], (err, rows) => {
		handleErr(err);
		callback();
	});
}

funcs = {
	addUser,
	getUser,
	addTicketData,
	getTicketHistory,
	getData,
	getMovie,
	getMovieRange,
};

// --- debugging function calls

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function resetMovies() {
	const moviesList = require("./database/movies");
	dbUtils.dropTables(db);
	delay(1000).then(() => {
		buildTables();
		delay(1000)
			.then(() => {
				moviesList.forEach((movie) => {
					addMovie(movie);
				});
			})
			.then(() => {
				console.log("done");
			});
	});
}
// resetMovies();

// dbUtils.printTable(db, "movies");
// addUser("sunyesta", "zzz");
// addTicketData("sunyesta", new Date(), "dsf", "adf", 1);

// dbUtils.printTableNames(db);
// dbUtils.printTable(db, "ticketData");
// dbUtils.printTable(db, "users");

module.exports = { db, funcs };
