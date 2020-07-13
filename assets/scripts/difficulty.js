let currentBoss = 0;
let difficulty = 1;
const bossInterval = 75;
const bossHandler = () => {
	if (Math.floor(score / bossInterval) > currentBoss) {
		currentBoss++;
		difficulty += 0.2;
	}
};
