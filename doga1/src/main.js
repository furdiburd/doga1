const nyilvTomb = [
  { noveny: "Növény1", fajta: "Valós",   ultDatum: "2026.09.11", egeszsegiAllapot: "Haldoklik",      egeszseges: true  },
  { noveny: "Növény2", fajta: "Valós",   ultDatum: "2025.10.30", egeszsegiAllapot: "Elvan",          egeszseges: false },
  { noveny: "Növény3", fajta: "Képzelt", ultDatum: "2066.06.20", egeszsegiAllapot: "Attól függ",     egeszseges: true  },
  { noveny: "Növény4", fajta: "Valós",   ultDatum: "2024.06.16", egeszsegiAllapot: "Minden rendben", egeszseges: true  },
  { noveny: "Növény5", fajta: "Égett",   ultDatum: "2020.02.22", egeszsegiAllapot: "Elégett",        egeszseges: false }
]

const oszlopok = [
  ["noveny",           "Növény"],
  ["fajta",            "Fajta"],
  ["ultDatum",         "Utolsó dátum"],
  ["egeszsegiAllapot", "Egészségi állapot"],
  ["egeszseges",       "Egészséges"]
]

const hely = document.getElementById("tablazat")
const tabla = document.createElement("table")
hely.append(tabla)

const elem = (tag, szoveg = "") => Object.assign(document.createElement(tag), { textContent: szoveg })

function render() {
  const thead = elem("tr")
  oszlopok.forEach(([, cim]) => thead.append(elem("th", cim)))
  thead.append(elem("th", "Műveletek"))

  const tbody = elem("tbody")
  nyilvTomb.forEach((noveny, i) => {
    const sor = elem("tr")
    sor.dataset.i = i

    oszlopok.forEach(([kulcs]) => {
      const ertek = noveny[kulcs]
      sor.append(elem("td", typeof ertek === "boolean" ? (ertek ? "Igen" : "Nem") : ertek))
    })

    const muvelet = elem("td")
    for (const [muveletNev, felirat] of [["torles", "Törlés"], ["valtas", "Egészséges váltása"]]) {
      const gomb = elem("button", felirat)
      gomb.dataset.m = muveletNev
      muvelet.append(gomb)
    }
    sor.append(muvelet)

    tbody.append(sor)
  })

  const fejlec = document.createElement("thead")
  fejlec.append(thead)
  tabla.replaceChildren(fejlec, tbody)
}

tabla.addEventListener("click", (e) => {
  const gomb = e.target.closest("button")
  if (!gomb) return

  const i = Number(gomb.closest("tr").dataset.i)
  if (gomb.dataset.m === "torles") nyilvTomb.splice(i, 1)
  else nyilvTomb[i].egeszseges = !nyilvTomb[i].egeszseges

  render()
})

const urlapMezok = [
  ["noveny",           "Új növény neve"],
  ["fajta",            "Új növény fajtája"],
  ["ultDatum",         "Új növény utolsó dátuma"],
  ["egeszsegiAllapot", "Új növény egészségi állapota"]
]

const urlap = document.createElement("form")
const mezok = {}

for (const [kulcs, felirat] of urlapMezok) {
  const cimke = elem("label", felirat)
  const bemenet = elem("input")
  bemenet.name = kulcs
  bemenet.id = kulcs
  bemenet.placeholder = felirat

  cimke.append(bemenet)
  urlap.append(cimke)

  mezok[kulcs] = bemenet
}


const egeszsegesCimke = elem("label", "Egészséges?")
const egeszsegesBemenet = elem("input")
egeszsegesBemenet.type = "checkbox"
egeszsegesBemenet.checked = true
egeszsegesCimke.append(egeszsegesBemenet)
urlap.append(egeszsegesCimke)

const kuldes = elem("button", "Új hozzáadása")
kuldes.type = "submit"
urlap.append(kuldes)

urlap.addEventListener("submit", (e) => {
  e.preventDefault()

  const nev = mezok.noveny.value.trim()
  if (!nev) return

  nyilvTomb.push({
    noveny:           nev,
    fajta:            mezok.fajta.value.trim()            || "Valós",
    ultDatum:         mezok.ultDatum.value.trim()         || new Date().toLocaleDateString("hu-HU"),
    egeszsegiAllapot: mezok.egeszsegiAllapot.value.trim() || "Új",
    egeszseges:       egeszsegesBemenet.checked
  })

  urlap.reset()
  egeszsegesBemenet.checked = true
  render()
})

hely.append(urlap)

render()
