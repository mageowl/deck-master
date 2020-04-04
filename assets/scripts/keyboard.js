heroCard.goto = (targetCard) => {
	if (targetCard == undefined || !heroCard.droppable) return false

	// Change the CSS so the card can transition
	heroCard.style.transition = "top 500ms, left 500ms, transform 400ms"
	heroCard.droppable = false
	heroCard.style.zIndex = 1

	// Set the left and top properties
	setTimeout(() => { 
		heroCard.style.left = targetCard.style.left
		heroCard.style.top = targetCard.style.top
	}, 10)

	// Wait for transition to end
	setTimeout(() => { 
		// Go back and do all the turn stuff
		heroCard.dropHandler(heroCard, targetCard)
	}, 510)

	setTimeout(() => { 
		heroCard.style.transition = "transform 400ms"
		heroCard.droppable = true
	}, 1510)
}

let selected = null
let sIndex = -1
let menuButtons = Array.from(document.querySelectorAll(".menu-button"))
window.onkeydown = (e) => {
	if (health <= 0) return
	// Start the game if you press Enter on the menu screen
	if (currentScreen == null) {
		if (e.key == "Enter" && selected != null) {
			selected.click()
			selected.classList.remove("selected")
			selected = null
			sIndex = -1
		}
		else if (e.key == "ArrowDown" || e.key == "ArrowUp") {
			let set = false
			if (sIndex == -1) {
				sIndex = 0
				set = true
			}
			menuButtons[sIndex].classList.remove("selected")
			if (!set && 
				sIndex + (e.key == "ArrowDown" ? 1 : -1) < menuButtons.length && 
				sIndex + (e.key == "ArrowDown" ? 1 : -1) > -1)
				sIndex += e.key == "ArrowDown" ? 1 : -1
			menuButtons[sIndex].classList.add("selected")
			selected = menuButtons[sIndex]
		}
	}
	
	else if (currentScreen == gameElmt) {
		if (grid[2] === undefined) return
		if (e.key == "ArrowRight" && currentScreen == gameElmt) {
			heroCard.goto(grid[2][playerPos + 1])
		} else if (e.key == "ArrowLeft" && currentScreen == gameElmt) {
			heroCard.goto(grid[2][playerPos - 1])
		} else if (e.key == "ArrowUp" && currentScreen == gameElmt) {
			heroCard.goto(grid[2][playerPos])
		} else if (e.key == "Shift" && currentScreen == gameElmt) {
			scoreElmt.click()
		}
	}
}

menuButtons.forEach(button => {
	button.onmouseenter = () => {
		if (!menuButtons[sIndex]) return
		menuButtons[sIndex].classList.remove("selected")
		selected = null
		sIndex = -1
	}
})