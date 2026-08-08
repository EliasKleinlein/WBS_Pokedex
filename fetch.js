import createCard from "./pokeCard.js";
import { markPokemonSeen } from "./save.js";

const input = document.querySelector("form");
const btn = document.querySelector("#saveBtn");
const mainPokemon = document.querySelector("#main-pokemon");
const main = document.querySelector("#main");
const url = "https://pokeapi.co/api/v2/pokemon";
const urlFlavor = "https://pokeapi.co/api/v2/pokemon-species/";
const basePikachu = "./pics/pikaSilhouette.png";

//pokeObject
export const pokeObjectBase = {
  id: "???",
  pokeName: "???",
  pokeType: ["Unidentified"],
  pokeImg: basePikachu,
  pokeStats: {
    HP: "???",
    Attack: "???",
    Defense: "???",
    Speed: "???",
  },
  cry: "???",
  flavorText: "???",
  pokeNote: "Write a personal Note ✏️",
};

const pokeObjectNotFound = {
  id: "???",
  pokeName: "Not found",
  pokeType: ["Unidentified"],
  pokeImg: basePikachu,
  pokeStats: {
    HP: "???",
    Attack: "???",
    Defense: "???",
    Speed: "???",
  },
  cry: "./sounds/pokeDeny.mp3",
  flavorText: "???",
  pokeNote: "Write a personal Note ✏️",
};

export const pokeObject = structuredClone(pokeObjectBase);

// btn logic
// Anzeige von Pokemon und blinkender Button mit Delay bis Anzeige
function anzeigeUndTimeout(bool) {
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
  let pokeCard = document.getElementById("pokecard");
  pokeCard.classList.add(
    "animate-pulse",
    "brightness-75",
    "transition-all",
    "opacity-20",
    "ease",
  );
  pokeCard.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  setTimeout(() => {
    btn.classList.remove(
      "bg-red-400",
      "animate-pulse",
      "shadow-lg",
      "shadow-red-300",
    );
    btn.classList.add("bg-white");
    btn.disabled = false;
    deleteCard();

    if (bool) {
      createCard(pokeObject);
      const pokeCry = new Audio(pokeObject.cry);
      pokeCry.play();
      pokeCry.volume = 0.3;
    } else {
      createCard(pokeObjectNotFound);
      // const notFoundSound = new Audio("./sounds/pokeDeny.mp3");
      const notFoundSound = new Audio(pokeObjectNotFound.cry);
      notFoundSound.play();
    }
    input.reset();
  }, 3000);
}

function fetching(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const pokeName = formData.get("q")?.toLocaleLowerCase();
  mainPokemon.textContent = "";

  // 1/2 Fetch - alles außer Flavor Text
  fetch(`${url}/${pokeName}`)
    .then((res) => {
      if (!res.ok) throw new Error(`${pokeName} wasn't found`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      // object logic
      pokeObject.id = data.id;
      pokeObject.pokeName =
        data.species.name.charAt(0).toUpperCase() + data.species.name.slice(1);
      pokeObject.pokeType = data.types.map(
        (el) => el.type.name.charAt(0).toUpperCase() + el.type.name.slice(1),
      );
      pokeObject.pokeImg = data.sprites.front_default;
      pokeObject.pokeStats.HP = data.stats[0].base_stat;
      pokeObject.pokeStats.Attack = data.stats[1].base_stat;
      pokeObject.pokeStats.Defense = data.stats[2].base_stat;
      pokeObject.pokeStats.Speed = data.stats[5].base_stat;
      // noch "or" ändern
      pokeObject.cry = data.cries.legacy
        ? data.cries.legacy
        : data.cries.latest;
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
          anzeigeUndTimeout(true);
        });
    }) //catch fix
    .catch((error) => {
      anzeigeUndTimeout(false);
      console.error("Oh oh. ", error);
    });
}

function deleteCard() {
  let pokeCard = document.getElementById("pokecard");
  if (pokeCard) {
    main.removeChild(pokeCard);
  }
}

export default fetching;
