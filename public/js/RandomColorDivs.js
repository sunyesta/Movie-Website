// You could easily add more colors to this array.

function randomColorDivs() {
	var boxes = document.querySelectorAll("div");
	// var button = document.querySelector("button");

	for (i = 0; i < boxes.length; i++) {
		maxValue = 200;
		function getValue() {
			let val = Math.floor(Math.random() * maxValue).toString(16);
			if (val.length == 1) {
				return "0" + val;
			} else {
				return val;
			}
		}

		let randomColor = "#" + getValue() + getValue() + getValue();
		console.log(randomColor);
		if (randomColor == "#ffffff") {
			randomColor = "#000000";
		}
		// <!-- document.body.style.backgroundColor = "#" + randomColor; -->
		// <!-- color.innerHTML = "#" + randomColor; -->
		// Pick a random color from the array 'colors'.
		boxes[i].style.backgroundColor = randomColor;
	}
}
randomColorDivs();

// button.style.cursor = "pointer";
