const storeElmt = document.getElementById("store");
let gameBackButton = document.querySelector("#game .back");

const addCardToStore = (card, i) => {
	storeElmt.appendChild(card);
	card.style.opacity = 1;
	card.classList.add("drop");

	// Cost
	var cost = document.createElement("span");
	cost.classList.add("cost");
	cost.innerHTML = card.data.cost + "<span class='icon-coin'></span>";
	card.appendChild(cost);

	// Posision
	card.data.pos = i;

	// OnClick
	setTimeout(() => {
		card.onclick = () => {
			if (card.data.cost > score) return;
			heroCard.dropHandler(heroCard, card);
		};
	}, 10);
};

let storeTable = [
	{
		card: {
			type: "item",
			ills: "items/hand_of_fire",
			name: "hand o` fire",
			data: {
				cost: 10,
				onNewCards: () => {
					let isRowMonsters = true;
					grid[2].forEach((card) => {
						let cardType = Array.from(card.classList).filter((value) => {
							return value != "card";
						})[0];
						cardType = cardType.substr(0, cardType.length - 5);

						if (!cardType.startsWith("monster")) isRowMonsters = false;
					});
					if (
						isRowMonsters &&
						grid[2][playerPos].querySelector(".value").innerText > 0
					) {
						grid[2][playerPos].querySelector(".value").innerHTML =
							"0<span class='icon-down'></span>";
						return true;
					}
					return false;
				},
				lore:
					"When facing a row of 3 monsters:<br>- Monster in front of you: value = 0<br>2 uses, stackable.",
				uses: 2,
				stack: true
			}
		},
		weight: 4
	},
	{
		card: {
			type: "item",
			ills: "items/life_staff",
			name: "life staff",
			data: {
				cost: 25,
				apply: (type, value, player) => {
					if (type == "monster" && value > 3) {
						console.log(health);
						if (health <= 0) unlockHero("life_mage");
						player.querySelector(".total").innerText =
							"/" +
							(parseInt(player.querySelector(".total").innerText.substr(1)) +
								1);
						addHealth(Math.floor(value / 2));
					}
				},
				lore:
					"When attacking monsters above 4:<br>- Damage halfed.<br>- +1 Max health.",
				stack: false
			}
		},
		weight: 3
	},
	{
		card: {
			type: "item",
			ills: "items/heart_stone",
			name: "heart stone",
			data: {
				cost: 75,
				lateApply: (type, value, player) => {
					if (health <= 0) {
						health = 0;
						addHealth(
							Math.ceil(
								parseInt(player.querySelector(".total").innerText.substr(1)) / 2
							)
						);
						return true;
					}
				},
				lore: "When you die:<br>- +50% Health <br>1 use only, no stack.",
				uses: 1,
				stack: false
			}
		},
		weight: 1
	},
	{
		card: {
			type: "item",
			ills: "items/wings",
			name: "wings",
			data: {
				cost: 15,
				onNewCards: (firstCall) => {
					let used = !(firstCall || hasWings);
					console.trace(used, firstCall);
					hasWings = true;
					grid[2].forEach((item) => {
						item.classList.add("drop");
					});
					if (used) return true;
				},
				onBreak: () => {
					hasWings = false;
				},
				lore:
					"When facing any row:<br>- All of bottom row can be moved to.<br>4 uses, no stack. (Hold SHIFT to use)",
				uses: 4,
				stack: false
			}
		},
		weight: 3
	},
	{
		card: {
			type: "item",
			ills: "items/soul_flare",
			name: "soul flare",
			data: {
				cost: 35,
				onNewCards: () => {
					let isRowMonsters = true;
					grid[2].forEach((card) => {
						let cardType = Array.from(card.classList).filter((value) => {
							return value != "card";
						})[0];
						cardType = cardType.substr(0, cardType.length - 5);

						if (!cardType.startsWith("monster")) isRowMonsters = false;
					});
					if (
						isRowMonsters &&
						grid[2][playerPos].querySelector(".value").innerText > 0
					) {
						grid[2].forEach((card) => {
							let value = card.querySelector(".value");
							value.innerHTML = "0<span class='icon-down'></span>";
						});
						return true;
					}
					return false;
				},
				lore:
					"When facing a row of 3 monsters:<br>- All monsters in the bottom row: value = 0<br>3 uses, stackable.",
				uses: 3,
				stack: true
			}
		},
		weight: 2
	}
];

scoreElmt.onclick = () => {
	document.documentElement.classList.toggle("store");
	if (storeSIndex + 1) {
		storeCards[storeSIndex].classList.remove("selected");
		storeSIndex = -1;
	}
	if (document.documentElement.classList.contains("store")) {
		storeElmt.style.opacity = 1;
		storeCards.forEach((card, i) => {
			if (card.data.cost > score) {
				card.style.opacity = 0.5;
			} else {
				card.style.opacity = 1;
			}
		});
	} else storeElmt.style.opacity = 0;
};
