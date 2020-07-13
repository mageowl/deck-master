const generateCards = (
	possiblities = [
		{ card: { type: "none", value: 0, ills: "card-type/name" }, weight: 1 }
	],
	pos = [0, 0, 0, 0],
	rolls = 1
) => {
	let weightedPossiblities = [];
	possiblities.forEach((p) => {
		for (let i = 0; i < p.weight; i++) {
			weightedPossiblities.push(p.card);
		}
	});

	let cards = [];
	let xCalc = String(pos[0]).substr(0, 4) == "calc";
	let yCalc = String(pos[1]).substr(0, 4) == "calc";
	for (let i = 0; i < rolls; i++) {
		let card =
			weightedPossiblities[
				Math.floor(Math.random() * weightedPossiblities.length)
			];

		let calcpos = [
			pos[0] + (xCalc ? " + " : 0) + pos[2] * i + (xCalc ? "px)" : 0),
			pos[1] + (yCalc ? " + " : 0) + pos[3] * i + (yCalc ? "px)" : 0)
		];
		let val = card.value
			? Math.floor(Math.random() * (card.value[1] - card.value[0] + 1)) +
			  card.value[0]
			: "";
		cards.push(createCard({ ...card, pos: calcpos, value: val }));
	}

	return cards;
};
