const STORAGE_KEY = "pokedex";
const SEEN_STORAGE_KEY = "seenPokemon";

function readStorageArray(key) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error(`The localStorage entry "${key}" could not be read.`, error);
    return [];
  }
}

function createStorageCopy(pokemon) {
  return {
    id: Number(pokemon.id),
    pokeName: pokemon.pokeName,
    pokeType: Array.isArray(pokemon.pokeType)
      ? [...pokemon.pokeType]
      : [pokemon.pokeType],
    pokeImg: pokemon.pokeImg,
    pokeStats: {
      HP: pokemon.pokeStats?.HP ?? "?",
      Attack: pokemon.pokeStats?.Attack ?? "?",
      Defense: pokemon.pokeStats?.Defense ?? "?",
      Speed: pokemon.pokeStats?.Speed ?? "?",
    },
    cry: pokemon.cry ?? "",
    flavorText: pokemon.flavorText ?? "",
    pokeNote:
      pokemon.pokeNote === "Write a personal Note ✏️"
        ? ""
        : (pokemon.pokeNote ?? ""),
  };
}

export function getSavedPokemon() {
  return readStorageArray(STORAGE_KEY);
}

export function getSeenPokemonIds() {
  return readStorageArray(SEEN_STORAGE_KEY)
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function markPokemonSeen(pokemon) {
  const pokemonId = Number(pokemon?.id);

  if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
    return false;
  }

  const seenPokemonIds = new Set(getSeenPokemonIds());

  seenPokemonIds.add(pokemonId);

  localStorage.setItem(
    SEEN_STORAGE_KEY,
    JSON.stringify([...seenPokemonIds].sort((a, b) => a - b)),
  );

  return true;
}

export function savePokemon(pokemon) {
  const pokemonId = Number(pokemon?.id);

  if (!Number.isInteger(pokemonId) || pokemonId <= 0 || !pokemon?.pokeName) {
    return {
      status: "invalid",
      message: "No valid Pokémon is available to catch.",
    };
  }

  markPokemonSeen(pokemon);

  const savedPokemon = getSavedPokemon();

  const alreadySaved = savedPokemon.some(
    (entry) => Number(entry.id) === pokemonId,
  );

  if (alreadySaved) {
    return {
      status: "duplicate",
      message: `${pokemon.pokeName} is already in your Pokédex.`,
    };
  }

  const pokemonToSave = createStorageCopy(pokemon);

  savedPokemon.push(pokemonToSave);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPokemon));

  return {
    status: "saved",
    message: `${pokemon.pokeName} was caught!`,
    pokemon: pokemonToSave,
  };
}

export function updatePokemonNote(pokemonId, note) {
  const savedPokemon = getSavedPokemon();

  const pokemonIndex = savedPokemon.findIndex(
    (entry) => Number(entry.id) === Number(pokemonId),
  );

  if (pokemonIndex === -1) {
    return null;
  }

  savedPokemon[pokemonIndex].pokeNote = note;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPokemon));

  return savedPokemon[pokemonIndex];
}

export { STORAGE_KEY, SEEN_STORAGE_KEY };

export default savePokemon;
