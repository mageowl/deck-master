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
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

let database = firebase.database()
let highscores = database.ref("scores")

const uploadScore = (score, name = localStorage.dm_name) => {
    let today = new Date()
    let todayString = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear()
    let scoreData = {
        name,
        score,
        date: todayString
    }

    let newKey = highscores.push().key

    let updates = {}
    updates[newKey] = scoreData

    return highscores.update(updates)
}

highscores.on("value", (snapshot) => {
    let value = Object.values(snapshot.val())
    value.forEach(val => {
        let table = leagueElmt.querySelector("table")
        table.innerHTML += `<tr><td>${val.name}</td><td>${val.score}</td><td>${val.date}</td></tr>`
    })
})