// Fills the database with movies (only called in DEBUG mode)

const { Dir } = require("fs");

//TODO don't generate random seconds
function randomDate(start, end, startHour, endHour) {
	var date = new Date(+start + Math.random() * (end - start));
	var hour = (startHour + Math.random() * (endHour - startHour)) | 0;

	date.setHours(hour);
	date.setSeconds(0, 0);
	return date;
}

const loremIpsum =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

class Movie {
	constructor({
		title: name,
		poster: posterURL,
		description: description,
		genre: genre,
		trailer: trailerURLid,
		releaseYear: releaseYear,
		timeSlots: timeSlots,
		directors: directors,
		actors: actors,
		writers: writers,
	}) {
		const randomTimeSlots = () => {
			let timeSlots = [];

			const startDate = new Date();

			const endDate = new Date();
			endDate.setDate(startDate.getDate() + 5);

			for (let i = 0; i < 20; i++) {
				timeSlots.push(randomDate(startDate, endDate, 0, 24));
			}
			return timeSlots;
		};

		this.name = name || "Default Movie Name";
		this.posterURL = posterURL || "https://i.imgur.com/removed.png";
		this.description = description || loremIpsum;
		this.genre = genre.toString() || "generic";
		this.trailerURLid = trailerURLid || "fgxclUnQI8A";
		this.releaseYear = releaseYear || 2000;
		this.timeSlots = randomTimeSlots();

		// console.log("artists for :", name, directors, actors, writers);
		this.artists = {
			directors: directors || ["cat"],
			actors: actors || ["cat"],
			writers: writers || ["cat"],
		};
	}
}

class Artist {
	constructor(name, yearOfBirth) {
		this.name = name;
		this.yearOfBirth = yearOfBirth;
	}
}

class Director extends Artist {
	constructor(name, yearOfBirth, moviesDirected) {
		super(name, yearOfBirth);
		this.moviesDirected = moviesDirected || [];
	}
}

class Writer extends Artist {
	constructor(name, yearOfBirth, booksWritten, movie) {
		super(name, yearOfBirth);
		this.booksWritten = booksWritten || [];
		this.movie = movie;
	}
}

class Actor extends Artist {
	constructor(name, yearOfBirth, moviesStarred, imageLink) {
		super(name, yearOfBirth);
		this.moviesStarred = moviesStarred || [];
		this.imageLink = imageLink;
	}
}

module.exports = [
	new Movie({
		title: "Solar Opposites",
		poster:
			"https://image.tmdb.org/t/p/original/gubrMK0S1xgrZQlSsj00csOFCxU.jpg",
		genre: ["comedy", "animation", "sci-fi"],
		description:
			"A team of aliens arrive at Earth with the mission to terraform it but instead they find out that they love novelty items and start to call eath their home.",
		releaseYear: 2017,
		trailer: "UN7OH4d3CEw",
		actors: ["Justin Roiland", "Thomas Middleditch", "Kari Wahlgren"],
		writers: ["Jen McCartney", "Garrick Bernard", "Ariel Ladensohn"],
		directors: ["Kim Arndt", "Anthony Chun", "Lucas Gray"],
	}),
	new Movie({
		title: "Napoleon Dynamite",
		poster:
			"https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/51eCC-LVfuL._AC_UF894,1000_QL80_.jpg",
		genre: ["comedy", "cult", "classic"],
		description:
			"A listless and alienated teenager decides to help his new friend win the class presidency in their small western high school, while he must deal with his bizarre family life back home.",
		releaseYear: 2004,
		trailer: "W1IgJoRJ34Q",
		actors: ["John Heder", "John Gries", "Aaron Ruell"],
		writers: ["Jared Hess", "Jerusha Hess"],
		directors: ["Lucas Gray", "Coral Canne"],
	}),
	new Movie({
		title: "Corpse Bride",
		poster:
			"https://cdn11.bigcommerce.com/s-ydriczk/images/stencil/1280x1280/products/84535/94607/Corpse-Bride-advance-Style-Double-sided-original-movie-poster-buy-now-at-starstills__89174.1599751254.jpg?c=2",
		genre: ["animation", "drama", "family"],
		description:
			"Set back in the late 1800s in a Victorian village, a man and woman by the names of Victor Van Dort and Victoria Everglot are betrothed because the Everglots need the money or else they'll be living on the streets and the Van Dorts want to be high in society.But when things go wrong at the wedding rehearsal, Victor goes into the woods to practice his vows.Just as soon as he gets them right, he finds himself married to Emily, the corpse bride. While Victoria waits on the other side, there's a rich newcomer that may take Victor's place.",
		releaseYear: 2005,
		trailer: "AGACeWVdFqo",
		actors: ["Johnny Depp", "Helena Bonhem Carter", "Emily Watson"],
		writers: ["Carlos Grangel", "John August", "Caroline Thompson"],
		directors: ["Mike Johnson", "Tim Burton"],
	}),
	new Movie({
		title: "The Godfather",
		poster:
			"https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
		genre: ["crime", "drama", "action"],
		description:
			"The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
		releaseYear: 1972,
		trailer: "UaVTIH8mujA",
		actors: ["Marlon Brando", "Al Pacino", "Diane Keaton"],
		writers: ["Mario Puzo"],
		directors: ["Francis Ford Coppola"],
	}),
	new Movie({
		title: "John Wick",
		poster: "https://img.fruugo.com/product/6/29/14468296_max.jpg",
		genre: ["action", "crime", "thriller"],
		description:
			"An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took his car.",
		releaseYear: 2014,
		trailer: "2AUmvWm5ZDQ",
		actors: ["Keanu Reeves", "Alfie Allen", "Willem Dafoe"],
		writers: ["Derek Kolstad"],
		directors: ["Chad Stahelski", "David Leitch"],
	}),
	new Movie({
		title: "Lawless",
		poster:
			"https://m.media-amazon.com/images/M/MV5BMjAxNjUyNjUwN15BMl5BanBnXkFtZTcwMDgwOTIyOA@@._V1_.jpg",
		genre: ["history", "crime", "drama"],
		description:
			"Set in Depression-era Franklin County, Virginia, a trio of bootlegging brothers are threatened by a new special deputy and other authorities angling for a cut of their profits.",
		releaseYear: 2012,
		trailer: "rcnkarT81L4",
		actors: ["Tom Hardy", "Shia LaBeouf", "Jessica Chastain"],
		writers: ["Nick Cave", "Matt Bondurant"],
		directors: ["John Hillcoat"],
	}),
	new Movie({
		title: "The Harder They Fall",
		poster:
			"https://m.media-amazon.com/images/M/MV5BZTQwYThhZTYtZTQ3MC00NDQ0LWFkZGMtMzdiMTU3OGJiYTY0XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
		genre: ["action", "drama", "western"],
		description:
			"When an outlaw discovers his enemy is being released from prison, he reunites his gang to seek revenge.",
		releaseYear: 2021,
		trailer: "Poc55U2RPMw",
		actors: ["Jonathan Majors", "Regina King", "Idris Elba"],
		writers: ["Boaz Yakin"],
		directors: ["Jeymes Samuel"],
	}),
	new Movie({
		title: "The Gentlemen",
		poster:
			"https://image.tmdb.org/t/p/original/jtrhTYB7xSrJxR1vusu99nvnZ1g.jpg",
		genre: ["action", "comedy", "crime"],
		description:
			"An American expat tries to sell off his highly profitable marijuana empire in London, triggering plots, schemes, bribery and blackmail in an attempt to steal his domain out from under him.",
		releaseYear: 2019,
		trailer: "Ify9S7hj480",
		actors: ["Matthew McConaughey", "Charlie Hunnam", "Collin Farrell"],
		writers: ["Ican Atkinson", "Marn Davies"],
		directors: ["Guy Ritchie"],
	}),
	new Movie({
		title: "What We Do In the Shadows",
		poster:
			"https://m.media-amazon.com/images/M/MV5BYmYyYWY4NjgtNGQ2Yi00NDNiLWJlOTgtYjI1MTI0NjZkNjhhXkEyXkFqcGdeQXVyNDE5MTU2MDE@._V1_.jpg",
		genre: ["comedy", "horror", "cult"],
		description:
			"Viago, Deacon, and Vladislav are vampires who are struggling with the mundane aspects of modern life, like paying rent, keeping up with the chore wheel, trying to get into nightclubs, and overcoming flatmate conflicts.",
		releaseYear: 2014,
		trailer: "IAZEWtyhpes",
		actors: ["Jermaine Clement", "Taika Waititi"],
		writers: ["Jermaine Clement", "Taika Waititi"],
		directors: ["Jermaine Clement", "Taika Waititi", "Jonny Brugh"],
	}),
	new Movie({
		title: "This Is Where I Leave You",
		poster:
			"https://m.media-amazon.com/images/M/MV5BMjkzNzQ2NDMyNl5BMl5BanBnXkFtZTgwMTY3MTcxMjE@._V1_FMjpg_UX1000_.jpg",
		genre: ["comedy", "drama", "family"],
		description:
			"After their father passes away, four grown siblings are forced to return to their childhood home and live under the same roof for a week, along with their over-sharing mother and an assortment of spouses, exes, and might-have-beens.",
		releaseYear: 2014,
		trailer: "fH0cEP0mvlU",
		actors: ["Jason Bateman", "Tina Fey", "Jane Fonda"],
		writers: ["Jonathan Tropper"],
		directors: ["Jonathan Tropper"],
	}),
	new Movie({
		title: "In Bruges",
		poster:
			"https://m.media-amazon.com/images/M/MV5BMTUwOGFiM2QtOWMxYS00MjU2LThmZDMtZDM2MWMzNzllNjdhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
		genre: ["comedy", "crime", "drama"],
		description:
			"Guilt-stricken after a job gone wrong, hitman Ray and his partner await orders from their ruthless boss in Bruges, Belgium, the last place in the world Ray wants to be.",
		releaseYear: 2008,
		trailer: "96harmMOyiY",
		actors: ["Collin Farrel", "Ralph Fiennes", "Brendan Gleeson"],
		writers: ["Martin McDonagh"],
		directors: ["Martin McDonagh"],
	}),
	new Movie({
		title: "The Grand Budapest Hotel",
		poster:
			"https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_.jpg",
		genre: ["adventure", "comedy", "crime"],
		description:
			"A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
		releaseYear: 2014,
		trailer: "1Fg5iWmQjwk",
		actors: ["Ralph Fiennes", "Willem Dafoe", "Tilda Swilton"],
		writers: ["Stefan Zweig", "Hugo Guinness"],
		directors: ["Wes Anderson"],
	}),
	new Movie({
		title: "Superbad",
		poster: "https://m.media-amazon.com/images/I/51SH8iQ0X7L._AC_.jpg",
		genre: ["comedy", "adventure", "cult"],
		description:
			"Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
		releaseYear: 2007,
		trailer: "LvKvus3vCEY",
		actors: ["Jonah Hill", "Michael Cera", "Christopher Mintz-Plasse"],
		writers: ["Seth Rogen", "Evan Goldberg"],
		directors: ["Greg Mottola"],
	}),
	new Movie({
		title: "I Love You, Man",
		poster:
			"https://m.media-amazon.com/images/M/MV5BMTU4MjI5NTEyNV5BMl5BanBnXkFtZTcwNjQ1NTMzMg@@._V1_.jpg",
		genre: ["comedy", "romance", "family"],
		description:
			"Friendless Peter Klaven goes on a series of man-dates to find a Best Man for his wedding. But, when his insta-bond with his new B.F.F. puts a strain on his relationship with his fiancée, can the trio learn to live happily ever after?",
		releaseYear: 2009,
		trailer: "TJU061IOMMU",
		actors: ["Paul Rudd", "Rashida Jones", "Jason Segel"],
		writers: ["John Hamburg", "Larry Levin"],
		directors: ["John Hamburg"],
	}),
	new Movie({
		title: "Deadpool",
		poster:
			"https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
		genre: ["action", "comedy"],
		description:
			"A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.",
		releaseYear: 2016,
		trailer: "ONHBaC-pfsk",
		actors: ["Ryan Renolds", "Karan Soni", "Ed Skrein"],
		writers: ["Rhett Reese", "Paul Wernick"],
		directors: ["Tim Miller"],
	}),
	new Movie({
		title: "Mad Max: Fury Road",
		poster:
			"https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
		genre: ["action", "adventure", "sci-fi"],
		description:
			"In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper and a drifter named Max.",
		releaseYear: 2015,
		trailer: "hEJnMQG9ev8",
		actors: ["Tom Hardy", "Charlize Theron", "Zoë Kravitz"],
		writers: ["George Miller", "Brandan McCarthy", "Nick Lathouris"],
		directors: ["George Miller"],
	}),
	new Movie({
		title: "Step Brothers",
		poster:
			"https://m.media-amazon.com/images/M/MV5BODViZDg3ZjYtMzhiYS00YTVkLTk4MzktYWUxMTlkYjc1NjdlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
		genre: ["comedy"],
		description:
			"Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry.",
		releaseYear: 2008,
		trailer: "CewglxElBK0",
		actors: ["Will Ferrel", "John C. Reily", "Adam Scott"],
		writers: ["Will Ferrell", "John C. Reily", "Adam McKay"],
		directors: ["Adam McKay"],
	}),
	new Movie({
		title: "Anchorman: The Legend of Ron Burgundy",
		poster:
			"https://i.etsystatic.com/23402008/r/il/ece281/2375642237/il_570xN.2375642237_dvts.jpg",
		genre: ["comedy"],
		description:
			"In the 1970s, an anchorman's stint as San Diego's top-rated newsreader is challenged when an ambitious newswoman becomes his co-anchor.",
		releaseYear: 2004,
		trailer: "j3tKJoidT_o",
		actors: ["Will Ferrel", "Christina Applegate", "Paul Rudd"],
		writers: ["Will Ferrell", "Adam McKay"],
		directors: ["Adam McKay"],
	}),
	new Movie({
		title: "The Death of Stalin",
		poster:
			"https://images.fandango.com/ImageRenderer/820/0/redesign/static/img/default_poster.png/0/images/masterrepository/fandango/204557/Death-Of-Stalin-poster.jpg",
		genre: ["comedy", "drama", "history"],
		description:
			"Moscow, 1953. After being in power for nearly 30 years, Soviet dictator Joseph Vissarionovich Stalin takes ill and quickly dies. Now the members of the Council of Ministers scramble for power.",
		releaseYear: 2017,
		trailer: "ukJ5dMYx2no",
		actors: ["Paddy Constantine", "Jeffrey Tambor", "Steve Buscemi"],
		writers: ["Fabien Nury", "Thierry Robin", "David Schneider"],
		directors: ["Armando Iannucci"],
	}),
	new Movie({
		title: "They Live",
		poster:
			"https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/71YhabZvwTL._AC_SY741_.jpg",
		genre: ["action", "horror", "sci-fi"],
		description:
			"They influence our decisions without us knowing it. They numb our senses without us feeling it. They control our lives without us realizing it. They live.",
		releaseYear: 1988,
		trailer: "iJC4R1uXDaE",
		actors: ["Roddy Piper", "Keith David", "Meg Foster"],
		writers: ["Ray Nelson", "John Carpenter"],
		directors: ["John Carpenter"],
	}),
];
