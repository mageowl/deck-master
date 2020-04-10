if (localStorage.heroesUnlocked == undefined) localStorage.heroesUnlocked = "blue_knight"
let heroSelectCards = []
let heroes = ["blue_knight", "life_mage", "reaper"]
heroes.forEach((hero, i) => {
    let card = document.createElement("div")
    card.classList.add("card", "hero-card", "hero-select")
    card.style.left = 12 + i * 135
    card.onclick = () => {
        if (card.classList.contains("locked")) return
        localStorage.dm_cstmHero = heroes[i]
        location.reload()
    }

    let img = document.createElement("img")
    img.classList.add("illustration")
    img.src = "assets/art/cards/heros/" + hero + ".png"
    card.id = hero
    card.appendChild(img)

    heroSelectElmt.appendChild(card)
    heroSelectCards.push(card)
})


const unlockHero = (heroID) => {
    let unlocked = localStorage.heroesUnlocked.split(",")
    localStorage.heroesUnlocked = Array.from(new Set(unlocked.concat(heroID))).join()
}