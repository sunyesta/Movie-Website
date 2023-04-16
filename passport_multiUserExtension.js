/**
 * adds multi user functionality to passport
 * NOTE: if you get an error where every page you go to is unauthorized (this happens if the database is reset while logged in), restart your cookies
 */

// packages
const cookieParser = require("cookie-parser");
const usersCookieName = "users";
const passport = require("passport");

function resetUsers(req, res) {
	res.cookie(usersCookieName, {}, { httpOnly: true });
}

/**
 * Updates the users cookie for a user
 * @param {} req
 * @param {*} res
 * @param {*} username username of the user we are updating
 * @param {*} user user obj, NULL if you want to remove the user
 */
function updateUsersCookie(req, res, username, user) {
	let cookie = req.cookies[usersCookieName];
	if (!cookie) {
		cookie = {};
	}
	if (user) {
		cookie[user.username] = user;
	} else {
		console.log("destroying username:", username);
		delete cookie[username];
	}
	console.log("cookie = ", cookie);
	res.cookie(usersCookieName, cookie, { httpOnly: true });
}

module.exports = function () {
	/**
	 * if no user is logged in, tries to log in the next user from the users cookie
	 */
	return function (req, res, next) {
		// global variables
		req.updateUsersCookie = updateUsersCookie;

		// website variables
		res.locals.users = req.cookies[usersCookieName] || {};
		res.locals.currentUser = req.user || "";

		//vars
		const prevUsername = req.body.username,
			prevPass = req.body.password;

		const users = res.locals.users;

		if (req.user) {
			//if a user is logged in, continue as normally
			next();
			return;
		} else {
			//if no user is logged in, log in a user from the users list

			const nextUser = users[Object.keys(users)[0]];
			if (!nextUser) {
				//if no user to log in,
				next();
				return;
			}

			console.log("nextUser = ", nextUser);
			req.body.username = nextUser.username;
			req.body.password = nextUser.password;

			passport.authenticate("local")(req, res, dummyNext);
			function dummyNext() {
				req.body.username = prevUsername;
				req.body.password = prevPass;

				res.locals.currentUser = req.user;
				next();
				return;
			}
		}
	};
};
