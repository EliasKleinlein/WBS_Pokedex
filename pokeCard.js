const main = document.querySelector("#main");

const typeColor = {
  grass: "#32a852",
  water: "#0983ed",
};

function createCard(pokeObject) {
  //creation
  const Card = document.createElement("div");
  Card.id = "pokecard";
  Card.className = ` max-w-md w-[90%] mx-auto my-10 p-6 bg-[#f0f0f0] border-3 border-[${typeColor[pokeObject.pokeType]}] rounded-3xl shadow-xl transition-all duration-300 `;
  const pokeImg = document.createElement("img");
  pokeImg.src = pokeObject.pokeImg;
  pokeImg.className = ``;
  const pokeName = document.createElement("h2");
  pokeName.textContent = pokeObject.pokeName;
  const pokeId = document.createElement("h3");
  pokeId.textContent = `ID: ${pokeObject.id}`;
  const pokeType = document.createElement("p");
  pokeType.textContent = pokeObject.pokeType;
  const listStats = document.createElement("ul");
  const HP = document.createElement("li");
  HP.textContent = `HP: ${pokeObject.pokeStats.HP}`;
  const Attack = document.createElement("li");
  Attack.textContent = `Attack: ${pokeObject.pokeStats.Attack}`;
  const Defense = document.createElement("li");
  Defense.textContent = `Defense: ${pokeObject.pokeStats.Defense}`;
  const Speed = document.createElement("li");
  Speed.textContent = `Speed: ${pokeObject.pokeStats.Speed}`;

  //appending
  Card.appendChild(pokeImg);
  Card.appendChild(pokeName);
  Card.appendChild(pokeId);
  Card.appendChild(pokeType);
  listStats.appendChild(HP);
  listStats.appendChild(Attack);
  listStats.appendChild(Defense);
  listStats.appendChild(Speed);
  Card.appendChild(listStats);
  main.appendChild(Card);
}

export default createCard;
