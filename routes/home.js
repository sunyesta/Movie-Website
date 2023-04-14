const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("home", { movieName: "" });
});

router.get("/:movieName", (req, res) => {
	res.render("home", { movieName: req.params.movieName });
});

module.exports = router;
