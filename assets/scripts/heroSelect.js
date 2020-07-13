if (localStorage.dm_heroesUnlocked == undefined)
	localStorage.dm_heroesUnlocked = "blue_knight";
let heroSelectCards = [];
let heroes = {
	blue_knight: "Default",
	life_mage: "Use a life staff to escape death",
	reaper: "Die 10 times in 10 min.",
	stone_talus: "Collect three different gems in one run."
};
Object.keys(heroes).forEach((hero, i) => {
	let card = document.createElement("div");
	card.classList.add("card", "hero-card", "hero-select");
	card.style.left = 12 + i * 135;
	card.onclick = () => {
		if (card.classList.contains("locked")) return;
		localStorage.dm_hero = hero;
		location.reload();
	};

	let img = document.createElement("img");
	img.classList.add("illustration");
	img.src = "assets/art/cards/heros/" + hero + ".png";
	card.id = hero;
	card.appendChild(img);

	let requirment = document.createElement("span");
	requirment.innerHTML = heroes[hero];
	requirment.classList.add("requirment");
	card.appendChild(requirment);

	heroSelectElmt.appendChild(card);
	heroSelectCards.push(card);
});

const unlockHero = (heroID) => {
	let unlocked = localStorage.dm_heroesUnlocked.split(",");
	localStorage.dm_heroesUnlocked = Array.from(
		new Set(unlocked.concat(heroID))
	).join();
};
