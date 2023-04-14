function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/users/login");
	}

	// return next();
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect("/home");
	} else {
		return next();
	}
}

module.exports = {
	registered: checkAuthenticated,
	anonymous: checkNotAuthenticated,
};
