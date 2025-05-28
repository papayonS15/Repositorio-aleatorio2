const languageSelect = document.getElementById('languageSelect');
const message = document.getElementById('message');
const repoCard = document.getElementById('repoCard');
const refreshBtn = document.getElementById('refreshBtn');
const languageInfo = document.getElementById('languageInfo');

let currentLanguage = "";

const languageDescriptions = {
  JavaScript: "JavaScript es un lenguaje de programación ampliamente usado para el desarrollo web del lado del cliente.",
  Python: "Python es un lenguaje versátil y fácil de aprender, popular en ciencia de datos, automatización y desarrollo web.",
  Java: "Java es un lenguaje robusto usado en aplicaciones empresariales, móviles (Android), y más.",
  "C++": "C++ es un lenguaje poderoso orientado a objetos, ideal para sistemas embebidos, videojuegos y software de alto rendimiento.",
  Go: "Go (o Golang) es un lenguaje eficiente desarrollado por Google, excelente para backend y sistemas distribuidos."
};

languageSelect.addEventListener('change', () => {
  currentLanguage = languageSelect.value;
  displayLanguageInfo(currentLanguage);

  if (currentLanguage) {
    fetchRepository(currentLanguage);
  } else {
    resetState("Por favor, selecciona un lenguaje", "");
  }
});

refreshBtn.addEventListener('click', () => {
  fetchRepository(currentLanguage);
});

function displayLanguageInfo(language) {
  if (languageDescriptions[language]) {
    languageInfo.innerHTML = languageDescriptions[language];
    languageInfo.style.display = "block";
  } else {
    languageInfo.style.display = "none";
  }
}

async function fetchRepository(language) {
  setLoadingState();

  try {
    const res = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=100`);
    if (!res.ok) throw new Error("API Error");

    const data = await res.json();
    const repos = data.items;
    if (!repos.length) throw new Error("No repos");

    const repo = repos[Math.floor(Math.random() * repos.length)];
    displayRepository(repo);
  } catch (err) {
    setErrorState();
  }
}

function resetState(msg, className) {
  message.className = `message ${className}`;
  message.innerHTML = msg;
  repoCard.style.display = "none";
  refreshBtn.style.display = "none";
}

function setLoadingState() {
  resetState("Cargando, por favor espera...", "loading");
}

function setErrorState() {
  message.className = "message error";
  message.innerHTML = `Error al obtener los repositorios<br><button class="retry-button" onclick="fetchRepository('${currentLanguage}')">Reintentar</button>`;
  repoCard.style.display = "none";
  refreshBtn.style.display = "none";
}

function displayRepository(repo) {
  message.className = "message";
  message.innerHTML = "";

  repoCard.innerHTML = `
    <h2><a href="${repo.html_url}" target="_blank">${repo.name}</a></h2>
    <p>${repo.description || "No hay descripción disponible."}</p>
    <div class="repo-meta">
      <div>⭐ Estrellas: ${repo.stargazers_count}</div>
      <div>🍴 Bifurcaciones: ${repo.forks_count}</div>
      <div>🐞 Problemas abiertos: ${repo.open_issues_count}</div>
      <div>📘 Lenguaje: ${repo.language}</div>
    </div>
  `;

  repoCard.style.display = "block";
  refreshBtn.style.display = "block";
}
