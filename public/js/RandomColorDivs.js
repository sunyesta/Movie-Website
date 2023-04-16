/**
 * FOR DEBUG ONLY
 * sets divs to random colors
 */

/**
 * sets divs to random colors
 */
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
		boxes[i].style.backgroundColor = randomColor;
	}
}
randomColorDivs();
