const storeElmt = document.getElementById("store")
let gameBackButton = document.querySelector("#game .back")

const addCardToStore = (card, i) => {
	storeElmt.appendChild(card)
	card.style.opacity = 1
	card.classList.add("drop")

	// Cost
	var cost = document.createElement("span")
	cost.classList.add("cost")
	cost.innerHTML = card.data.cost + "<span class='icon-coin'></span>"
	card.appendChild(cost)

	// Posision
	card.data.pos = i

	// OnClick
	setTimeout(() => {
		card.onclick = () => {
			if (card.data.cost > score) return
			card.remove()
			heroCard.dropHandler(heroCard, card)
		}
	}, 10);
}

let storeTable = [
	{ card: {
		type: "item", ills: "items/hand_of_fire", name: "hand o` fire", data: {
			cost: 10, onNewCards: () => {
				let isRowMonsters = true
				grid[2].forEach(card => {
					let cardType = Array.from(card.classList).filter((value) => { return value != "card" })[0]
					cardType = cardType.substr(0, cardType.length - 5)

					if (cardType != "monster") isRowMonsters = false
				})
				if (isRowMonsters && grid[2][playerPos].querySelector(".value").innerText > 0) {
					grid[2][playerPos].querySelector(".value").innerText = 0
					return true
				}
				return false
			}, lore: "When facing a row of 3 monsters:<br>- Monster in front of you: value = 0<br>2 uses", uses: 2 
		}
		}, weight: 3
	},
	{
		card: {
			type: "item", ills: "items/life_staff", name: "life staff", data: {
				cost: 25, afterApply: (type, value, player) => {
					if (type == "monster" && value > 3) {
						player.querySelector(".total").innerText = "/" + (parseInt(player.querySelector(".total").innerText.substr(1)) + 1)
						addHealth(Math.floor(value / 2))
					}
				}, lore: "When attacking monsters above 4:<br>- Damage halfed<br>- +1 Max health"
			}
		}, weight: 1
	},
	{
		card: {
			type: "item", ills: "items/heart_stone", name: "heart stone", data: {
				cost: 25, afterApply: (type, value, player) => {
					if (health <= 0) {
						health = 0
						addHealth(Math.ceil(parseInt(player.querySelector(".total").innerText.substr(1)) / 2))
					}
				}, lore: "When you die:<br>- You don't die (Half of your health is back)<br>1 use only", uses: 1
			}
		}, weight: 1
	}

]

scoreElmt.onclick = () => {
	document.documentElement.classList.toggle("store")
	if (document.documentElement.classList.contains("store")) {
		storeElmt.style.opacity = 1
		storeCards.forEach((card, i) => {
			if (card.data.cost > score) {
				card.style.opacity = 0.5
			} else {
				card.style.opacity = 1
			}
		})
	}
	else storeElmt.style.opacity = 0
}