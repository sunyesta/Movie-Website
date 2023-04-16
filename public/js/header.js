/**
 * header client side js
 */

const usersSlide = document.getElementById("users-slide");
const usersBtn = document.getElementById("users-btn");
if (usersBtn) {
	let open = false;
	usersBtn.onclick = () => {
		if (open) {
			console.log("slide1");
			usersSlide.classList.remove("users-slide-translate");
			open = false;
		} else {
			console.log("slide2");
			usersSlide.classList.add("users-slide-translate");
			open = true;
		}
	};
}
