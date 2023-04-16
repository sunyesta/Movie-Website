const express = require("express");
const router = express.Router();

// const users = require("../database/users");
// const movies = require("../database/movies");
const dbManager = require("../database-manager");
const bcrypt = require("bcrypt");
const passport = require("passport");
const checkAuthentication = require("../checkAuthentication");

router.get("/", (req, res) => {
	res.json(users);
});

router.get("/profile", checkAuthentication.registered, (req, res) => {
	res.render("users/profile");
});

router.get("/ticket-history", checkAuthentication.registered, (req, res) => {
	const ticketHistory = dbManager.funcs
		.getTicketHistory(req.user.username)
		.then((history) => {
			history = history.sort((a, b) => {
				return b.purchaseDate - a.purchaseDate;
			});
			console.log("######TICKETS", history);
			res.render("users/ticketHistory", { ticketDatas: history });
		});
});

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post("/register", async (req, res) => {
	try {
		const username = req.body.username,
			password = req.body.password,
			name = req.body.name,
			email = req.body.email,
			address = req.body.address,
			creditcard = req.body.creditcard;

		const user = await dbManager.funcs.getUser(username);
		if (user) {
			throw "user already defined";
		}
		const hashedPassword = await bcrypt.hash(password, 3);
		dbManager.funcs.addUser(
			username,
			hashedPassword,
			name,
			email,
			address,
			creditcard
		);
		res.redirect(res.locals.root + "/users/login");
		console.log("success");
	} catch (err) {
		res.render(res.locals.root + "users/register", { error: err });
	}
});

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		// successRedirect: "/home",
		failureRedirect: "/users/login",
		failureFlash: true,
	}),
	(req, res) => {
		req.updateUsersCookie(req, res, req.user, req.user); //headerMiddleware function

		res.redirect(res.locals.root + "/home");
	}
);

module.exports = router;
