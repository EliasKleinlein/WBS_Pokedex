import createCard from "./pokeCard.js";

const input = document.querySelector("form");
const pokeImg = document.querySelector("#poke-img");
const btn = document.querySelector("#saveBtn");
const mainPokemon = document.querySelector("#main-pokemon");
const main = document.querySelector("#main");
const url = "https://pokeapi.co/api/v2/pokemon";

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
  pokeNote: "Write a personal Note ✏️",
};

input.addEventListener("submit", (event) => {
  event.preventDefault();
  mainPokemon.textContent = "";
  const formData = new FormData(event.target);
  const pokeName = formData.get("q")?.toLocaleLowerCase();
  btn.disabled = true;
  btn.classList.add(
    "transition-all",
    "duration-700",
    "ease-in-out",
    "bg-red-400",
    "animate-pulse",
    "shadow-lg",
    "shadow-red-300",
  );
  btn.classList.remove("bg-white");

  setTimeout(() => {
    fetch(`${url}/${pokeName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${pokeName} wasn't found`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // pokeImg.src = data.sprites.front_default;
        // pokeImg.classList.remove("hidden");
        // mainPokemon.textContent = `Name: ${data.types[0].type.name}
        // ID: ${data.id}`;

        // object logic
        pokeObject.id = data.id;
        pokeObject.pokeName = data.species.name;
        pokeObject.pokeType = data.types[0].type.name;
        pokeObject.pokeImg = data.sprites.front_default;
        pokeObject.pokeStats.HP = data.stats[0].base_stat;
        pokeObject.pokeStats.Attack = data.stats[1].base_stat;
        pokeObject.pokeStats.Defense = data.stats[2].base_stat;
        pokeObject.pokeStats.Speed = data.stats[5].base_stat;
        console.log(pokeObject);

        deleteCard();

        createCard(pokeObject);

        //btn logic
        btn.classList.remove(
          "bg-red-400",
          "animate-pulse",
          "shadow-lg",
          "shadow-red-300",
        );
        btn.classList.add("bg-white");
        btn.disabled = false;
      })
      .catch((error) => {
        console.error("Oh oh. ", error);
        mainPokemon.textContent = "No Pokemon found";
        btn.classList.remove(
          "bg-red-400",
          "animate-pulse",
          "shadow-lg",
          "shadow-red-300",
        );
        btn.classList.add("bg-white");
        btn.disabled = false;
      });
    input.reset();
  }, 2000);
});

function deleteCard() {
  let pokeCard = document.getElementById("pokecard");
  if (pokeCard) {
    main.removeChild(pokeCard);
  }
}
