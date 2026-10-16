import "bootstrap/dist/css/bootstrap.min.css"
import _ from "lodash"
import dayjs from "dayjs"

let nyilvTomb = [
  { id: 1, noveny: "Növény1", fajta: "Valós",   ultetesDatum: "2026-09-11", egeszsegiAllapot: "Haldoklik",      egeszseges: true  },
  { id: 2, noveny: "Növény2", fajta: "Valós",   ultetesDatum: "2025-10-30", egeszsegiAllapot: "Elvan",          egeszseges: false },
  { id: 3, noveny: "Növény3", fajta: "Képzelt", ultetesDatum: "2066-06-20", egeszsegiAllapot: "Attól függ",     egeszseges: true  },
  { id: 4, noveny: "Növény4", fajta: "Valós",   ultetesDatum: "2024-06-16", egeszsegiAllapot: "Minden rendben", egeszseges: true  },
  { id: 5, noveny: "Növény5", fajta: "Égett",   ultetesDatum: "2020-02-22", egeszsegiAllapot: "Elégett",        egeszseges: false }
]

const oszlopok = [
  ["noveny",           "Növény"],
  ["fajta",            "Fajta"],
  ["ultetesDatum",     "Ültetési dátum"],
  ["egeszsegiAllapot", "Egészségi állapot"],
  ["egeszseges",       "Egészséges"]
]

let rendezes = "noveny-asc"

document.addEventListener("DOMContentLoaded", () => {
  const hely = document.getElementById("tablazat")

  const tabla = document.createElement("table")
  tabla.className = "table table-striped table-bordered align-middle"
  hely.appendChild(tabla)

  const elem = (tag, szoveg = "") => Object.assign(document.createElement(tag), { textContent: szoveg })

  const rendezettLista = () => {
    const [mezo, irany] = rendezes.split("-")
    return _.orderBy(nyilvTomb, [mezo], [irany])
  }

  function render() {
    const thead = document.createElement("thead")
    const fejSor = document.createElement("tr")
    oszlopok.forEach(([, cimke]) => fejSor.appendChild(elem("th", cimke)))
    fejSor.appendChild(elem("th", "Eltelt idő"))
    fejSor.appendChild(elem("th", "Műveletek"))
    thead.appendChild(fejSor)

    const tbody = document.createElement("tbody")
    rendezettLista().forEach((noveny) => {
      const i = nyilvTomb.indexOf(noveny)
      const sor = document.createElement("tr")
      sor.dataset.i = i

      oszlopok.forEach(([kulcs]) => {
        const td = document.createElement("td")
        const ertek = noveny[kulcs]

        if (typeof ertek === "boolean") {
          const doboz = document.createElement("div")
          doboz.className = "form-check form-switch"
          const kapcsolo = document.createElement("input")
          kapcsolo.className = "form-check-input"
          kapcsolo.type = "checkbox"
          kapcsolo.checked = ertek
          kapcsolo.dataset.m = "valtas"
          doboz.appendChild(kapcsolo)
          td.appendChild(doboz)
        } else if (kulcs === "ultetesDatum") {
          td.textContent = dayjs(ertek).format("YYYY. MM. DD.")
        } else {
          td.textContent = ertek
        }

        sor.appendChild(td)
      })

      sor.appendChild(elem("td", dayjs().diff(dayjs(noveny.ultetesDatum), "day") + " nap"))

      const muvelet = document.createElement("td")
      const gomb = elem("button", "Törlés")
      gomb.className = "btn btn-danger btn-sm"
      gomb.dataset.m = "torles"
      muvelet.appendChild(gomb)
      sor.appendChild(muvelet)

      tbody.appendChild(sor)
    })

    tabla.replaceChildren(thead, tbody)
  }

  tabla.addEventListener("click", (e) => {
    const gomb = e.target.closest('button[data-m="torles"]')
    if (!gomb) return

    nyilvTomb.splice(Number(gomb.closest("tr").dataset.i), 1)
    render()
  })

  tabla.addEventListener("change", (e) => {
    const kapcsolo = e.target.closest('input[data-m="valtas"]')
    if (!kapcsolo) return

    nyilvTomb[Number(kapcsolo.closest("tr").dataset.i)].egeszseges = kapcsolo.checked
    render()
  })

  const rendezesValaszto = document.createElement("select")
  rendezesValaszto.className = "form-select mb-3"

  for (const [ertek, felirat] of [
    ["noveny-asc",        "Növény szerint növekvő"],
    ["noveny-desc",       "Növény szerint csökkenő"],
    ["ultetesDatum-asc",  "Dátum szerint növekvő"],
    ["ultetesDatum-desc", "Dátum szerint csökkenő"]
  ]) {
    const opcio = elem("option", felirat)
    opcio.value = ertek
    rendezesValaszto.appendChild(opcio)
  }

  rendezesValaszto.addEventListener("change", () => {
    rendezes = rendezesValaszto.value
    render()
  })

  hely.appendChild(rendezesValaszto)

  const urlapMezok = [
    ["noveny",           "Új növény neve"],
    ["fajta",            "Új növény fajtája"],
    ["ultetesDatum",     "Ültetés dátuma (ÉÉÉÉ-HH-NN)"],
    ["egeszsegiAllapot", "Új növény egészségi állapota"]
  ]

  const urlap = document.createElement("form")
  const mezok = {}

  for (const [kulcs, felirat] of urlapMezok) {
    const cimke = elem("label", felirat)
    cimke.className = "form-label"
    cimke.htmlFor = kulcs

    const bemenet = elem("input")
    bemenet.className = "form-control"
    bemenet.name = kulcs
    bemenet.id = kulcs
    bemenet.placeholder = felirat

    const csoport = document.createElement("div")
    csoport.className = "mb-3"
    csoport.appendChild(cimke)
    csoport.appendChild(bemenet)
    urlap.appendChild(csoport)

    mezok[kulcs] = bemenet
  }

  const egeszsegesCimke = elem("label", "Egészséges?")
  egeszsegesCimke.className = "form-check-label"

  const egeszsegesBemenet = document.createElement("input")
  egeszsegesBemenet.className = "form-check-input"
  egeszsegesBemenet.type = "checkbox"
  egeszsegesBemenet.checked = true

  const egeszsegesDoboz = document.createElement("div")
  egeszsegesDoboz.className = "form-check form-switch mb-3"
  egeszsegesDoboz.appendChild(egeszsegesBemenet)
  egeszsegesDoboz.appendChild(egeszsegesCimke)
  urlap.appendChild(egeszsegesDoboz)

  const kuldes = elem("button", "Felvétel")
  kuldes.className = "btn btn-primary"
  kuldes.type = "submit"
  urlap.appendChild(kuldes)

  urlap.addEventListener("submit", (e) => {
    e.preventDefault()

    const nev = mezok.noveny.value.trim()
    if (!nev) return

    nyilvTomb.push({
      id:               Math.max(0, ...nyilvTomb.map((n) => n.id)) + 1,
      noveny:           nev,
      fajta:            mezok.fajta.value.trim()            || "Valós",
      ultetesDatum:     mezok.ultetesDatum.value.trim()     || dayjs().format("YYYY-MM-DD"),
      egeszsegiAllapot: mezok.egeszsegiAllapot.value.trim() || "Új",
      egeszseges:       egeszsegesBemenet.checked
    })

    nyilvTomb = _.uniqBy(nyilvTomb, "id")

    urlap.reset()
    egeszsegesBemenet.checked = true
    render()
  })

  hely.appendChild(urlap)

  const datum = elem("p", "Aktuális dátum: " + dayjs().format("YYYY. MM. DD."))
  datum.className = "text-muted"
  hely.appendChild(datum)

  render()
})
