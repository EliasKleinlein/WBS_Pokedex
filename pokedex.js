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

// Blink Button (lol)
const blinkBtn = document.querySelector("#blinkBtn");
blinkBtn.addEventListener("click", () => {
  const colors = [
    { bg: "bg-red-300", shadow: "shadow-[0_0_15px_10px_#f87171]" },
    { bg: "bg-blue-300", shadow: "shadow-[0_0_15px_10px_#60a5fa]" },
    { bg: "bg-green-300", shadow: "shadow-[0_0_15px_10px_#34d399]" },
    { bg: "bg-yellow-300", shadow: "shadow-[0_0_15px_10px_#fbbf24]" },
    { bg: "bg-purple-300", shadow: "shadow-[0_0_15px_10px_#c084fc]" },
    { bg: "bg-pink-300", shadow: "shadow-[0_0_15px_10px_#f472b6]" },
  ];

  const rngColor = colors[Math.floor(Math.random() * colors.length)];

  blinkBtn.classList.add("transition-all", "duration-500");

  blinkBtn.classList.remove("bg-white");
  blinkBtn.classList.add(rngColor.bg, rngColor.shadow, "scale-95");
  setTimeout(() => {
    blinkBtn.classList.remove(rngColor.bg, rngColor.shadow, "scale-95");
    blinkBtn.classList.add("bg-white");
  }, 300);
});
