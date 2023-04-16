/**
 * movieInfo router config
 */

// global variables
const express = require("express");
const router = express.Router();
const dbManager = require("../database-manager");

/**
 * error page for no movie slected
 */
router.get("/", (req, res) => {
	res.render("sendData", { data: "not a valid movie" });
});

/**
 * shows the movie info page for a movie. Otherwise shows an error if the movie was not found in the database
 */
router.get("/:movieName", async (req, res) => {
	const movie = await dbManager.funcs.getMovie(req.params.movieName);
	if (movie) {
		res.render("movieInfo", { movie: movie });
	} else {
		res.render("sendData", {
			data: "movie " + req.params.movieName + " not found",
		});
	}
});

module.exports = router;
