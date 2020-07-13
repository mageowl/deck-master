heroCard.goto = (targetCard) => {
	if (targetCard == undefined || !heroCard.droppable) return false;

	// Change the CSS so the card can transition
	heroCard.style.transition = "top 500ms, left 500ms, transform 400ms";
	heroCard.droppable = false;
	heroCard.style.zIndex = 1;

	// Wait for transition to regester
	setTimeout(() => {
		// Go back and do all the turn stuff
		heroCard.dropHandler(heroCard, targetCard);
		// Set the left and top properties
		heroCard.style.left =
			targetCard.getBoundingClientRect().left -
			heroCard.parentNode.getBoundingClientRect().left;
		heroCard.style.top =
			targetCard.getBoundingClientRect().top -
			heroCard.parentNode.getBoundingClientRect().top;
	}, 10);

	setTimeout(() => {
		heroCard.style.transition = "transform 400ms";
		heroCard.droppable = true;
	}, 1510);
	return true;
};

let selected = null;
let sIndex = -1;
let storeSIndex = -1;
let menuButtons = Array.from(document.querySelectorAll(".menu-button"));
window.onkeydown = (e) => {
	if (health <= 0) return;
	// Start the game if you press Enter on the menu screen
	if (currentScreen == null) {
		if (e.key == "Enter" && selected != null) {
			selected.click();
			selected.classList.remove("selected");
			selected = null;
			sIndex = -1;
		} else if (e.key == "ArrowDown" || e.key == "ArrowUp") {
			let set = false;
			if (sIndex == -1) {
				sIndex = 0;
				set = true;
			}
			menuButtons[sIndex].classList.remove("selected");
			if (
				!set &&
				sIndex + (e.key == "ArrowDown" ? 1 : -1) < menuButtons.length &&
				sIndex + (e.key == "ArrowDown" ? 1 : -1) > -1
			)
				sIndex += e.key == "ArrowDown" ? 1 : -1;
			menuButtons[sIndex].classList.add("selected");
			selected = menuButtons[sIndex];
		}
	} else if (currentScreen == heroSelectElmt) {
		if (storeSIndex == -1 && (e.key == "ArrowRight" || e.key == "ArrowLeft")) {
			storeSIndex = 0;
			heroSelectCards[storeSIndex].classList.add("selected");
			return;
		}
		if (e.key == "ArrowRight") {
			heroSelectCards[storeSIndex].classList.remove("selected");
			let start = storeSIndex;
			const change = () => {
				storeSIndex++;
				if (storeSIndex > heroSelectCards.length - 1) return false;
				else if (heroSelectCards[storeSIndex].classList.contains("locked"))
					change();
				else {
					heroSelectCards[storeSIndex].classList.add("selected");
					return true;
				}
			};
			if (!change()) {
				heroSelectCards[start].classList.add("selected");
				storeSIndex = start;
			}
		} else if (e.key == "ArrowLeft") {
			heroSelectCards[storeSIndex].classList.remove("selected");
			let start = storeSIndex;
			const change = () => {
				storeSIndex--;
				if (storeSIndex < 0) return false;
				else if (heroSelectCards[storeSIndex].classList.contains("locked"))
					change();
				else {
					heroSelectCards[storeSIndex].classList.add("selected");
					return true;
				}
			};
			if (!change()) {
				heroSelectCards[start].classList.add("selected");
				storeSIndex = start;
			}
		} else if (e.key == "Enter" && storeSIndex != -1) {
			heroSelectCards[storeSIndex].click();
			storeSIndex = -1;
		}
	} else if (currentScreen == gameElmt) {
		if (heroCard.droppable == false) return;
		if (parseInt(storeElmt.style.opacity)) {
			if (e.key == "ArrowRight" && currentScreen == gameElmt) {
				storeCards[storeSIndex].classList.remove("selected");
				let start = storeSIndex;
				const change = () => {
					storeSIndex++;
					if (storeSIndex > 5) return false;
					else if (storeCards[storeSIndex].style.opacity == 1) {
						storeCards[storeSIndex].classList.add("selected");
						return true;
					} else if (storeSIndex < 6) return change();
					//document.querySelectorAll('#store .card.selected ~ .card')[0]
				};
				if (!change()) {
					storeCards[start].classList.add("selected");
					storeSIndex = start;
				}
			} else if (e.key == "ArrowLeft" && currentScreen == gameElmt) {
				storeCards[storeSIndex].classList.remove("selected");
				let start = storeSIndex;
				const change = () => {
					storeSIndex--;
					if (storeSIndex < 0) return false;
					else if (storeCards[storeSIndex].style.opacity == 1) {
						storeCards[storeSIndex].classList.add("selected");
						return true;
					} else if (storeSIndex < 6) return change();
				};
				if (!change()) {
					storeCards[start].classList.add("selected");
					storeSIndex = start;
				}
			} else if (e.key == "ArrowUp" || e.key == "ArrowDown") {
				scoreElmt.click();
				if (storeSIndex >= 0)
					storeCards[storeSIndex].classList.remove("selected");
			} else if (e.key == "Enter" && storeSIndex != -1) {
				storeCards[storeSIndex].click();
				storeSIndex = -1;
			} else if (e.key == "x") {
				flushButton.click();
			}
			return;
		}
		if (e.key == "ArrowRight") {
			if (!e.shiftKey || !hasWings)
				heroCard.goto(grid[2][playerPos + 1 - (grid[2].length == 1)]);
			else {
				hasWings = !heroCard.goto(grid[2][playerPos + 2]);
			}
		} else if (e.key == "ArrowLeft") {
			if (!e.shiftKey || !hasWings)
				heroCard.goto(grid[2][playerPos - 1 - (grid[2].length == 1)]);
			else {
				hasWings = !heroCard.goto(grid[2][playerPos - 2]);
			}
		} else if (e.key == "ArrowUp") {
			heroCard.goto(grid[2][playerPos - (grid[2].length == 1)]);
		} else if (e.key == "ArrowDown") {
			scoreElmt.click();
			let found = false;
			storeSIndex = -1;
			storeCards.forEach((card, i) => {
				if (card.style.opacity == 1 && !found) {
					storeSIndex = i;
					storeCards[i].classList.add("selected");
					found = true;
				}
			});
		}
	}
};

menuButtons.forEach((button) => {
	button.onmouseenter = () => {
		if (!menuButtons[sIndex]) return;
		menuButtons[sIndex].classList.remove("selected");
		selected = null;
		sIndex = -1;
	};
});
