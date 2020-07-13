const playSound = (sound) => {
	let sfx = new Audio("assets/audio/" + sound + ".mp3");
	sfx.play();
};
