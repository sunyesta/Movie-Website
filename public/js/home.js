// global constants
const viewsElem = document.getElementById("views");
const ticketPageView = document.getElementById("tickets-view");
const moviesPageView = document.getElementById("movies-view");
const views = { movies: "movies", tickets: "tickets" };
const root = document.querySelector("meta[name = root]").content;
// global variables

// config
const minTickets = 1,
	maxTickets = 100;
let isAuthenticated;

// ---- movies view ----
const movieIncrement = 3;
const loadedMovies = {};
const movieElemTemplate = document.getElementById("movieElemTemplate");
const moviesContainer = document.getElementById("movie-selection-frame");
const movieName = document
	.querySelector("meta[movieName]")
	.getAttribute("movieName");

if (movieName) {
	loadMovieByName(movieName).then((success) => {
		if (success) {
			loadTicketsPage(loadedMovies[movieName]);
			setView(views.tickets);
		}
	});
}

let lastMovie = 0;

loadMovies();
checkAuthentication();

document.getElementById("more-movies-btn").onclick = function () {
	loadMovies();
};

function checkAuthentication() {
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		isAuthenticated = this.responseText === "true";
		console.log("isAuthenticated", isAuthenticated, this.responseText);
	};
	xhttp.open("GET", `/data/authorize`);
	xhttp.send();
}

//funcs

function addMovieElem(movie) {
	if (loadedMovies[movie.name]) {
		return;
	}
	let ticketURL = "/tickets/movies/" + movie.name;
	let infoPageURL = "/movieInfo/" + movie.name;

	const newMovieElem = document.createElement("div");
	newMovieElem.setAttribute("name", movie.name);
	newMovieElem.innerHTML = movieElemTemplate.innerHTML;
	// newMovieElem.querySelector(".ticketURL").href = ticketURL;
	newMovieElem.querySelector(".moviePoster").src = movie.posterURL;
	newMovieElem.querySelector(".infoPageURL").href = infoPageURL;

	newMovieElem.querySelector(".moviePoster").onclick = function () {
		if (loadTicketsPage(movie)) {
			setView(views.tickets);
		}
	};

	moviesContainer.appendChild(newMovieElem);
}

function organiseTimeSlots(movie) {
	let organizedTimeSlots = [];
	//make date slots
	movie.timeSlots.forEach((date) => {
		date = new Date(date);
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
			return slot1 - slot2;
		});
		return slotsList;
	});

	movie.organizedTimeSlots = organizedTimeSlots;
	console.log(movie.name, organizedTimeSlots[2]);
}

function loadMovies() {
	//adds movie.organisedTimeSlots to the movie

	const xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		const movies = JSON.parse(this.responseText);
		// console.log(movies);
		movies.forEach((movie) => {
			addMovieElem(movie);
			organiseTimeSlots(movie);
			loadedMovies[movie.name] = movie;
		});
		moviesPageView.scrollTop = moviesPageView.scrollHeight;
	};
	const newLastMovie = lastMovie + movieIncrement;
	xhttp.open("GET", `/data/movies/range/${lastMovie}/${newLastMovie}`);
	console.log("got movies: ", lastMovie, newLastMovie);
	lastMovie = newLastMovie;
	xhttp.send();
}

function loadMovieByName(name) {
	//adds movie.organisedTimeSlots to the movie
	return new Promise((resolve, reject) => {
		const xhttp = new XMLHttpRequest();
		xhttp.onload = function () {
			const response = this.responseText;
			if (response == "null") {
				console.log("MOVIE NOT FOUND");
				resolve(false);
			}
			const movie = JSON.parse(response);
			// console.log(movies);
			if (movie) {
				addMovieElem(movie);
				organiseTimeSlots(movie);
				loadedMovies[movie.name] = movie;
				moviesPageView.scrollTop = moviesPageView.scrollHeight;
			}

			resolve(true);
		};

		xhttp.open("GET", `/data/movies/name/${name}`);
		xhttp.send();
	});
}

// ---- tickets view ----
const ticketInput = document.getElementById("ticketInput");

let selectedMovieSlotBtn = null;
let curMovie = null;

// if the back button is clicked, move the tickets back
document.getElementById("back-to-view-1").onclick = () => {
	setView(views.movies);
};

//funcs
let selector = "";
//loads the current movie
function loadTicketsPage(movie) {
	console.log(isAuthenticated);
	// if (!isAuthenticated) {
	// 	window.location.pathname = "/users/login";
	// 	return false;
	// }
	curMovie = movie;

	ticketPageView.querySelector(".movie-name").innerText = movie.name;
	ticketPageView.querySelector(".moviePoster").src = movie.posterURL;
	ticketPageView.querySelector("#movie-info-button").onclick = function () {
		window.location.pathname = `/movieInfo/${movie.name}`;
	};
	const ticketTable = ticketPageView.querySelector("#ticketTable");
	ticketTable.innerHTML = "";
	movie.organizedTimeSlots.forEach((slotlist) => {
		const tr = document.createElement("tr");
		ticketTable.appendChild(tr);

		const th = document.createElement("th");
		tr.appendChild(th);
		th.innerText = slotlist.date.toLocaleDateString("en-US");

		const td = document.createElement("td");
		tr.appendChild(td);
		td.classList.add(...["flex", "flex-row", "flex-wrap", "child-margin-tiny"]);
		slotlist.slots.forEach((time) => {
			let timeFormatted = time.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});

			const button = document.createElement("button");
			tr.appendChild(button);
			button.classList.add(
				...[
					"movieSlotButton",
					"button-1",
					"button-inactive",
					"button-raise",
					"margin-small",
				]
			);

			button.innerText = timeFormatted;
			button.setAttribute("slotID", time.toJSON());
			button.onclick = () => {
				selectSlot(button);
			};
		});
	});

	//restore data
	const localStorageKey = `movie-${movie.name}`;
	function getStorageData() {
		return localStorage.getItem(localStorageKey)
			? JSON.parse(localStorage.getItem(localStorageKey))
			: { slotID: null, tickets: null };
	}
	const { slotID: slotId, tickets: tickets } = getStorageData();
	selectSlot(document.querySelector(`[slotID = "${slotId}"]`));
	setTicketVal(tickets);
	return true;
}

function selectSlot(button) {
	if (selectedMovieSlotBtn) {
		selectedMovieSlotBtn.classList.remove("button-red");
		// selectedMovieSlotBtn.classList.remove("button-flipOnClick");
	}
	if (!button) {
		setPurchaseAllowed(false);
		return;
	}

	setPurchaseAllowed(true);

	selectedMovieSlotBtn = button;
	selectedMovieSlotBtn.classList.add("button-red");
	updateLocalStorage();
}

function setPurchaseAllowed(allowed) {
	if (allowed) {
		invalidSelection.style.display = "none";
		validSelection.style.display = "block";
	} else {
		invalidSelection.style.display = "block";
		validSelection.style.display = "none";
	}
}

function updateLocalStorage() {
	const localStorageKey = `movie-${curMovie.name}`;
	const tickets = ticketInput.value;
	const slotId = selectedMovieSlotBtn
		? selectedMovieSlotBtn.getAttribute("slotID")
		: "";

	localStorage.setItem(
		localStorageKey,
		JSON.stringify({
			slotID: slotId,
			tickets: tickets,
		})
	);
}

//ticket input

ticketInput.onchange = () => {
	setTicketVal(+ticketInput.value);
};

function setTicketVal(val) {
	newVal = Math.min(Math.max(val, minTickets), maxTickets);
	ticketInput.value = newVal;
	updateLocalStorage();
}

document.getElementById("addTicket").onclick = () => {
	setTicketVal(+ticketInput.value + 1);
};

document.getElementById("subTicket").onclick = () => {
	setTicketVal(+ticketInput.value - 1);
};

console.log("root = ", root);
document.getElementById("purchase").onclick = () => {
	window.location.pathname =
		root +
		"/tickets/confirm/" +
		curMovie.name +
		"/" +
		ticketInput.value +
		"/" +
		selectedMovieSlotBtn.getAttribute("slotID");
};

// ---- general ----
function setView(view) {
	if (view == views.tickets) {
		viewsElem.style.transform = "translateX(-50%)";
	} else {
		viewsElem.style.transform = "translateX(0%)";
	}
}
setView(views.movies);
// setView(false);
