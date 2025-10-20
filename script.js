const API_URL = "https://api.pokemontcg.io/v2";
const cardsContainer = document.getElementById("cards");
const setList = document.getElementById("setList");
const feedback = document.getElementById("feedback");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
  const name = searchInput.value.trim();
  if (!name) {
    showFeedback("Digite o nome de um Pokémon para buscar.");
    return;
  }
  showFeedback("🔍 Buscando cartas...");
  fetch(`${API_URL}/cards?q=name:${name}`)
    .then(res => res.json())
    .then(data => {
      if (data.data.length === 0) {
        showFeedback("Nenhuma carta encontrada. Tente outro nome!");
        cardsContainer.innerHTML = "";
      } else {
        showFeedback(`Foram encontradas ${data.data.length} cartas.`);
        showCards(data.data);
      }
    })
    .catch(() => showFeedback("Erro ao buscar dados. Tente novamente mais tarde."));
});

function loadSets() {
  fetch(`${API_URL}/sets`)
    .then(res => res.json())
    .then(data => {
      setList.innerHTML = "";
      data.data.slice(0, 8).forEach(set => {
        const li = document.createElement("li");
        li.textContent = `${set.name}`;
        setList.appendChild(li);
      });
    })
    .catch(() => showFeedback("Erro ao carregar coleções."));
}

function loadRandomCards() {
  showFeedback("Carregando cartas iniciais...");
  fetch(`${API_URL}/cards?pageSize=6`)
    .then(res => res.json())
    .then(data => {
      showFeedback("");
      showCards(data.data);
    })
    .catch(() => showFeedback("Erro ao carregar cartas."));
}

function showCards(cards) {
  cardsContainer.innerHTML = "";
  cards.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${card.images.small}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p><b>Raridade:</b> ${card.rarity || "Desconhecida"}</p>
      <p><b>Tipo:</b> ${card.types ? card.types.join(", ") : "N/A"}</p>
    `;
    cardsContainer.appendChild(div);
  });
}

function showFeedback(msg) {
  feedback.textContent = msg;
}

loadRandomCards();
loadSets();
