const path = require("path");

console.log("new dir name = ", __dirname);
console.log(`./.env.${process.env.NODE_ENV}`);
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const app = express();

const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport_multiUserExtension = require("./passport_multiUserExtension");

//data base
const dbManager = require("./database-manager");

//passport
const passport = require("passport");
const initPassport = require("./passport-config");
initPassport(
	passport,
	(getUserByUsername = async (username) => {
		try {
			return await dbManager.funcs.getUser(username);
		} catch (err) {
			console.error(err);
			return null;
		}
	})
);

// app config

app.set("views", path.join(__dirname, "/pug/pages"));
app.set("view engine", "pug");
app.set("json spaces", 2);

app.locals.basedir = path.join(__dirname, "/pug");

// external packages
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false })); //access form variables inside post method
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

// my packages
app.use(passport_multiUserExtension());

// routes
app.get("/index", (req, res) => {
	res.render("home");
});

app.get("/api", (req, res) => {
	res.json({ users: ["user one", "user two", "user three", "user four"] });
});

app.post(
	"/login",
	passport.authenticate("local", {
		// successRedirect: "/home",
		failureRedirect: "/users/login",
		failureFlash: true,
	}),
	(req, res) => {
		req.updateUsersCookie(req, res, req.user, req.user); //headerMiddleware function

		const curPath = req.get("referer");
		if (curPath == "/users/login") {
			res.redirect("/home");
		} else {
			res.redirect(curPath);
		}
	}
);

app.post("/dummy-logout", (req, res) => {
	console.log("give user = ", req.body.username);
	req.updateUsersCookie(req, res, req.body.username);
	res.redirect("/home");
});

// logout function
app.delete("/logout", (req, res) => {
	req.updateUsersCookie(req, res, req.user.username);

	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect(req.get("referer"));
	});
});

app.use("/movieInfo", require("./routes/movieInfo"));
app.use("/users", require("./routes/users"));
app.use("/", require("./routes/home"));
app.use("/tickets", require("./routes/tickets"));
app.use("/data", require("./routes/data"));

// ------- start server
app.listen(process.env.PORT, () => {
	console.log(`Server started on port ${process.env.PORT}`);
});

// pm2 start 'Homework 3 jade/main.js'
