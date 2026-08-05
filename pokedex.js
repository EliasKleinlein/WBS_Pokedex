import renderPokedex from "./pokedexSprite.js";

const searchForm = document.querySelector("#pokedex-search-form");
const searchInput = document.querySelector("#pokedex-search");

renderPokedex();

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchValue = searchInput.value.trim().toLowerCase();
  const pokemonSlots = document.querySelectorAll(
    "#pokedex-list [data-pokemon-id]",
  );

  pokemonSlots.forEach((pokemonSlot) => {
    const pokemonName = pokemonSlot.dataset.pokemonName;
    const pokemonId = pokemonSlot.dataset.pokemonId;

    const matchesSearch =
      searchValue === "" ||
      pokemonName.includes(searchValue) ||
      pokemonId === searchValue;

    pokemonSlot.classList.toggle("hidden", !matchesSearch);
  });
});

searchInput.addEventListener("search", () => {
  if (searchInput.value !== "") {
    return;
  }

  const pokemonSlots = document.querySelectorAll(
    "#pokedex-list [data-pokemon-id]",
  );

  pokemonSlots.forEach((pokemonSlot) => {
    pokemonSlot.classList.remove("hidden");
  });
});
