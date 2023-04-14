const before = document.getElementById("before");
const after = document.getElementById("after");

// before.style.display = "block";
// after.style.display = "none";

const ticketData = document.querySelector("meta[ticketData]")
	? JSON.parse(
			document.querySelector("meta[ticketData]").getAttribute("ticketData")
	  )
	: "";

const localStorageKey = `movie-${ticketData.movieName}`;
console.log("localStorageKey = ", localStorageKey);

console.log(window.location.href);
document.getElementById("purchase").onclick = () => {
	localStorage.setItem(localStorageKey, "");
};

console.log(ticketData);
