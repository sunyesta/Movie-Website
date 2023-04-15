const express = require("express");
const router = express.Router();
const dbManager = require("../database-manager");
// const movies = require("../database/movies");
const checkAuthentication = require("../checkAuthentication");

router.get("/", async (req, res) => {
	res.json(await dbManager.funcs.getMovieRange(0, 4));
});

router.get("/orderComplete", (req, res) => {
	res.render("tickets/thankyou");
});

//movie ticket page
router.get(
	"/movies/:movieName",
	checkAuthentication.registered,
	async (req, res) => {
		const movie = await dbManager.funcs.getMovie(req.params.movieName);
		if (movie) {
			let organizedTimeSlots = [];
			//make date slots
			movie.timeSlots.forEach((date) => {
				const onlyDate = new Date(
					date.getFullYear(),
					date.getMonth(),
					date.getDate()
				);

				let slotsList = organizedTimeSlots.find((otherSlotList) => {
					return otherSlotList.date.getDate() == date.getDate();
				});
				if (!slotsList) {
					slotsList = { date: onlyDate, slots: [] }; // dayslot
					organizedTimeSlots.push(slotsList);
				}
				slotsList.slots.push(date);
			});

			//sort dates
			organizedTimeSlots = organizedTimeSlots.sort((slotsList1, slotsList2) => {
				return slotsList1.date - slotsList2.date;
			});

			//sort times
			organizedTimeSlots = organizedTimeSlots.map((slotsList) => {
				slotsList.slots = slotsList.slots.sort((slot1, slot2) => {
					return slot1.date - slot2.date;
				});
				return slotsList;
			});

			res.render("tickets/buyTickets", {
				movie: movie,
				timeSlots: organizedTimeSlots,
			});
		}
	}
);

// confirm order page
router.get(
	"/confirm/:movieName/:tickets/:slotID",
	checkAuthentication.registered,
	async (req, res) => {
		const movie = await dbManager.funcs.getMovie(req.params.movieName);
		console.log("MOVIE =", movie);
		if (movie) {
			const date = movie.timeSlots.find((slot) => {
				console.log(slot);
				return req.params.slotID == slot.toJSON();
			});

			if (!date) {
				res.render("sendData", { data: "unknown movie slot id" });
				return;
			}

			const ticketData = {
				date: date,
				movieName: movie.name,
				moviePosterURL: movie.posterURL,
				tickets: req.params.tickets,
			};

			res.render("tickets/confirmTicketOrder", {
				ticketData: ticketData,
				complete: false,
			});
		} else {
			res.render("sendData", { data: "invalid movie" });
		}
	}
);

router.post("/buy", checkAuthentication.registered, (req, res) => {
	// req.body.name
	console.log("ticket data", req.body.ticketData);
	const ticketData = JSON.parse(req.body.ticketData);

	dbManager.funcs.addTicketData(
		req.user.username,
		ticketData.date,
		ticketData.movieName,
		ticketData.moviePosterURL,
		ticketData.tickets
	);
	res.redirect(res.locals.root + "/tickets/orderComplete");
});

module.exports = router;
