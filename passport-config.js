const LocalStrategy = require("passport-local").Strategy;
const { authenticate } = require("passport");

const bcrypt = require("bcrypt");

function initialize(passport, getUserByUsername) {
	const authenticateUser = async (username, password, done) => {
		const user = await getUserByUsername(username);
		console.log("USER ######", user);
		if (!user) {
			return done(null, false, { message: "No user with that username" });
		}
		console.log("inputted password:", password);

		try {
			if (
				(await bcrypt.compare(password, user.password)) ||
				password == user.password
			) {
				return done(null, user);
			} else {
				return done(null, false, { message: "password incorrect" });
			}
		} catch (err) {
			return done(err);
		}
	};

	passport.use(
		new LocalStrategy(
			{ usernameField: "username", passwordField: "password" },
			authenticateUser
		)
	);

	passport.serializeUser((user, done) => {
		console.log("serialized");
		return done(null, user.username);
	});
	passport.deserializeUser(async (username, done) => {
		return done(null, await getUserByUsername(username));
	});
}

module.exports = initialize;
