// ===== DATOS DE EJEMPLO =====

const songs = [
  { title: "Radio Panamericana", artist: "En vivo", emoji: "📻", src: "" },
  { title: "Cumbia Total", artist: "Mix Perú", emoji: "🎧", src: "" },
  { title: "Huaynos Clásicos", artist: "Andina FM", emoji: "🏔️", src: "" },
  { title: "Salsa & Sabor", artist: "Tropical Mix", emoji: "🎺", src: "" },
  { title: "Criolla de Colección", artist: "Perú Criollo", emoji: "🎸", src: "" },
  { title: "Top 40 Perú", artist: "Hits FM", emoji: "🔥", src: "" },
  { title: "Chicha Sensación", artist: "Retro Mix", emoji: "🕺", src: "" },
  { title: "Rock en Español", artist: "Perú Rock", emoji: "🎸", src: "" },
];

const tvChannels = [
  { name: "América TV", cat: "Señal abierta", initial: "A" },
  { name: "Latina", cat: "Señal abierta", initial: "L" },
  { name: "TV Perú", cat: "Canal estatal", initial: "TVP" },
  { name: "ATV", cat: "Señal abierta", initial: "ATV" },
  { name: "Panamericana TV", cat: "Señal abierta", initial: "P" },
  { name: "Willax TV", cat: "Señal abierta", initial: "W" },
  { name: "Canal N", cat: "Noticias 24h", initial: "N" },
  { name: "RPP TV", cat: "Noticias 24h", initial: "RPP" },
];

const news = [
  { tag: "Música", title: "Festival de música andina reúne a miles en Cusco", excerpt: "El evento celebró la fusión entre ritmos tradicionales y sonidos modernos.", emoji: "🎶", date: "Hace 2 horas" },
  { tag: "TV", title: "Canales peruanos estrenan nueva programación nocturna", excerpt: "Las señales locales renuevan su parrilla con series y magazines.", emoji: "📺", date: "Hace 5 horas" },
  { tag: "Entretenimiento", title: "Artistas peruanos preparan gira nacional para fin de año", excerpt: "La gira recorrerá diez ciudades del país con entrada libre.", emoji: "🎤", date: "Hoy" },
  { tag: "Cultura", title: "Nueva plataforma digital impulsa la música independiente", excerpt: "Productores locales encuentran un espacio para difundir su trabajo.", emoji: "🎹", date: "Ayer" },
  { tag: "Deportes", title: "Selección peruana se prepara para próximos amistosos", excerpt: "El equipo nacional afina detalles de cara a la nueva fecha FIFA.", emoji: "⚽", date: "Ayer" },
  { tag: "Tecnología", title: "El streaming en vivo crece con fuerza entre usuarios peruanos", excerpt: "Cada vez más personas consumen radio y TV a través de internet.", emoji: "💻", date: "Hace 2 días" },
];

const trending = [
  { rank: 1, songIndex: 1, plays: "128K", trend: "up" },
  { rank: 2, songIndex: 5, plays: "104K", trend: "up" },
  { rank: 3, songIndex: 3, plays: "98K", trend: "same" },
  { rank: 4, songIndex: 2, plays: "87K", trend: "down" },
  { rank: 5, songIndex: 6, plays: "76K", trend: "up" },
];

const premieres = [
  { title: "Videoclip: Costa y Sierra", channel: "Perú Music TV", views: "12K vistas", emoji: "🎬", badge: "NUEVO" },
  { title: "Detrás de cámaras: Festival Cusco", channel: "Cultura Perú", views: "8.4K vistas", emoji: "🎥", badge: "NUEVO" },
  { title: "Entrevista: Artista revelación 2026", channel: "Show Perú", views: "15K vistas", emoji: "🎙️", badge: "ESTRENO" },
  { title: "Documental: Historia de la Cumbia", channel: "PerúStream Original", views: "20K vistas", emoji: "📼", badge: "ESTRENO" },
];

const chatBotMessages = [
  "¡Hola! Bienvenido al chat en vivo 👋",
  "¿Qué canción están escuchando?",
  "El canal América TV está buena la señal hoy",
  "Alguien vio las noticias de hoy?",
  "Saludos desde Arequipa 🙌",
  "Esta plataforma está quedando genial",
];

// ===== NAV MENU (móvil) =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    nav.classList.remove("open");
  });
});

// ===== MÚSICA =====
const musicGrid = document.getElementById("musicGrid");
const audioPlayer = document.getElementById("audioPlayer");
const playerBar = document.getElementById("playerBar");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressFill = document.getElementById("progressFill");
const volumeSlider = document.getElementById("volumeSlider");

let currentSongIndex = -1;
let isPlaying = false;

function renderMusic() {
  musicGrid.innerHTML = songs.map((song, i) => `
    <div class="music-card" data-index="${i}">
      <div class="music-cover">
        ${song.emoji}
        <div class="play-overlay">▶</div>
      </div>
      <div class="music-info">
        <div class="title">${song.title}</div>
        <div class="artist">${song.artist}</div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".music-card").forEach(card => {
    card.addEventListener("click", () => {
      const i = Number(card.dataset.index);
      loadSong(i);
    });
  });
}

function loadSong(i) {
  currentSongIndex = i;
  const song = songs[i];
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  playerCover.style.display = "none";
  playerBar.classList.add("visible");

  document.querySelectorAll(".music-card").forEach(c => c.classList.remove("playing"));
  document.querySelector(`.music-card[data-index="${i}"]`).classList.add("playing");

  // Simulación de reproducción (sin archivo de audio real de demostración)
  isPlaying = true;
  playBtn.textContent = "⏸";
  simulateProgress();
}

function simulateProgress() {
  let progress = 0;
  clearInterval(window._progressInterval);
  progressFill.style.width = "0%";
  window._progressInterval = setInterval(() => {
    if (!isPlaying) return;
    progress += 0.5;
    if (progress >= 100) progress = 0;
    progressFill.style.width = progress + "%";
  }, 150);
}

playBtn.addEventListener("click", () => {
  if (currentSongIndex === -1) { loadSong(0); return; }
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? "⏸" : "▶";
});

prevBtn.addEventListener("click", () => {
  if (currentSongIndex <= 0) return;
  loadSong(currentSongIndex - 1);
});

nextBtn.addEventListener("click", () => {
  if (currentSongIndex === -1 || currentSongIndex >= songs.length - 1) return;
  loadSong(currentSongIndex + 1);
});

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value / 100;
});

renderMusic();

// ===== TENDENCIAS =====
const trendingList = document.getElementById("trendingList");
const trendSymbols = { up: "▲", down: "▼", same: "▬" };

function renderTrending() {
  trendingList.innerHTML = trending.map(t => {
    const song = songs[t.songIndex];
    return `
      <div class="trending-item" data-song-index="${t.songIndex}">
        <div class="trending-rank">${t.rank}</div>
        <div class="trending-icon">${song.emoji}</div>
        <div class="trending-body">
          <div class="trending-title">${song.title}</div>
          <div class="trending-artist">${song.artist}</div>
        </div>
        <div class="trending-stats">
          <span class="trending-plays">${t.plays}</span>
          <span class="trend-${t.trend}">${trendSymbols[t.trend]}</span>
        </div>
        <button class="trending-play-btn">▶</button>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".trending-item").forEach(item => {
    item.addEventListener("click", () => {
      loadSong(Number(item.dataset.songIndex));
      document.querySelectorAll(".trending-item").forEach(t => t.classList.remove("playing"));
      item.classList.add("playing");
      document.getElementById("musica").scrollIntoView({ behavior: "smooth" });
    });
  });
}

renderTrending();

// ===== ESTRENOS =====
const premiereGrid = document.getElementById("premiereGrid");
const videoModal = document.getElementById("videoModal");
const videoModalEmoji = document.getElementById("videoModalEmoji");
const videoModalTitle = document.getElementById("videoModalTitle");
const videoModalChannel = document.getElementById("videoModalChannel");
const videoModalClose = document.getElementById("videoModalClose");

function renderPremieres() {
  premiereGrid.innerHTML = premieres.map((p, i) => `
    <div class="premiere-card" data-index="${i}">
      <div class="premiere-thumb">
        <span class="premiere-badge">${p.badge}</span>
        ${p.emoji}
        <div class="premiere-play">▶</div>
      </div>
      <div class="premiere-body">
        <div class="premiere-title">${p.title}</div>
        <div class="premiere-meta"><span>${p.channel}</span><span>${p.views}</span></div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".premiere-card").forEach(card => {
    card.addEventListener("click", () => playPremiere(Number(card.dataset.index)));
  });
}

function playPremiere(i) {
  const p = premieres[i];
  videoModalEmoji.textContent = p.emoji;
  videoModalTitle.textContent = p.title;
  videoModalChannel.textContent = `${p.channel} · ${p.views}`;
  videoModal.classList.add("open");
}

videoModalClose.addEventListener("click", () => videoModal.classList.remove("open"));
videoModal.addEventListener("click", (e) => { if (e.target === videoModal) videoModal.classList.remove("open"); });

renderPremieres();

// ===== TV EN VIVO =====
const tvChannelList = document.getElementById("tvChannelList");
const tvChannelName = document.getElementById("tvChannelName");
const tvInfoName = document.getElementById("tvInfoName");

function renderChannels() {
  tvChannelList.innerHTML = tvChannels.map((ch, i) => `
    <div class="tv-channel-item ${i === 0 ? "active" : ""}" data-index="${i}">
      <div class="tv-channel-logo">${ch.initial}</div>
      <div>
        <div class="tv-channel-name">${ch.name}</div>
        <div class="tv-channel-cat">${ch.cat}</div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".tv-channel-item").forEach(item => {
    item.addEventListener("click", () => {
      const i = Number(item.dataset.index);
      selectChannel(i);
    });
  });
}

function selectChannel(i) {
  const ch = tvChannels[i];
  tvChannelName.textContent = ch.name;
  tvInfoName.textContent = ch.name;
  document.querySelectorAll(".tv-channel-item").forEach(c => c.classList.remove("active"));
  document.querySelector(`.tv-channel-item[data-index="${i}"]`).classList.add("active");
}

renderChannels();

// ===== NOTICIAS =====
const newsGrid = document.getElementById("newsGrid");

function renderNews() {
  newsGrid.innerHTML = news.map(n => `
    <div class="news-card">
      <div class="news-image">${n.emoji}</div>
      <div class="news-body">
        <div class="news-tag">${n.tag}</div>
        <div class="news-title">${n.title}</div>
        <div class="news-excerpt">${n.excerpt}</div>
        <span class="news-date">${n.date}</span>
      </div>
    </div>
  `).join("");
}

renderNews();

// ===== CHAT INTERACTIVO =====
const chatWidget = document.getElementById("chatWidget");
const chatFab = document.getElementById("chatFab");
const chatCloseBtn = document.getElementById("chatCloseBtn");
const chatToggleLink = document.getElementById("chatToggleLink");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function openChat() { chatWidget.classList.add("open"); }
function closeChat() { chatWidget.classList.remove("open"); }

chatFab.addEventListener("click", () => chatWidget.classList.toggle("open"));
chatCloseBtn.addEventListener("click", closeChat);
chatToggleLink.addEventListener("click", (e) => { e.preventDefault(); openChat(); });

function addMessage(user, text, isOwn = false) {
  const div = document.createElement("div");
  div.className = "chat-msg" + (isOwn ? " own" : "");
  div.innerHTML = `<span class="user">${user}:</span>${text}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage("Tú", text, true);
  chatInput.value = "";

  setTimeout(() => {
    const random = chatBotMessages[Math.floor(Math.random() * chatBotMessages.length)];
    addMessage("Usuario" + Math.floor(Math.random() * 90 + 10), random);
  }, 900 + Math.random() * 800);
});

// Mensajes iniciales de ejemplo
["Invitado21", "MusicFan", "LimaNorte"].forEach((user, i) => {
  setTimeout(() => addMessage(user, chatBotMessages[i]), 400 * (i + 1));
});

// ===== AGENTE DE IA =====
const aiWidget = document.getElementById("aiWidget");
const aiFab = document.getElementById("aiFab");
const aiCloseBtn = document.getElementById("aiCloseBtn");
const aiMessages = document.getElementById("aiMessages");
const aiForm = document.getElementById("aiForm");
const aiInput = document.getElementById("aiInput");
const aiSuggestions = document.getElementById("aiSuggestions");

aiFab.addEventListener("click", () => {
  aiWidget.classList.toggle("open");
  if (aiWidget.classList.contains("open") && aiMessages.children.length === 0) {
    aiGreet();
  }
});
aiCloseBtn.addEventListener("click", () => aiWidget.classList.remove("open"));

// Base de conocimiento simple para las recomendaciones del agente
const genreMap = {
  cumbia: [1, 6], chicha: [6], salsa: [3], tropical: [3],
  huayno: [2], andina: [2], andino: [2], criolla: [4], vals: [4],
  rock: [7], pop: [5],
};
const moodMap = {
  fiesta: [1, 3, 6], bailar: [1, 3, 6],
  relajar: [2, 4], tranquilo: [2, 4], calma: [2, 4],
  triste: [4, 2], nostalgia: [4, 2],
  alegre: [1, 3, 5], animo: [1, 3, 5],
};

function aiAddMessage(html, isUser = false) {
  const div = document.createElement("div");
  div.className = "ai-msg " + (isUser ? "user" : "bot");
  div.innerHTML = html;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function songChip(index) {
  return `<button class="ai-chip" data-action="song" data-index="${index}">▶ ${songs[index].title}</button>`;
}
function channelChip(index) {
  return `<button class="ai-chip" data-action="channel" data-index="${index}">📺 ${tvChannels[index].name}</button>`;
}
function premiereChip(index) {
  return `<button class="ai-chip" data-action="premiere" data-index="${index}">🎬 ${premieres[index].title}</button>`;
}

function aiRespondWithChips(text, chipsHtml) {
  aiAddMessage(`${text}<div class="ai-chip-row">${chipsHtml}</div>`);
}

// Delegación de clicks para los chips generados dinámicamente
aiMessages.addEventListener("click", (e) => {
  const chip = e.target.closest(".ai-chip");
  if (!chip) return;
  const action = chip.dataset.action;
  const index = Number(chip.dataset.index);
  if (action === "song") {
    loadSong(index);
    document.getElementById("musica").scrollIntoView({ behavior: "smooth" });
  } else if (action === "channel") {
    selectChannel(index);
    document.getElementById("tv").scrollIntoView({ behavior: "smooth" });
  } else if (action === "premiere") {
    playPremiere(index);
  }
});

function aiGreet() {
  aiAddMessage("¡Hola! Soy tu asistente musical con IA 🤖 Puedo recomendarte música según tu gusto o ánimo, mostrarte lo más sonado, sugerirte estrenos de video o un canal de TV en vivo.");
  renderQuickSuggestions();
}

function renderQuickSuggestions() {
  aiSuggestions.innerHTML = [
    "Más sonadas",
    "Recomiéndame cumbia",
    "Algo para relajarme",
    "Estrenos de hoy",
    "Sugiéreme un canal",
  ].map(q => `<button class="ai-chip">${q}</button>`).join("");

  aiSuggestions.querySelectorAll(".ai-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      aiInput.value = btn.textContent;
      aiForm.dispatchEvent(new Event("submit"));
    });
  });
}

function aiGenerateReply(rawText) {
  const text = rawText.toLowerCase();

  // Saludo
  if (/^(hola|buenas|hey|hi)/.test(text)) {
    return () => aiAddMessage("¡Hola! ¿Buscas música, TV en vivo o los últimos estrenos? Cuéntame qué te provoca 🎧");
  }

  // Tendencias / más sonadas
  if (/(tendencia|sonada|popular|ranking|top)/.test(text)) {
    return () => aiRespondWithChips(
      "Esto es lo más sonado ahora mismo en PerúStream:",
      trending.slice(0, 3).map(t => songChip(t.songIndex)).join("")
    );
  }

  // Estrenos / videos
  if (/(estreno|video|nuevo|nuevos)/.test(text)) {
    return () => aiRespondWithChips(
      "Estos son los estrenos de video más recientes:",
      premieres.map((p, i) => premiereChip(i)).join("")
    );
  }

  // TV / canales
  if (/(canal|tv|television|televisión|noticias en vivo)/.test(text)) {
    const random = tvChannels
      .map((_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return () => aiRespondWithChips(
      "Te recomiendo estos canales en vivo:",
      random.map(i => channelChip(i)).join("")
    );
  }

  // Género musical
  for (const genre in genreMap) {
    if (text.includes(genre)) {
      const indexes = genreMap[genre];
      return () => aiRespondWithChips(
        `¡Buena elección! Aquí tienes música de ${genre}:`,
        indexes.map(songChip).join("")
      );
    }
  }

  // Estado de ánimo
  for (const mood in moodMap) {
    if (text.includes(mood)) {
      const indexes = moodMap[mood];
      return () => aiRespondWithChips(
        `Según tu ánimo, te sugiero escuchar esto:`,
        indexes.map(songChip).join("")
      );
    }
  }

  // Recomendación genérica
  if (/(recomien|sugier|suger|quiero escuchar|ponme|pon algo)/.test(text)) {
    const randomIndexes = songs.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
    return () => aiRespondWithChips(
      "Te dejo una selección para ti:",
      randomIndexes.map(songChip).join("")
    );
  }

  // Fallback
  return () => aiRespondWithChips(
    "No estoy segura de haber entendido, pero puedo ayudarte con esto:",
    ["Más sonadas", "Cumbia", "Relajarme", "Estrenos", "Canal"].map((q, i) =>
      `<button class="ai-chip" data-quick="${q}">${q}</button>`
    ).join("")
  );
}

aiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = aiInput.value.trim();
  if (!text) return;
  aiAddMessage(text, true);
  aiInput.value = "";

  const respond = aiGenerateReply(text);
  setTimeout(respond, 500 + Math.random() * 500);
});

// Chips de fallback rápido (delegación adicional para data-quick)
aiMessages.addEventListener("click", (e) => {
  const quick = e.target.closest("[data-quick]");
  if (!quick) return;
  aiInput.value = quick.dataset.quick;
  aiForm.dispatchEvent(new Event("submit"));
});
