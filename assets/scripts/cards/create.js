const createCard = (
	cardI = {
		type: "none",
		value: 0,
		ills: "card-type/name",
		pos: [0, 0],
		name: "card"
	}
) => {
	let card = {
		type: "none",
		value: 0,
		ills: "card-type/name",
		pos: [0, 0],
		...cardI
	};

	// Create element
	let cardElmt = document.createElement("div");

	// Add CSS
	cardElmt.classList.add("card");
	cardElmt.classList.add(card.type + "-card");
	if (card.type == "none") return cardElmt;

	// Frame
	let frame = document.createElement("span");
	frame.classList.add("frame");
	cardElmt.appendChild(frame);

	// Illustration
	let ills = document.createElement("img");
	ills.src = "assets/art/cards/" + card.ills + ".png";
	ills.classList.add("illustration");
	cardElmt.appendChild(ills);

	// Value
	if (card.value) {
		let val = document.createElement("span");
		val.innerHTML = card.value;
		val.classList.add("value");
		cardElmt.appendChild(val);
	}

	// Name
	let name = document.createElement("span");
	if (card.name.substr(card.name.length - 3, 3) == "(s)") {
		if (card.value == 1) {
			card.name = card.name.substr(0, card.name.length - 3);
		} else {
			card.name = card.name.substr(0, card.name.length - 3) + "s";
		}
	}
	name.innerHTML = card.name;
	name.classList.add("name");
	cardElmt.appendChild(name);

	// Position
	cardElmt.style.left = card.pos[0];
	cardElmt.style.top = card.pos[1];

	// OnDrop
	if ((card.type == "effect" || card.type == "monster-effect") && card.onDrop) {
		cardElmt.drop = card.onDrop;
	}

	// OnNext
	if (card.type == "effect" && card.onNext) {
		cardElmt.next = card.onNext;
	}

	// Extra stuff
	cardElmt.data = card.data;

	// Append and return
	document.body.appendChild(cardElmt);
	return cardElmt;
};
