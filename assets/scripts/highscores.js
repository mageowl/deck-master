const sortScores = () => {
	let table = document.querySelector("#league table"),
		rows,
		switching = true,
		i,
		x,
		y,
		shouldSwitch;
	/* Make a loop that will continue until
    no switching has been done: */
	while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		rows = table.rows;
		/* Loop through all table rows (except the
        first, which contains table headers): */
		for (i = 1; i < rows.length - 1; i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
            one from current row and one from the next: */
			x = rows[i].getElementsByTagName("TD")[1];
			y = rows[i + 1].getElementsByTagName("TD")[1];

			// Check if the two rows should switch place:
			if (
				parseInt(x.innerHTML.toLowerCase()) <
				parseInt(y.innerHTML.toLowerCase())
			) {
				// If so, mark as a switch and break the loop:
				shouldSwitch = true;
				break;
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
            and mark that a switch has been done: */
			rows[i].parentNode.parentNode.insertBefore(
				rows[i + 1].parentNode,
				rows[i].parentNode
			);
			switching = true;
		}
	}
};

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCqNpC2tUvInPpCyAcEVEmGhLIiYMe7eRA",
	authDomain: "deck-master.firebaseapp.com",
	databaseURL: "https://deck-master.firebaseio.com",
	projectId: "deck-master",
	storageBucket: "deck-master.appspot.com",
	messagingSenderId: "591987670771",
	appId: "1:591987670771:web:5427e37ce2edd63e14c186",
	measurementId: "G-YSQN18SV3K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
let highscores = database.ref("scores");

const uploadScore = (score, name = localStorage.dm_name) => {
	let today = new Date();
	let todayString =
		today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();
	let scoreData = {
		name,
		score,
		date: todayString
	};

	let newKey = highscores.push().key;

	let updates = {};
	updates[newKey] = scoreData;

	return highscores.update(updates);
};

let displayedScores = [];

highscores.on("value", (snapshot) => {
	let vRaw = snapshot.val();
	let values = Object.values(vRaw);
	let table = leagueElmt.querySelector("table");
	values.forEach((val, i) => {
		let sid = Object.keys(vRaw)[i];
		if (displayedScores.indexOf(sid) != -1) return;
		displayedScores.push(sid);
		table.innerHTML += `<tr><td>${val.name}</td><td>${val.score}</td><td>${val.date}</td></tr>`;
	});
	sortScores();
});
