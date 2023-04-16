/**
 * Home router config
 */

// global variables
const express = require("express");
const router = express.Router();

/**
 * renders home page
 */
router.get("/", (req, res) => {
	res.render("home", { movieName: "" });
});

/**
 * renders the home page in the ticket view for a movie
 */
router.get("/:movieName", (req, res) => {
	res.render("home", { movieName: req.params.movieName });
});

module.exports = router;
