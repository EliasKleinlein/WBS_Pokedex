import {
  getSavedPokemon,
  getSeenPokemonIds,
  updatePokemonNote,
} from "./save.js";

const POKEMON_SPECIES_URL =
  "https://pokeapi.co/api/v2/pokemon-species?limit=100000&offset=0";

const SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

let caughtPokemonById = new Map();
let seenPokemonIds = new Set();

function getPokemonId(url) {
  const urlParts = url.split("/").filter(Boolean);

  return Number(urlParts.at(-1));
}

function formatPokemonName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function fetchPokemonCatalog() {
  const response = await fetch(POKEMON_SPECIES_URL);

  if (!response.ok) {
    throw new Error("The Pokémon list could not be loaded.");
  }

  const data = await response.json();

  return data.results
    .map((pokemon) => {
      const id = getPokemonId(pokemon.url);

      return {
        id,
        pokeName: formatPokemonName(pokemon.name),
        pokeImg: `${SPRITE_URL}/${id}.png`,
      };
    })
    .filter((pokemon) => Number.isInteger(pokemon.id))
    .sort((firstPokemon, secondPokemon) => {
      return firstPokemon.id - secondPokemon.id;
    });
}

function getPokemonStatus(pokemonId) {
  if (caughtPokemonById.has(pokemonId)) {
    return "caught";
  }

  if (seenPokemonIds.has(pokemonId)) {
    return "seen";
  }

  return "unknown";
}

export function createPokedexSprite(pokemon) {
  const status = getPokemonStatus(pokemon.id);

  const caughtPokemon = caughtPokemonById.get(pokemon.id);

  const slot = document.createElement("button");

  slot.type = "button";

  slot.dataset.pokemonName = pokemon.pokeName.toLowerCase();
  slot.dataset.pokemonId = String(pokemon.id);

  slot.className =
    "relative flex h-32 w-32 flex-none flex-col items-center justify-center overflow-hidden p-2 transition";

  const image = document.createElement("img");

  image.src = caughtPokemon?.pokeImg || pokemon.pokeImg;

  image.loading = "lazy";

  image.className = "h-[72%] w-[72%] object-contain drop-shadow-lg";

  const name = document.createElement("span");

  name.className =
    "w-full truncate rounded bg-slate-950/75 px-1 py-0.5 text-center text-[0.6rem] font-bold text-white sm:text-xs";

  const number = document.createElement("span");

  number.className =
    "absolute left-1 top-1 rounded bg-slate-950/75 px-1.5 py-0.5 text-[0.55rem] font-bold text-white sm:text-[0.65rem]";

  number.textContent = `#${String(pokemon.id).padStart(3, "0")}`;

  if (status === "caught") {
    slot.classList.add("hover:-translate-y-1");

    image.alt = `${caughtPokemon.pokeName} caught`;

    name.textContent = caughtPokemon.pokeName;

    slot.addEventListener("click", () => {
      renderPokemonDetails(caughtPokemon);
    });
  } else if (status === "seen") {
    slot.disabled = true;

    image.alt = `${pokemon.pokeName} seen`;

    image.classList.add("grayscale");

    name.textContent = pokemon.pokeName;
  } else {
    slot.disabled = true;

    image.alt = "Unknown Pokémon silhouette";

    image.classList.add("brightness-0", "opacity-60");

    name.textContent = "???";
  }

  slot.append(image, name, number);

  return slot;
}

function createStat(label, value) {
  const stat = document.createElement("div");

  stat.className =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-center shadow-sm";

  const statLabel = document.createElement("dt");

  statLabel.className = "text-xs font-bold uppercase text-slate-500";

  statLabel.textContent = label;

  const statValue = document.createElement("dd");

  statValue.className = "mt-1 text-lg font-black text-slate-900";

  statValue.textContent = value ?? "?";

  stat.append(statLabel, statValue);

  return stat;
}

function renderPokemonDetails(pokemon) {
  const detailsContainer = document.querySelector("#pokemon-details");

  if (!detailsContainer) {
    return;
  }

  const card = document.createElement("article");

  card.className =
    "grid gap-6 rounded-3xl border-4 border-slate-300 bg-white/95 p-5 shadow-2xl md:grid-cols-[15rem_1fr]";

  const image = document.createElement("img");

  image.src = pokemon.pokeImg;

  image.alt = `${pokemon.pokeName} sprite`;

  image.className =
    "mx-auto h-56 w-56 rounded-3xl bg-slate-100 object-contain drop-shadow-xl";

  const content = document.createElement("div");

  content.className = "space-y-5";

  const heading = document.createElement("h2");

  heading.className = "text-3xl font-black";

  heading.textContent = `${pokemon.pokeName} #${String(pokemon.id).padStart(
    3,
    "0",
  )}`;

  const type = document.createElement("p");

  type.className = "font-bold text-slate-600";

  type.textContent = Array.isArray(pokemon.pokeType)
    ? pokemon.pokeType.join(" / ")
    : pokemon.pokeType;

  const stats = document.createElement("dl");

  stats.className = "grid grid-cols-2 gap-3 sm:grid-cols-4";

  stats.append(
    createStat("HP", pokemon.pokeStats?.HP),
    createStat("Attack", pokemon.pokeStats?.Attack),
    createStat("Defense", pokemon.pokeStats?.Defense),
    createStat("Speed", pokemon.pokeStats?.Speed),
  );

  const flavorText = document.createElement("p");

  flavorText.className = "rounded-2xl bg-slate-100 p-4 text-slate-700";

  flavorText.textContent = pokemon.flavorText || "No entry.";

  const noteLabel = document.createElement("label");

  noteLabel.htmlFor = `note-${pokemon.id}`;

  noteLabel.className = "block text-lg font-black";

  noteLabel.textContent = "Personal note ✏️";

  const noteInput = document.createElement("textarea");

  noteInput.id = `note-${pokemon.id}`;

  noteInput.rows = 4;
  noteInput.maxLength = 500;

  noteInput.value = pokemon.pokeNote ?? "";

  noteInput.placeholder = "Write a personal note...";

  noteInput.className =
    "w-full resize-y rounded-2xl border-2 border-slate-300 p-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-300";

  const noteStatus = document.createElement("p");

  noteStatus.className = "min-h-5 text-sm font-bold text-emerald-700";

  noteStatus.setAttribute("aria-live", "polite");

  noteInput.addEventListener("input", () => {
    const updatedPokemon = updatePokemonNote(pokemon.id, noteInput.value);

    if (updatedPokemon) {
      caughtPokemonById.set(Number(updatedPokemon.id), updatedPokemon);

      noteStatus.textContent = "Note saved.";
    } else {
      noteStatus.textContent = "The note could not be saved.";
    }
  });

  content.append(
    heading,
    type,
    stats,
    flavorText,
    noteLabel,
    noteInput,
    noteStatus,
  );

  card.append(image, content);

  detailsContainer.replaceChildren(card);
}

function clearPokemonDetails() {
  const detailsContainer = document.querySelector("#pokemon-details");

  if (!detailsContainer) {
    return;
  }

  const message = document.createElement("p");

  message.className =
    "rounded-2xl border-2 border-dashed border-slate-400 bg-white/90 p-6 text-center font-bold text-slate-600";

  message.textContent =
    "Select a caught Pokémon to view its stats and personal note.";

  detailsContainer.replaceChildren(message);
}

async function renderAllPokemon() {
  const container = document.querySelector("#pokedex-list");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <p class="col-span-full py-12 text-center font-bold text-white">
      Loading Pokémon...
    </p>
  `;

  try {
    const pokemonCatalog = await fetchPokemonCatalog();

    container.replaceChildren();

    pokemonCatalog.forEach((pokemon) => {
      container.appendChild(createPokedexSprite(pokemon));
    });

    clearPokemonDetails();
  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <p class="col-span-full rounded-2xl bg-red-100 p-6 text-center font-bold text-red-800">
        The Pokémon list could not be loaded.
      </p>
    `;
  }
}
export function renderPokedex() {
  caughtPokemonById = new Map(
    getSavedPokemon().map((pokemon) => [Number(pokemon.id), pokemon]),
  );

  seenPokemonIds = new Set(getSeenPokemonIds());

  renderAllPokemon();
}

export { fetchPokemonCatalog };

export default renderPokedex;
