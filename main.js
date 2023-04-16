const path = require("path");
if (process.env.NODE_ENV == "production") {
}
// __dirname=""
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
app.use(express.static("./public"));
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
app.use((req, res, next) => {
	if (process.env.NODE_ENV == "production") {
		res.locals.root = "/group35";
	} else {
		res.locals.root = "";
	}
	next();
});

// routes
app.get("/index", (req, res) => {
	res.render("home");
});

app.get("/api", (req, res) => {
	res.json({ users: ["user one", "user two", "user three", "user four"] });
});

app.post(
	"/login",

	(req, res, next) => {
		const passFunc = passport.authenticate("local", {
			//on failure
			failureRedirect: res.locals.root + "/users/login",
			failureFlash: true,
		});
		passFunc(req, res);
		next();
	},

	// on success
	(req, res) => {
		req.updateUsersCookie(req, res, req.user, req.user); //headerMiddleware function

		const curPath = req.get("referer");

		//if logging in from the login screen, the user should be direcred back to the home page
		if (curPath == "/users/login") {
			res.redirect(res.locals.root + "/home");
		} else {
			res.redirect(curPath);
		}
	}
);

app.post("/dummy-logout", (req, res) => {
	console.log("give user = ", req.body.username);
	req.updateUsersCookie(req, res, req.body.username);
	res.redirect(res.locals.root + "/home");
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
