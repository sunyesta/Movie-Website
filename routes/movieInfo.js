const express = require("express");
const router = express.Router();

// const movies = require("../database/movies");
const dbManager = require("../database-manager");

router.get("/", (req, res) => {
	res.json(movies);
});

router.get("/:movieName", async (req, res) => {
	// res.render("movieInfo");
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
