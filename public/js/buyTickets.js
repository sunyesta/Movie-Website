/**
 * buyTickets page client side js
 */

// elements
const selectionWrapper = document.getElementById("selectionWrapper");
const validSelection = document.getElementById("validSelection");
const invalidSelection = document.getElementById("invalidSelection");
const ticketInput = document.getElementById("ticketInput");
const movieSlotButtons = document.querySelectorAll(".movieSlotButton");
let selectedButton = null;

// meta paramaters
const movie = JSON.parse(
	document.querySelector("meta[movie]").getAttribute("movie")
);

// config
const minTickets = 1,
	maxTickets = 100;
const localStorageKey = `movie-${movie.name}`;

//init values
const startingStorageData = localStorage.getItem(localStorageKey)
	? JSON.parse(localStorage.getItem(localStorageKey))
	: { slotID: null, tickets: null };

// console.log("local = ", localStorage.getItem(localStorageKey));

selectSlot(
	document.querySelector(`[slotID = "${startingStorageData.slotID}"]`) || null
);

setTicketVal(startingStorageData.tickets);

// util functions

function updateLocalStorage() {
	const tickets = ticketInput.value;
	const slotId = selectedButton ? selectedButton.getAttribute("slotID") : "";

	localStorage.setItem(
		localStorageKey,
		JSON.stringify({
			slotID: slotId,
			tickets: tickets,
		})
	);
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

function selectSlot(button) {
	if (selectedButton) {
		selectedButton.classList.remove("button-red");
		// selectedButton.classList.remove("button-flipOnClick");
	}
	if (!button) {
		setPurchaseAllowed(false);
		return;
	}

	setPurchaseAllowed(true);

	selectedButton = button;
	selectedButton.classList.add("button-red");
	updateLocalStorage();
}

function setTicketVal(val) {
	newVal = Math.min(Math.max(val, minTickets), maxTickets);
	ticketInput.value = newVal;
	updateLocalStorage();
}

// event listeners

movieSlotButtons.forEach((button) => {
	button.onclick = () => {
		selectSlot(button);
	};
});

ticketInput.onchange = () => {
	setTicketVal(+ticketInput.value);
};

document.getElementById("addTicket").onclick = () => {
	setTicketVal(+ticketInput.value + 1);
};

document.getElementById("subTicket").onclick = () => {
	setTicketVal(+ticketInput.value - 1);
};

document.getElementById("purchase").onclick = () => {
	window.location.pathname = `tickets/confirm/${movie.name}/${
		ticketInput.value
	}/${selectedButton.getAttribute("slotID")}`;
};
