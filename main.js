import { savePokemon } from "./save.js";
import createCard from "./pokeCard.js";
import fetching, { pokeObject, pokeObjectBase } from "./fetch";

const input = document.querySelector("form");
const btn = document.querySelector("#saveBtn");
const mainPokemon = document.querySelector("#main-pokemon");
let moveUp = true;

setInterval(() => {
  const movingPokemon = document.querySelector("#pokecard-img");
  moveUp
    ? movingPokemon.classList.add("rotate-4")
    : movingPokemon.classList.remove("rotate-4");
  moveUp = !moveUp;
}, 500);

createCard(pokeObjectBase);

input.addEventListener("submit", (event) => {
  fetching(event);
});

btn.addEventListener("click", () => {
  const result = savePokemon(pokeObject);

  mainPokemon.textContent = result.message;
});
