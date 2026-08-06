import createCard from "./pokeCard.js";
import { markPokemonSeen, savePokemon } from "./save.js";

const input = document.querySelector("form");
const btn = document.querySelector("#saveBtn");
const mainPokemon = document.querySelector("#main-pokemon");
const main = document.querySelector("#main");
const url = "https://pokeapi.co/api/v2/pokemon";
const urlFlavor = "https://pokeapi.co/api/v2/pokemon-species/";

//pokeObject
const pokeObject = {
  id: "???",
  pokeName: "???",
  pokeType: "???",
  pokeImg: "???",
  pokeStats: {
    HP: "???",
    Attack: "???",
    Defense: "???",
    Speed: "???",
  },
  cry: "",
  flavorText: "???",
  pokeNote: "Write a personal Note ✏️",
};

// btn logic
// Anzeige von Pokemon und blinkender Button mit Delay bis Anzeige
function anzeigeUndTimeout() {
  btn.disabled = true;
  btn.classList.add(
    "bg-red-400",
    "transition-all",
    "duration-700",
    "shadow-lg",
    "shadow-red-300",
    "animate-pulse",
  );
  btn.classList.remove("bg-white");
  setTimeout(() => {
    btn.classList.remove(
      "bg-red-400",
      "animate-pulse",
      "shadow-lg",
      "shadow-red-300",
    );
    btn.classList.add("bg-white");
    btn.disabled = false;
    createCard(pokeObject);
    const pokeCry = new Audio(pokeObject.cry);
    pokeCry.play();
    btn.classList.add("bg-white");
    btn.disabled = false;
    input.reset();
  }, 2000);
}

input
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const pokeName = formData.get("q")?.toLocaleLowerCase();
    mainPokemon.textContent = "";
    deleteCard();

    // 1/2 Fetch - alles außer Flavor Text
    fetch(`${url}/${pokeName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${pokeName} wasn't found`);
        return res.json();
      })
      .then((data) => {
        
        if (data.id > 151) throw new Error(`${pokeName} not found. Pls enter one of the 151 original Pokèmon names or IDBCursor.`)

        // object logic
        pokeObject.id = data.id;
        pokeObject.pokeName =
          data.species.name.charAt(0).toUpperCase() +
          data.species.name.slice(1);
        pokeObject.pokeType = data.types.map(
          (el) => el.type.name.charAt(0).toUpperCase() + el.type.name.slice(1),
        );
        pokeObject.pokeImg = data.sprites.front_default;
        pokeObject.pokeStats.HP = data.stats[0].base_stat;
        pokeObject.pokeStats.Attack = data.stats[1].base_stat;
        pokeObject.pokeStats.Defense = data.stats[2].base_stat;
        pokeObject.pokeStats.Speed = data.stats[5].base_stat;
        pokeObject.cry = data.cries.legacy;
        console.log(pokeObject);
      })
      .then(() => {
        // 2/2 Fetch - Flavor Text
        return fetch(`${urlFlavor}/${pokeObject.id}`)
          .then((res) => {
            if (!res.ok) throw new Error(`${pokeName} wasn't found`);
            return res.json();
          })
          .then((data) => {
            console.log(data);
            let flavorTextObj = data.flavor_text_entries.find(
              (entry) => entry.language.name === "en",
            );
            pokeObject.flavorText = flavorTextObj
              ? flavorTextObj.flavor_text.replace(/[\n\f]/g, " ")
              : "No entry.";
            console.log(pokeObject.flavorText);
          })
          .then(() => {
            markPokemonSeen(pokeObject);
            anzeigeUndTimeout();
          });
      }) //catch fix
    .catch((error) => {
      console.error("Oh oh. ", error);
      mainPokemon.textContent = "No Pokemon found";
    });
});
  


btn.addEventListener("click", () => {
  const result = savePokemon(pokeObject);

  mainPokemon.textContent = result.message;
});

function deleteCard() {
  let pokeCard = document.getElementById("pokecard");
  if (pokeCard) {
    main.removeChild(pokeCard);
  }
}