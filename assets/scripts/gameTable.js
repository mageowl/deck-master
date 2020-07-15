let gameTable = [
	{
		card: {
			type: "monster",
			value: [3, 4],
			ills: "monsters/wolf",
			name: "wolf"
		},
		weight: 10
	},
	{
		card: {
			type: "monster",
			value: [4, 6],
			ills: "monsters/willow_wisp",
			name: "willow wisp"
		},
		weight: 7
	},
	{
		card: {
			type: "monster",
			value: [1, 2],
			ills: "monsters/slave",
			name: "monster's slave"
		},
		weight: 8
	},
	{
		card: {
			type: "monster",
			value: [2, 5],
			ills: "monsters/flower",
			name: "venom flower"
		},
		weight: 8
	},
	{
		card: {
			type: "monster",
			value: [1, 2],
			ills: "monsters/horned-rabbit",
			name: "horbit"
		},
		weight: 11
	},
	{
		card: { type: "coin", value: [1, 3], ills: "coins/one", name: "coin(s)" },
		weight: 9
	},
	{
		card: { type: "coin", value: [4, 6], ills: "coins/two", name: "coins" },
		weight: 8
	},
	{
		card: { type: "coin", value: [7, 10], ills: "coins/many", name: "coins" },
		weight: 7
	},
	{
		card: {
			type: "coin",
			value: [10, 15],
			ills: "coins/sapphire",
			name: "sapphire"
		},
		weight: 1
	},
	{
		card: { type: "coin", value: [13, 18], ills: "coins/ruby", name: "ruby" },
		weight: 1
	},
	{
		card: {
			type: "coin",
			value: [25, 40],
			ills: "coins/diamond",
			name: "diamond"
		},
		weight: 1
	},
	{
		card: {
			type: "effect",
			value: [2, 4],
			ills: "items/healing_flask",
			onDrop: (value) => {
				addHealth(value);
				playSound("glug");
			},
			name: "healing flask"
		},
		weight: 6
	},
	{
		card: {
			type: "effect",
			value: [1, 2],
			ills: "items/random_effect",
			onDrop: (value, player, self) => {
				playSound("glug");
				let box_cards = generateCards(
					[
						{
							card: {
								type: "monster",
								value: [3, 4],
								ills: "monsters/wolf",
								name: "wolf"
							},
							weight: 3
						},
						{
							card: {
								type: "monster",
								value: [2, 5],
								ills: "monsters/flower",
								name: "venom flower"
							},
							weight: 2
						},
						{
							card: {
								type: "monster",
								value: [1, 2],
								ills: "monsters/horned-rabbit",
								name: "horbit"
							},
							weight: 4
						},
						{
							card: {
								type: "coin",
								value: [1, 3],
								ills: "coins/one",
								name: "coin(s)"
							},
							weight: 2
						},
						{
							card: {
								type: "coin",
								value: [4, 6],
								ills: "coins/two",
								name: "coins"
							},
							weight: 3
						},
						{
							card: {
								type: "coin",
								value: [7, 10],
								ills: "coins/many",
								name: "coins"
							},
							weight: 2
						},
						{
							card: {
								type: "effect",
								value: [2, 3],
								ills: "items/healing_flask",
								onDrop: (value) => {
									addHealth(value);
								},
								name: "healing flask"
							},
							weight: 3
						},
						{
							card: {
								type: "effect",
								value: [1, 3],
								ills: "items/monster_potion",
								onDrop: (value) => {
									playSound("glass_break");
									grid.forEach((row, i) => {
										if (i == 2) return;
										row.forEach((card) => {
											let cardType = Array.from(card.classList)
												.filter((value) => value != "card")[0]
												.slice(0, -5);

											if (
												cardType == "monster" &&
												!card
													.querySelector(".value")
													.innerText.includes("span class='icon-up'")
											) {
												card.querySelector(".value").innerHTML =
													parseInt(card.querySelector(".value").innerHTML) +
													value +
													"<span class='icon-up'></span";
											}
										});
									});
								},
								onNext: (value) => {
									grid.forEach((row, i) => {
										if (i != 0) return;
										row.forEach((card) => {
											let cardType = Array.from(card.classList)
												.filter((value) => value != "card")[0]
												.slice(0, -5);

											if (cardType == "monster") {
												card.querySelector(".value").innerHTML =
													parseInt(card.querySelector(".value").innerHTML) +
													value +
													"<span class='icon-up'></span";
											}
										});
									});
								},
								name: "monster potion"
							},
							weight: 3
						}
					],
					[-350, 202, 140, 0],
					value
				);
				box_cards.forEach((card) => {
					if (health == 0) return;
					let targetType = Array.from(card.classList).filter((value) => {
						return value != "card";
					})[0];
					targetType = targetType.substr(0, targetType.length - 5);
					let targetValue = parseInt(
						card.getElementsByClassName("value")[0].innerText
					);
					applyCard(card, targetType, targetValue, player, self, false);
					boardElmt.appendChild(card);
					card.style.opacity = 1;
					setTimeout(() => {
						if (health != 0) {
							card.style.opacity = 0;
							setTimeout(() => {
								card.remove();
							}, 500);
						}
					}, 1000);
				});
				if (health == 0) return true;
			},
			name: "random effect"
		},
		weight: 10
	},
	{
		card: {
			type: "effect",
			value: [1, 3],
			ills: "items/monster_potion",
			onDrop: (value) => {
				playSound("glass_break");
				grid.forEach((row, i) => {
					if (i == 2) return;
					row.forEach((card) => {
						let cardType = Array.from(card.classList)
							.filter((value) => value != "card")[0]
							.slice(0, -5);

						if (
							cardType == "monster" &&
							!card
								.querySelector(".value")
								.innerText.includes("span class='icon-up'")
						) {
							card.querySelector(".value").innerHTML =
								parseInt(card.querySelector(".value").innerHTML) +
								value +
								"<span class='icon-up'></span";
						}
					});
				});
			},
			onNext: (value) => {
				grid.forEach((row, i) => {
					if (i != 0) return;
					row.forEach((card) => {
						let cardType = Array.from(card.classList)
							.filter((value) => value != "card")[0]
							.slice(0, -5);

						if (cardType == "monster") {
							card.querySelector(".value").innerHTML =
								parseInt(card.querySelector(".value").innerHTML) +
								value +
								"<span class='icon-up'></span";
						}
					});
				});
			},
			name: "monster potion"
		},
		weight: 3
	}
];
