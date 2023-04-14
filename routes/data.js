const express = require("express");
const router = express.Router();
const checkAuthentication = require("../checkAuthentication");

// const movies = require("../database/movies");
const dbManager = require("../database-manager");

router.get("/movies/range/:start/:end", (req, res) => {
	const start = req.params.start,
		end = +req.params.end;
	// console.log("start:", start, "end:", end);
	// res.json(Object.values(movies).slice(start, end));
	dbManager.funcs.getMovieRange(start, end).then((movies) => {
		res.send(movies);
	});
});

router.get("/movies/name/:name", (req, res) => {
	const start = req.params.start,
		end = +req.params.end;
	// console.log("start:", start, "end:", end);
	// res.json(Object.values(movies).slice(start, end));
	dbManager.funcs.getMovie(req.params.name).then((movie) => {
		res.json(movie);
	});
});

router.get("/authorize", (req, res) => {
	if (req.isAuthenticated()) {
		res.send("true");
	} else {
		res.send("false");
	}
});

module.exports = router;
