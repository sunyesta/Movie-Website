/**
 * Users router
 */

// packages
const express = require("express");
const router = express.Router();
const dbManager = require("../database-manager");
const bcrypt = require("bcrypt");
const passport = require("passport");
const checkAuthentication = require("../checkAuthentication");

/**
 * renders the user's profile page
 */
router.get("/profile", checkAuthentication.registered, (req, res) => {
	res.render("users/profile");
});

/**
 * render's the client's ticket history page
 */
router.get("/ticket-history", checkAuthentication.registered, (req, res) => {
	const ticketHistory = dbManager.funcs
		.getOrderHistory(req.user.username)
		.then((history) => {
			history = history.sort((a, b) => {
				return b.purchaseDate - a.purchaseDate;
			});
			console.log("######TICKETS", history);
			res.render("users/ticketHistory", { ticketDatas: history });
		});
});

/**
 * renders the register page
 */
router.get("/register", (req, res) => {
	res.render("users/register");
});

/**
 * registers a user and redirects the client back to the login page
 */
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

/**
 * renders the login page
 */
router.get("/login", (req, res) => {
	res.render("users/login");
});

/**
 * logs in a client
 */
router.post(
	"/login",
	(req, res, next) => {
		const passFunc = passport.authenticate("local", {
			//on failure
			failureRedirect: res.locals.root + "/users/login",
			failureFlash: true,
		});
		passFunc(req, res, next);
	},
	(req, res) => {
		req.updateUsersCookie(req, res, req.user, req.user); //headerMiddleware function

		res.redirect(res.locals.root + "/home");
	}
);

module.exports = router;
