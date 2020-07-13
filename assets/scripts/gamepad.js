let mapper = new GamepadMap(0);
let gamepadConnected = false;

document.getElementById("gamepad-btn").onclick = () => {
	mapper.reload();

	switch (mapper.model.split(" (")[0]) {
		case "noPad":
			gamepadConnected = false;
			break;

		case "Joy-Con L+R":
			mapper.addMappedBtn("B", 0);
			mapper.addMappedBtn("A", 1);
			mapper.addMappedBtn("Y", 2);
			mapper.addMappedBtn("X", 3);
			mapper.addMappedBtn("leftTrig", 6);
			mapper.addMappedBtn("rightTrig", 7);
			mapper.addMappedAxis("horz", 0);
			mapper.addMappedAxis("vert", 1);
			document.getElementById("gamepad-btn").innerText = "Joy-Cons";
			gamepadConnected = true;
			gamepadInputLoop();
			break;

		case "Xbox 360 Controller":
			mapper.addMappedBtn("B", 1);
			mapper.addMappedBtn("A", 0);
			mapper.addMappedBtn("Y", 3);
			mapper.addMappedBtn("X", 2);
			mapper.addMappedBtn("leftTrig", 6);
			mapper.addMappedBtn("rightTrig", 7);
			mapper.addMappedAxis("horz", 0);
			mapper.addMappedAxis("vert", 1);
			document.getElementById("gamepad-btn").innerText = "Xbox Controller";
			gamepadConnected = true;
			gamepadInputLoop();
			break;

		default:
			break;
	}
};

const gamepadInputLoop = () => {
	if (!gamepadConnected) return;
	requestAnimationFrame(gamepadInputLoop);
	if (currentScreen == null) {
		if (mapper.getBtnPress("A") && selected != null) {
			selected.click();
			selected.classList.remove("selected");
			selected = null;
			sIndex = -1;
		} else if (mapper.getAxis("vert") < -0.5 || mapper.getAxis("vert") > 0.5) {
			let set = false;
			if (sIndex == -1) {
				sIndex = 0;
				set = true;
			}
			menuButtons[sIndex].classList.remove("selected");
			if (
				!set &&
				sIndex + (mapper.getAxis("vert") > 0.5 ? 1 : -1) < menuButtons.length &&
				sIndex + (mapper.getAxis("vert") > 0.5 ? 1 : -1) > -1
			)
				sIndex += mapper.getAxis("vert") > 0.5 ? 1 : -1;
			menuButtons[sIndex].classList.add("selected");
			selected = menuButtons[sIndex];
		}
	} else if (currentScreen == tutorialElmt) {
		if (mapper.getBtn("B")) {
			document.querySelector(".back").click();
		}
	} else if (currentScreen == gameElmt) {
		if (grid === undefined || grid[2] === undefined) return;
		if (mapper.getBtnPress("A") && health <= 0)
			gameElmt.querySelector(".back").click();

		if (parseInt(storeElmt.style.opacity)) {
			if (mapper.getBtnPress("rightTrig") && currentScreen == gameElmt) {
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
			} else if (mapper.getBtnPress("leftTrig") && currentScreen == gameElmt) {
				storeCards[storeSIndex].classList.remove("selected");
				let start = storeSIndex;
				const change = () => {
					storeSIndex--;
					if (storeSIndex < 0) return false;
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
			} else if (mapper.getBtnPress("Y") && currentScreen == gameElmt) {
				scoreElmt.click();
				storeCards[storeSIndex ? storeSIndex : 0].classList.remove("selected");
			} else if (mapper.getBtn("A") && storeSIndex != -1) {
				storeCards[storeSIndex].click();
				storeSIndex = -1;
			} else if (mapper.getBtnPress("X")) {
				flushButton.click();
			}
			return;
		}

		if (health <= 0) return;
		if (mapper.getBtnPress("Y")) {
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
		} else if (mapper.getAxis("vert") > 0.5) {
			return;
		} else if (mapper.getAxis("horz") > 0.3) {
			heroCard.goto(grid[2][playerPos + 1]);
		} else if (mapper.getAxis("horz") < -0.3) {
			heroCard.goto(grid[2][playerPos - 1]);
		} else if (mapper.getAxis("vert") < -0.5) {
			heroCard.goto(grid[2][playerPos]);
		}
	}
};
