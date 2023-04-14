const movieName = document
	.querySelector("meta[movieName]")
	.getAttribute("movieName");

loadMovieByName(movieName).then((movie) => {
	console.log(movie);
});

function loadMovieByName(name) {
	//adds movie.organisedTimeSlots to the movie
	return new Promise((resolve, reject) => {
		const xhttp = new XMLHttpRequest();
		xhttp.onload = function () {
			const response = this.responseText;
			if (response == "null") {
				console.log("MOVIE NOT FOUND");
				resolve(null);
			}
			const movie = JSON.parse(response);
			resolve(movie);
		};

		xhttp.open("GET", `/data/movies/name/${name}`);
		xhttp.send();
	});
}
