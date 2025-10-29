const API_URL = "https://api.pokemontcg.io/v2";
const LOG_API_BASE = "https://www.piway.com.br/unoesc/api";
const MATRICULA = 447676;

const cardsContainer = document.getElementById("cards");
const setList = document.getElementById("setList");
const feedback = document.getElementById("feedback");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const logsBtn = document.getElementById("logsBtn");
const logsModal = document.getElementById("logsModal");
const closeModal = document.getElementById("closeModal");
const logsList = document.getElementById("logsList");

// === BUSCAR CARTAS ===
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

      // REGISTRAR LOG DE SUCESSO
      registrarLog("Pokémon TCG", `cards?q=name:${name}`, `Resultados: ${data.data.length}`);
    })
    .catch(() => {
      showFeedback("Erro ao buscar dados. Tente novamente mais tarde.");
      // REGISTRAR LOG DE ERRO
      registrarLog("Pokémon TCG", `cards?q=name:${name}`, "Erro na requisição");
    });
});

// === CARREGAR COLEÇÕES ===
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

// === CARTAS ALEATÓRIAS ===
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

// === EXIBIR CARTAS ===
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


function registrarLog(api, metodo, resultado) {
  const url = `${LOG_API_BASE}/inserir/log/${MATRICULA}/${encodeURIComponent(api)}/${encodeURIComponent(metodo)}/${encodeURIComponent(resultado)}`;
  fetch(url)
    .then(res => res.text())
    .then(console.log)
    .catch(console.error);
}

logsBtn.addEventListener("click", () => {
  fetch(`${LOG_API_BASE}/logs/${MATRICULA}`)
    .then(res => res.json())
    .then(logs => {
      logsList.innerHTML = "";
      if (Array.isArray(logs) && logs.length > 0) {
        logs.forEach(log => {
          const li = document.createElement("li");
          li.innerHTML = `
            <span>${log.idlog} - ${log.api} | ${log.metodo} | ${log.resultado}</span>
            <button onclick="excluirLog(${log.idlog})">Excluir</button>
          `;
          logsList.appendChild(li);
        });
      } else {
        logsList.innerHTML = "<li>Nenhum log encontrado.</li>";
      }
      logsModal.style.display = "block";
    })
    .catch(() => {
      logsList.innerHTML = "<li>Erro ao carregar logs.</li>";
      logsModal.style.display = "block";
    });
});


function excluirLog(idLog) {
  fetch(`${LOG_API_BASE}/excluir/log/${idLog}/aluno/${MATRICULA}`)
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      logsBtn.click(); 
    })
    .catch(() => alert("Erro ao excluir log."));
}


closeModal.addEventListener("click", () => logsModal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === logsModal) logsModal.style.display = "none";
});


loadRandomCards();
loadSets();
