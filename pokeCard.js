const main = document.querySelector("#main");

const typeColor = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

function createCard(pokeObject) {
  const color = typeColor[pokeObject.pokeType];
  //creation
  const Card = document.createElement("div");
  Card.id = "pokecard";
  Card.className = `w-[90%] max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-2xl mx-auto my-10 bg-white rounded-3xl shadow-2xl overflow-hidden ring-4 ring-[${color}] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_${color}]`;
  const header = document.createElement("div");
  header.className = `relative bg-[${color}] pt-6 pb-14 px-6 lg:pt-8 lg:pb-20 lg:px-8 flex items-center justify-between`;

  const nameWrap = document.createElement("div");
  nameWrap.className = `flex flex-col text-white drop-shadow-md`;

  const pokeImg = document.createElement("img");
  pokeImg.src = pokeObject.pokeImg;
  pokeImg.className = `absolute -bottom-12 lg:-bottom-16 right-6 w-28 h-28 lg:w-40 lg:h-40 object-contain drop-shadow-xl bg-white rounded-full border-4 border-white`;

  const pokeName = document.createElement("h2");
  pokeName.textContent = pokeObject.pokeName;
  pokeName.className = `text-2xl lg:text-4xl font-extrabold capitalize tracking-wide`;

  const pokeId = document.createElement("h3");
  pokeId.textContent = `ID: ${pokeObject.id}`;
  pokeId.className = `text-sm font-semibold text-white/80`;

  const pokeType = document.createElement("p");
  pokeType.textContent = pokeObject.pokeType;
  pokeType.className = `self-start mt-2 px-3 py-1 bg-white/25 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-white`;

  const listStats = document.createElement("ul");
  listStats.className = `grid grid-cols-2 gap-x-8 gap-y-3 lg:gap-y-4 px-6 lg:px-8 pt-16 lg:pt-20 pb-6 lg:pb-8 text-sm lg:text-base font-semibold text-[#2A2A2A]`;
  const HP = document.createElement("li");
  HP.textContent = `HP: ${pokeObject.pokeStats.HP}`;
  HP.className = `flex justify-between border-b border-gray-200 pb-1`;

  const Attack = document.createElement("li");
  Attack.textContent = `Attack: ${pokeObject.pokeStats.Attack}`;
  Attack.className = `flex justify-between border-b border-gray-200 pb-1`;

  const Defense = document.createElement("li");
  Defense.textContent = `Defense: ${pokeObject.pokeStats.Defense}`;
  Defense.className = `flex justify-between border-b border-gray-200 pb-1`;

  const Speed = document.createElement("li");
  Speed.textContent = `Speed: ${pokeObject.pokeStats.Speed}`;
  Speed.className = `flex justify-between border-b border-gray-200 pb-1`;

  //appending
  nameWrap.appendChild(pokeName);
  nameWrap.appendChild(pokeId);
  nameWrap.appendChild(pokeType);
  header.appendChild(nameWrap);
  header.appendChild(pokeImg);

  listStats.appendChild(HP);
  listStats.appendChild(Attack);
  listStats.appendChild(Defense);
  listStats.appendChild(Speed);

  Card.appendChild(header);
  Card.appendChild(listStats);
  main.appendChild(Card);
}

export default createCard;
