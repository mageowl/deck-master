const isDebug = true

let heroCard = document.querySelector(".hero-card:not(.hero-select)")

// SET HERO
let cstmHeroId = localStorage.dm_cstmHero
heroCard.getElementsByClassName("illustration")[0].src = "assets/art/cards/heros/" + cstmHeroId + ".png"

let deathCount = 0
let timerStarted = false
let timerEnded = false

let hasWings = false

let playerPos = 1
let cards = Array.from(document.querySelectorAll(".card:not(.item-card)"))
let score = 0
let scoreElmt = document.getElementById("score-count")
let monsterPoints = 0
let menuElmt = document.getElementById("main-menu")
let playButton = document.getElementById("play-button")
let gameElmt = document.getElementById("game")
let boardElmt = document.getElementById("board")
let tutorialButton = document.getElementById("tutorial-button")
let tutorialElmt = document.getElementById("tutorial")
let heroSelectElmt = document.getElementById("hero-select")
let heroButton = document.getElementById("hero-button")
let leagueButton = document.getElementById("league-button")
let leagueElmt = document.getElementById("league")

let inventory = []
let invElemt = document.getElementById("inv")
let deathText = document.getElementById("death")
let storeCards
let grid

let level = [
	{ card: { type: "monster", value: [3, 4], ills: "monsters/wolf", name: "wolf" }, weight: 5 },
	{ card: { type: "monster", value: [4, 6], ills: "monsters/willow_wisp", name: "willow wisp" }, weight: 2 },
	{ card: { type: "monster", value: [1, 2], ills: "monsters/slave", name: "monster's slave" }, weight: 3 },
	{ card: { type: "monster", value: [2, 5], ills: "monsters/flower", name: "venom flower" }, weight: 3 },
	{ card: { type: "monster", value: [1, 2], ills: "monsters/horned-rabbit", name: "horbit" }, weight: 6 },
	{ card: { type: "coin", value: [1, 3], ills: "coins/one", name: "coin(s)" }, weight: 3 },
	{ card: { type: "coin", value: [4, 6], ills: "coins/two", name: "coins" }, weight: 2 },
	{ card: { type: "coin", value: [7, 10], ills: "coins/many", name: "coins" }, weight: 1 },
	{ card: { type: "effect", value: [2, 3], ills: "items/healing_flask", onDrop: (value) => {
		addHealth(value)
		playSound("glug")
	}, name: "healing flask" }, weight: 1 },
	{ card: { type: "effect", value: [1, 2], ills: "items/random_effect", onDrop: (value, player, self) => { 
		playSound("glug")
		let box_cards = generateCards([{ card: { type: "monster", value: [3, 4], ills: "monsters/wolf", name: "wolf" }, weight: 3 },
			{ card: { type: "monster", value: [2, 5], ills: "monsters/flower", name: "venom flower" }, weight: 2 },
			{ card: { type: "monster", value: [1, 2], ills: "monsters/horned-rabbit", name: "horbit" }, weight: 4 },
			{ card: { type: "coin", value: [1, 3], ills: "coins/one", name: "coin(s)" }, weight: 2 },
			{ card: { type: "coin", value: [4, 6], ills: "coins/two", name: "coins" }, weight: 3 },
			{ card: { type: "coin", value: [7, 10], ills: "coins/many", name: "coins" }, weight: 2 },
			{ card: { type: "effect", value: [2, 3], ills: "items/healing_flask", onDrop: (value) => { addHealth(value) }, name: "healing flask" }, weight: 3 }
		], [-350, 202, 140, 0], value)
		box_cards.forEach(card => {
			if (health == 0) return	
			let targetType = Array.from(card.classList).filter((value) => {return value != "card"})[0]
			targetType = targetType.substr(0, targetType.length - 5)
			let targetValue = parseInt(card.getElementsByClassName("value")[0].innerText)
			applyCard(card, targetType, targetValue, player, self, false)
			boardElmt.appendChild(card)
			card.style.opacity = 1
			setTimeout(() => {
				if (health != 0) {
					card.style.opacity = 0
					setTimeout(() => {
						card.remove()
					}, 500)
				}
			}, 1000)
		})
		if (health == 0) return true
	}, name: "random effect" }, weight: 1 },
]

const addHealth = (x) => {
	health += x
	if (health <= 0) {
		if (anims.animActive) health = 0
		return true
	}
	let total = parseInt(heroCard.getElementsByClassName("total")[0].innerText.substr(1))
	if (health >= total) {
		health = total
	}

	heroCard.getElementsByClassName("current")[0].innerText = health
}

const applyCard = (card, type, value, player, deathCard = null, sound = true) => {
	switch (type) {
		case "monster":
			if (sound) playSound("slash")
			if (addHealth(-value)) {
				if (deathCard) {
					anims.death(deathCard, player, card)
				} else {
					anims.death(card, player)
				}
				return true
			}
			monsterPoints += value
			break
		case "coin":
			score += value
			scoreElmt.innerHTML = score + "<span class='icon-coin'>"
			if (sound) playSound("ching")
			break
		case "effect":
			if (card.drop(value, player, card)) {
				return true
			}
			break
		case "item":
			let duplicate = false
			inventory.forEach((iCard) => {
				if (!iCard.stack && iCard.element.querySelector(".name").innerText == card.querySelector(".name").innerText) duplicate = true
			})
			scoreElmt.click()
			if (duplicate) return
		
			card.remove()

			let pos = storeCards.indexOf(card)
			let x = parseInt(card.style.left)
			let y = 10
			let newCard = generateCards(storeTable, [x, y, 0, 0], 1)[0]
			storeCards[pos] = newCard
			addCardToStore(newCard, pos)

			score -= card.data.cost
			scoreElmt.innerHTML = score + "<span class='icon-coin'>"

			// Add item you bought to inventory
			let inventoryItem = document.createElement("div")
			inventoryItem.classList.add("inv-item")

			let image = document.createElement("img")
			image.src = card.querySelector(".illustration").src
			image.classList.add("inv-image")
			inventoryItem.appendChild(image)

			let name = document.createElement("span")
			name.innerText = card.querySelector(".name").innerText
			name.classList.add("name")
			inventoryItem.appendChild(name)

			let lore = document.createElement("span")
			lore.innerHTML = card.data.lore
			inventoryItem.appendChild(lore)

			invElemt.appendChild(inventoryItem)
			let item = { ...card.data, element: inventoryItem }
			if (item.onNewCards) {
				if (item.onNewCards() && item.uses != undefined) {
					removeItemDurability(item, inventory.length)
				}
			}
			inventory.push(item)
			break
		default:
			break
	}
}

const removeItemDurability = (item, i) => {
	item.uses--
	if (item.uses <= 0) {
		console.log(item.onBreak, Boolean(item.onBreak))
		if (item.onBreak) item.onBreak()
		item.element.remove()
		inventory.splice(i, 1)
	}
}

let health
const main = () => {
	boardElmt.style.pointerEvents = "all"
	score = 0
	playerPos = 1
	scoreElmt.innerHTML = "0<span class='icon-coin'>"
	storeCards = generateCards(storeTable, [100, 10, 140, 0], 6)
	storeCards.forEach((card, i) => {
		addCardToStore(card, i)
	})

	health = parseInt(heroCard.getElementsByClassName("current")[0].innerText)
	heroCard.querySelector(".total").innerText = "/15"
	addHealth(parseInt(heroCard.getElementsByClassName("total")[0].innerText.substr(1)))
	heroCard.style.opacity = 1
	heroCard.style.top = "calc(100% - 186px)"
	heroCard.style.left = "calc(50% - 64px)"

	grid = [generateCards(level, [0, 0, 0, 0], 3), generateCards(level, [0, 0, 0, 0], 3), generateCards(level, [0, 0, 0, 0], 3)]
	grid.forEach((row, y) => {
		row.forEach((card, x) => {
			card.style.left = "calc(50% + " + (((x-1) * 137) - 64) + "px)"
			card.style.top = 5 + [0, 60, 268][y]
			card.style.opacity = 1
			boardElmt.appendChild(card)
		})
	})
	cards = Array.from(document.querySelectorAll(".card:not(.item-card)"))

	grid[2].forEach(card => {
		card.classList.add("drop")
	})

	timerStarted = true
	setTimeout(() => {
		timerEnded = true
	}, 600000)

	draggable(heroCard, (player, target) => {

		// Get target type
		let targetType = Array.from(target.classList).filter((value) => {return value != "card"})[0]
		targetType = targetType.substr(0, targetType.length - 5)

		// Get target value
		let targetValue = target.getElementsByClassName("value")[0] ? parseInt(target.getElementsByClassName("value")[0].innerText) : 0
		
		// Apply card
		anims.animActive = false
		applyCard(target, targetType, targetValue, player)
		inventory.forEach((item, i) => {
			if (item.apply) {
				if (item.apply(targetType, targetValue, player, target) && item.uses != undefined) {
					removeItemDurability(item, i)
				}
			}
		})
		inventory.forEach((item, i) => {
			if (item.lateApply) {
				if (item.lateApply(targetType, targetValue, player, target) && item.uses != undefined) {
					removeItemDurability(item, i)
				}
			}
		})
		anims.animActive = true
		if (health <= 0) {
			health = 0
			anims.death(target, player)
			return
		}
		
		if (grid[2].indexOf(target) == playerPos + 2 || grid[2].indexOf(target) == playerPos - 2) hasWings = false

		// Move cards
		if (targetType != "item") {
			if (storeElmt.style.opacity == 1) scoreElmt.click()
			playerPos = grid[2].indexOf(target)
			grid[2].forEach(card => {
				if (card != target) card.style.opacity = 0
			})
			delete grid[2][grid[2].indexOf(target)]
			setTimeout(() => {
				target.remove()
				grid[2].forEach(card => {
					card.remove()
				})
				grid.pop()
				cards = Array.from(document.querySelectorAll(".card:not(.item-card)"))
				grid.forEach((row, y) => {
					row.forEach((card) => {
						card.style.top = 5 + [0, 60, 268][y + 1]
						card.style.zIndex = (parseInt(card.style.zIndex) || 0) + 1
					})
				})
				heroCard.style.top = parseInt(heroCard.style.top) + 198
				setTimeout(() => {
					target.remove()
					let newCards = generateCards(level, [0, 10, 0, 0], 3)
					newCards.forEach((card) => {
						card.style = "top: 10px; left: calc(100% - 138px);"
					})
					grid.unshift(newCards)
					cards.push(...newCards)
					grid[2].forEach((card, i) => {
						card.style.zIndex = 0
						if (Math.abs(playerPos - i) == 2) return
						card.classList.add("drop")
					})
					inventory.forEach((item, i) => {
						if (item.onNewCards) {
							if (item.onNewCards() && item.uses != undefined) {
								removeItemDurability(item, i)
							}
						}
						if (item.element.querySelector(".name").innerHTML == "wings") hasWings = true
					})
					setTimeout(() => {
						newCards.forEach((card, i) => {
							card.style = "top: calc((100vh / 2 - 658px / 2) + 5px); left: calc(50% + " + (((i - 1) * 137) - 64) + "px)"
							card.style.opacity = 1
						})
						setTimeout(() => {
							newCards.forEach((card, i) => {
								boardElmt.appendChild(card)
								card.style.top = 5
							})
						}, 500)
					}, 10)
				}, 250)
			}, 501)
		}
	})
}

const clear = () => {
	deathText.style.opacity = 0
	cards.forEach(card => {
		if (!card.classList.contains("hero-card") && !card.classList.contains("card-back")) card.remove()
	})
	cards = Array.from(document.querySelectorAll(".card:not(.item-card)"))
	inventory.forEach(item => {
		item.element.remove()
	})
	inventory = []
	undraggable(heroCard)
}

// Menu Buttons
let currentScreen = null

playButton.onclick = () => {
	menuElmt.style.opacity = 0
	gameElmt.style.display = "block"
	currentScreen = gameElmt
	setTimeout(() => {
		menuElmt.style.display = "none"
		gameElmt.style.opacity = 1
		main()
	}, 1000)
}

tutorialButton.onclick = () => {
	menuElmt.style.opacity = 0
	tutorialElmt.style.display = "block"
	currentScreen = tutorialElmt
	setTimeout(() => {
		menuElmt.style.display = "none"
		tutorialElmt.style.opacity = 1
	}, 1000)
}

leagueButton.onclick = () => {
	menuElmt.style.opacity = 0
	leagueElmt.style.display = "block"
	currentScreen = leagueElmt
	setTimeout(() => {
		menuElmt.style.display = "none"
		leagueElmt.style.opacity = 1
	}, 1000)
}

heroButton.onclick = () => {
	menuElmt.style.marginTop = -300
	menuElmt.style.opacity = 0.5
	menuElmt.style.pointerEvents = "none"
	heroSelectElmt.style.pointerEvents = "all"
	currentScreen = heroSelectElmt
	heroSelectElmt.style.opacity = 1
	let unlockedHeroes = localStorage.dm_heroesUnlocked.split(",")
	heroSelectCards.forEach((card) => {
		if (unlockedHeroes.indexOf(card.id) == -1) card.classList.add("locked")
		else card.classList.remove("locked")
	})
}

let backButtons = Array.from(document.querySelectorAll("button.back"))
backButtons.forEach(b => {
	b.onclick = () => {
		currentScreen.style.opacity = 0
		menuElmt.style.display = "block"
		heroCard.removeAttribute("style")
		heroCard.style.opacity = 0
		setTimeout(() => {
			currentScreen.style.display = "none"
			menuElmt.style.pointerEvents = "all"
			menuElmt.style.opacity = 1
			currentScreen = null
			clear()
		}, 1000)
	}
})

let flushButton = document.querySelector("#flush-store")
flushButton.onclick = () => {
	if (score < 10) return

	score -= 10
	scoreElmt.innerHTML = score + "<span class='icon-coin'>"

	storeCards.forEach(card => {
		card.remove()
	})
	storeCards = generateCards(storeTable, [100, 10, 140, 0], 6)
	storeCards.forEach((card, i) => {
		addCardToStore(card, i)
	})

	scoreElmt.click()
}