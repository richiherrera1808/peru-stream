// ===== APIs REALES =====
// Radio: Radio Browser API (comunitaria, abierta, gratuita) - https://api.radio-browser.info
// TV: transmisiones oficiales en vivo de cada canal peruano vía YouTube (embed)
const RADIO_API = "https://de1.api.radio-browser.info";

async function radioApiGet(path) {
  try {
    const res = await fetch(RADIO_API + path);
    if (!res.ok) throw new Error("Respuesta no válida de Radio Browser");
    return await res.json();
  } catch (e) {
    console.warn("No se pudo conectar con Radio Browser API:", e);
    return null;
  }
}

function normalizeStation(s) {
  const tagsLower = (s.tags || "").toLowerCase();
  let emoji = "📻";
  if (tagsLower.includes("news") || tagsLower.includes("noticias")) emoji = "📰";
  else if (tagsLower.includes("cumbia") || tagsLower.includes("chicha")) emoji = "🎧";
  else if (tagsLower.includes("salsa") || tagsLower.includes("tropical")) emoji = "🎺";
  else if (tagsLower.includes("rock") || tagsLower.includes("pop")) emoji = "🎸";
  else if (tagsLower.includes("huayno") || tagsLower.includes("andin") || tagsLower.includes("folk")) emoji = "🏔️";
  else if (tagsLower.includes("criolla") || tagsLower.includes("vals")) emoji = "🎻";

  const artistTags = s.tags
    ? s.tags.split(",").map(t => t.trim()).filter(Boolean).slice(0, 2).join(" · ")
    : "";

  const url = s.url_resolved || s.url;
  return {
    title: (s.name || "Radio").trim(),
    artist: artistTags || "Radio en vivo · Perú",
    emoji,
    url,
    isHls: !!s.hls || /\.m3u8($|\?)/i.test(url || ""),
    plays: s.clickcount || 0,
    trend: s.clicktrend > 0 ? "up" : s.clicktrend < 0 ? "down" : "same",
  };
}

// Estaciones de respaldo si no hay conexión con la API
const DEMO_STATIONS = [
  { title: "Radio Panamericana", artist: "En vivo", emoji: "📻", url: null, plays: 128000, trend: "up" },
  { title: "Cumbia Total", artist: "Mix Perú", emoji: "🎧", url: null, plays: 104000, trend: "up" },
  { title: "Huaynos Clásicos", artist: "Andina FM", emoji: "🏔️", url: null, plays: 98000, trend: "same" },
  { title: "Salsa & Sabor", artist: "Tropical Mix", emoji: "🎺", url: null, plays: 87000, trend: "down" },
  { title: "Criolla de Colección", artist: "Perú Criollo", emoji: "🎻", url: null, plays: 76000, trend: "up" },
  { title: "Top 40 Perú", artist: "Hits FM", emoji: "🔥", url: null, plays: 65000, trend: "same" },
];

// Canales de TV peruanos: transmisión oficial en vivo vía su canal de YouTube
const tvChannels = [
  { name: "América Noticias", cat: "Señal en vivo", initial: "A", channelId: "UCPhm2I2wk4vqjENwhn3px8A" },
  { name: "Latina Noticias", cat: "Señal en vivo", initial: "L", channelId: "UCpSJ5fGhmAME9Kx2D3ZvN3Q" },
  { name: "TV Perú", cat: "Canal estatal", initial: "TVP", channelId: "UCrAb_x80PtTiN3lCkQOSFPg" },
  { name: "Panamericana TV", cat: "Señal en vivo", initial: "P", channelId: "UCBpoh0HUeCexMHidDxQJEEQ" },
  { name: "Willax TV", cat: "Señal en vivo", initial: "W", channelId: "UCvXfjv_grfmMtlY5R8kSrLA" },
  { name: "RPP TV", cat: "Noticias 24h", initial: "RPP", channelId: "UC5j8-2FT0ZMMBkmK72R4aeA" },
];

// Canales internacionales de noticias: transmisión oficial en vivo vía YouTube
const internationalChannels = [
  { name: "CNN en Español", cat: "Internacional", initial: "CNN", channelId: "UC_lEiu6917IJz03TnntWUaQ" },
  { name: "BBC News", cat: "Internacional", initial: "BBC", channelId: "UCRQBgGsCMrS_UN0W3RsFoAw" },
  { name: "France 24 Español", cat: "Internacional", initial: "F24", channelId: "UCUdOoVWuWmgo1wByzcsyKDQ" },
  { name: "DW Español", cat: "Internacional", initial: "DW", channelId: "UCT4Jg8h03dD0iN3Pb5L0PMA" },
  { name: "Al Jazeera English", cat: "Internacional", initial: "AJ", channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg" },
];

// Países disponibles para radio en vivo (Radio Browser API)
const COUNTRIES = [
  { label: "🇵🇪 Perú", value: "Peru" },
  { label: "🇨🇴 Colombia", value: "Colombia" },
  { label: "🇲🇽 México", value: "Mexico" },
  { label: "🇦🇷 Argentina", value: "Argentina" },
  { label: "🇨🇱 Chile", value: "Chile" },
  { label: "🇪🇸 España", value: "Spain" },
  { label: "🇺🇸 Estados Unidos", value: "United States" },
  { label: "🇧🇷 Brasil", value: "Brazil" },
  { label: "🇪🇨 Ecuador", value: "Ecuador" },
  { label: "🇧🇴 Bolivia", value: "Bolivia" },
];

const news = [
  { tag: "Música", title: "Festival de música andina reúne a miles en Cusco", excerpt: "El evento celebró la fusión entre ritmos tradicionales y sonidos modernos.", emoji: "🎶", date: "Hace 2 horas" },
  { tag: "TV", title: "Canales peruanos estrenan nueva programación nocturna", excerpt: "Las señales locales renuevan su parrilla con series y magazines.", emoji: "📺", date: "Hace 5 horas" },
  { tag: "Entretenimiento", title: "Artistas peruanos preparan gira nacional para fin de año", excerpt: "La gira recorrerá diez ciudades del país con entrada libre.", emoji: "🎤", date: "Hoy" },
  { tag: "Cultura", title: "Nueva plataforma digital impulsa la música independiente", excerpt: "Productores locales encuentran un espacio para difundir su trabajo.", emoji: "🎹", date: "Ayer" },
  { tag: "Deportes", title: "Selección peruana se prepara para próximos amistosos", excerpt: "El equipo nacional afina detalles de cara a la nueva fecha FIFA.", emoji: "⚽", date: "Ayer" },
  { tag: "Tecnología", title: "El streaming en vivo crece con fuerza entre usuarios peruanos", excerpt: "Cada vez más personas consumen radio y TV a través de internet.", emoji: "💻", date: "Hace 2 días" },
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

// ===== MÚSICA (radios reales del Perú) =====
const musicGrid = document.getElementById("musicGrid");
const audioPlayer = document.getElementById("audioPlayer");
const playerBar = document.getElementById("playerBar");
const playerProgress = document.getElementById("playerProgress");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressFill = document.getElementById("progressFill");
const liveIndicator = document.getElementById("liveIndicator");
const volumeSlider = document.getElementById("volumeSlider");

let stations = [];
let currentStationIndex = -1;
let isDemoPlaying = false;
let currentCountry = "Peru";

const countrySelect = document.getElementById("countrySelect");
countrySelect.innerHTML = COUNTRIES.map(c => `<option value="${c.value}">${c.label}</option>`).join("");
countrySelect.value = currentCountry;
countrySelect.addEventListener("change", () => {
  currentCountry = countrySelect.value;
  loadStations(currentCountry);
});

function formatPlays(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return String(n);
}

async function loadStations(country = currentCountry) {
  currentCountry = country;
  musicGrid.innerHTML = `<div class="music-grid-loading">Cargando radios en vivo…</div>`;
  const data = await radioApiGet(`/json/stations/bycountry/${encodeURIComponent(country)}?limit=30&order=clickcount&reverse=true&hidebroken=true`);

  let list = [];
  if (data && Array.isArray(data)) {
    list = data
      .filter(s => s.url_resolved)
      .map(normalizeStation)
      .slice(0, 12);
  }

  stations = list.length ? list : (country === "Peru" ? DEMO_STATIONS : []);
  if (!stations.length) {
    musicGrid.innerHTML = `<div class="music-grid-loading">No se encontraron radios en vivo para este país, prueba con otro.</div>`;
    trendingList.innerHTML = "";
    return;
  }
  renderMusic();
  renderTrending();
}

function renderMusic() {
  musicGrid.innerHTML = stations.map((station, i) => `
    <div class="music-card" data-index="${i}">
      <div class="music-cover">
        ${station.emoji}
        <div class="play-overlay">▶</div>
      </div>
      <div class="music-info">
        <div class="title">${station.title}</div>
        <div class="artist">${station.artist}</div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".music-card").forEach(card => {
    card.addEventListener("click", () => loadStation(Number(card.dataset.index)));
  });
}

function loadStation(i) {
  currentStationIndex = i;
  playAdHocStation(stations[i], i);
}

// Reproduce streams directos (mp3/aac) y también HLS (.m3u8) usando hls.js
let hlsInstance = null;

function playStreamUrl(url, isHls) {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  const canPlayNativeHls = audioPlayer.canPlayType("application/vnd.apple.mpegurl");

  if (isHls && !canPlayNativeHls) {
    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(audioPlayer);
      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          playerArtist.textContent = "No se pudo conectar con esta radio (HLS), prueba otra";
        }
      });
      audioPlayer.play().catch(() => {});
    } else {
      playerArtist.textContent = "Tu navegador no soporta este tipo de transmisión (HLS)";
    }
    return;
  }

  audioPlayer.src = url;
  audioPlayer.play().catch(() => {
    playerArtist.textContent = "No se pudo conectar con esta radio, prueba otra";
  });
}

function playAdHocStation(station, gridIndex = -1) {
  playerTitle.textContent = station.title;
  playerArtist.textContent = station.artist;
  playerCover.style.display = "none";
  playerBar.classList.add("visible");

  document.querySelectorAll(".music-card, .trending-item").forEach(c => c.classList.remove("playing"));
  if (gridIndex > -1) {
    const card = document.querySelector(`.music-card[data-index="${gridIndex}"]`);
    if (card) card.classList.add("playing");
    const trendItem = document.querySelector(`.trending-item[data-index="${gridIndex}"]`);
    if (trendItem) trendItem.classList.add("playing");
  }

  if (station.url) {
    playerProgress.classList.add("live");
    liveIndicator.classList.add("visible");
    isDemoPlaying = false;
    playStreamUrl(station.url, station.isHls);
  } else {
    playerProgress.classList.remove("live");
    liveIndicator.classList.remove("visible");
    if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
    audioPlayer.pause();
    audioPlayer.removeAttribute("src");
    isDemoPlaying = true;
    playBtn.textContent = "⏸";
    simulateDemoProgress();
  }
}

function simulateDemoProgress() {
  let progress = 0;
  clearInterval(window._progressInterval);
  progressFill.style.width = "0%";
  window._progressInterval = setInterval(() => {
    if (!isDemoPlaying) return;
    progress += 0.5;
    if (progress >= 100) progress = 0;
    progressFill.style.width = progress + "%";
  }, 150);
}

audioPlayer.addEventListener("playing", () => { playBtn.textContent = "⏸"; });
audioPlayer.addEventListener("pause", () => { playBtn.textContent = "▶"; });
audioPlayer.addEventListener("error", () => {
  if (currentStationIndex > -1 || audioPlayer.src) {
    playerArtist.textContent = "Señal no disponible ahora mismo, prueba otra radio";
  }
});

playBtn.addEventListener("click", () => {
  if (currentStationIndex === -1 && !audioPlayer.src) { if (stations.length) loadStation(0); return; }
  const station = stations[currentStationIndex];
  if (station && station.url) {
    if (audioPlayer.paused) audioPlayer.play(); else audioPlayer.pause();
  } else if (audioPlayer.src) {
    if (audioPlayer.paused) audioPlayer.play(); else audioPlayer.pause();
  } else {
    isDemoPlaying = !isDemoPlaying;
    playBtn.textContent = isDemoPlaying ? "⏸" : "▶";
  }
});

prevBtn.addEventListener("click", () => {
  if (currentStationIndex <= 0) return;
  loadStation(currentStationIndex - 1);
});

nextBtn.addEventListener("click", () => {
  if (currentStationIndex === -1 || currentStationIndex >= stations.length - 1) return;
  loadStation(currentStationIndex + 1);
});

volumeSlider.addEventListener("input", () => {
  audioPlayer.volume = volumeSlider.value / 100;
});

// ===== TENDENCIAS (más sonadas, según popularidad real de Radio Browser) =====
const trendingList = document.getElementById("trendingList");
const trendSymbols = { up: "▲", down: "▼", same: "▬" };

function renderTrending() {
  const top = stations.slice(0, 5);
  trendingList.innerHTML = top.map((station, i) => `
    <div class="trending-item" data-index="${i}">
      <div class="trending-rank">${i + 1}</div>
      <div class="trending-icon">${station.emoji}</div>
      <div class="trending-body">
        <div class="trending-title">${station.title}</div>
        <div class="trending-artist">${station.artist}</div>
      </div>
      <div class="trending-stats">
        <span class="trending-plays">${formatPlays(station.plays)}</span>
        <span class="trend-${station.trend}">${trendSymbols[station.trend]}</span>
      </div>
      <button class="trending-play-btn">▶</button>
    </div>
  `).join("");

  document.querySelectorAll(".trending-item").forEach(item => {
    item.addEventListener("click", () => {
      loadStation(Number(item.dataset.index));
      document.getElementById("musica").scrollIntoView({ behavior: "smooth" });
    });
  });
}

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

// ===== TV EN VIVO (transmisión oficial de cada canal vía YouTube) =====
const tvChannelList = document.getElementById("tvChannelList");
const tvScreen = document.getElementById("tvScreen");
const tvChannelName = document.getElementById("tvChannelName");
const tvInfoName = document.getElementById("tvInfoName");
const tvYoutubeLink = document.getElementById("tvYoutubeLink");
const tvTabs = document.getElementById("tvTabs");

let activeChannelList = tvChannels;

function renderChannels(list) {
  activeChannelList = list;
  tvChannelList.innerHTML = list.map((ch, i) => `
    <div class="tv-channel-item ${i === 0 ? "active" : ""}" data-index="${i}">
      <div class="tv-channel-logo">${ch.initial}</div>
      <div>
        <div class="tv-channel-name">${ch.name}</div>
        <div class="tv-channel-cat">${ch.cat}</div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".tv-channel-item").forEach(item => {
    item.addEventListener("click", () => selectChannel(Number(item.dataset.index)));
  });

  selectChannel(0);
}

function selectChannel(i) {
  const ch = activeChannelList[i];
  tvChannelName.textContent = ch.name;
  tvInfoName.textContent = ch.name;
  tvYoutubeLink.href = `https://www.youtube.com/channel/${ch.channelId}/live`;
  tvScreen.innerHTML = `<iframe src="https://www.youtube.com/embed/live_stream?channel=${ch.channelId}&autoplay=1&mute=1" title="${ch.name} en vivo" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;

  document.querySelectorAll(".tv-channel-item").forEach(c => c.classList.remove("active"));
  const item = document.querySelector(`.tv-channel-item[data-index="${i}"]`);
  if (item) item.classList.add("active");
}

tvTabs.addEventListener("click", (e) => {
  const tab = e.target.closest(".tv-tab");
  if (!tab) return;
  document.querySelectorAll(".tv-tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  renderChannels(tab.dataset.scope === "intl" ? internationalChannels : tvChannels);
});

renderChannels(tvChannels);

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

// ===== CHAT INTERACTIVO (comunidad) =====
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

// Géneros y estados de ánimo mapeados a etiquetas reales de Radio Browser
const genreTagMap = {
  cumbia: "cumbia", chicha: "chicha", salsa: "salsa", tropical: "tropical",
  huayno: "huayno", andina: "andina", andino: "andina", criolla: "criolla", vals: "vals",
  rock: "rock", pop: "pop", reggaeton: "reggaeton", bachata: "bachata",
  romantica: "romantica", cristiana: "cristiana",
};
const moodTagMap = {
  fiesta: "cumbia", bailar: "salsa",
  relajar: "criolla", tranquilo: "criolla", calma: "criolla",
  triste: "criolla", nostalgia: "criolla",
  alegre: "salsa", animo: "cumbia",
};

let aiStationCache = {};
let aiCacheCounter = 0;

async function searchStationsByTag(tag) {
  let data = await radioApiGet(`/json/stations/bytagandcountry/${encodeURIComponent(tag)}/${encodeURIComponent(currentCountry)}?limit=8&order=clickcount&reverse=true&hidebroken=true`);
  let list = Array.isArray(data) ? data : [];

  // Si no hay resultados por etiqueta exacta, buscamos por nombre de estación
  if (!list.length) {
    data = await radioApiGet(`/json/stations/search?country=${encodeURIComponent(currentCountry)}&name=${encodeURIComponent(tag)}&limit=8&order=clickcount&reverse=true&hidebroken=true`);
    list = Array.isArray(data) ? data : [];
  }

  return list.filter(s => s.url_resolved).map(normalizeStation).slice(0, 3);
}

function aiAddMessage(html, isUser = false) {
  const div = document.createElement("div");
  div.className = "ai-msg " + (isUser ? "user" : "bot");
  div.innerHTML = html;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function songChip(index) {
  const station = stations[index];
  return `<button class="ai-chip" data-action="song" data-index="${index}">▶ ${station.title}</button>`;
}
function aiStationChip(station) {
  const key = "ai" + (aiCacheCounter++);
  aiStationCache[key] = station;
  return `<button class="ai-chip" data-action="ai-station" data-key="${key}">▶ ${station.title}</button>`;
}
function channelChip(scope, index) {
  const ch = (scope === "intl" ? internationalChannels : tvChannels)[index];
  return `<button class="ai-chip" data-action="channel" data-scope="${scope}" data-index="${index}">📺 ${ch.name}</button>`;
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
  if (action === "song") {
    loadStation(Number(chip.dataset.index));
    document.getElementById("musica").scrollIntoView({ behavior: "smooth" });
  } else if (action === "ai-station") {
    const station = aiStationCache[chip.dataset.key];
    if (station) {
      currentStationIndex = -1;
      playAdHocStation(station);
      document.getElementById("musica").scrollIntoView({ behavior: "smooth" });
    }
  } else if (action === "channel") {
    const scope = chip.dataset.scope || "pe";
    document.querySelectorAll(".tv-tab").forEach(t => t.classList.toggle("active", t.dataset.scope === scope));
    renderChannels(scope === "intl" ? internationalChannels : tvChannels);
    selectChannel(Number(chip.dataset.index));
    document.getElementById("tv").scrollIntoView({ behavior: "smooth" });
  } else if (action === "premiere") {
    playPremiere(Number(chip.dataset.index));
  } else if (chip.dataset.quick) {
    aiInput.value = chip.dataset.quick;
    aiForm.dispatchEvent(new Event("submit"));
  }
});

function aiGreet() {
  aiAddMessage("¡Hola! Soy tu asistente musical con IA 🤖 Conecto en vivo con radios peruanas reales y canales de TV oficiales. Puedo recomendarte música según tu gusto o ánimo, mostrarte lo más sonado, sugerirte estrenos de video o un canal en vivo.");
  renderQuickSuggestions();
}

function renderQuickSuggestions() {
  aiSuggestions.innerHTML = [
    "Más sonadas",
    "Recomiéndame cumbia",
    "Algo para relajarme",
    "Estrenos de hoy",
    "Sugiéreme un canal",
    "Canal internacional",
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

  // Tendencias / más sonadas (datos reales de popularidad)
  if (/(tendencia|sonada|popular|ranking|top)/.test(text)) {
    return () => {
      if (!stations.length) { aiAddMessage("Aún estoy cargando las radios, dame un segundo y vuelve a preguntar 🙏"); return; }
      aiRespondWithChips(
        "Esto es lo más sonado ahora mismo en PerúStream:",
        stations.slice(0, 3).map((_, i) => songChip(i)).join("")
      );
    };
  }

  // Estrenos / videos
  if (/(estreno|video|nuevo|nuevos)/.test(text)) {
    return () => aiRespondWithChips(
      "Estos son los estrenos de video más recientes:",
      premieres.map((p, i) => premiereChip(i)).join("")
    );
  }

  // TV / canales
  if (/(internacional|mundo|extranjer)/.test(text) && /(canal|tv|television|televisión)/.test(text)) {
    const random = internationalChannels.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
    return () => aiRespondWithChips(
      "Estos canales internacionales están en vivo:",
      random.map(i => channelChip("intl", i)).join("")
    );
  }
  if (/(canal|tv|television|televisión|noticias en vivo)/.test(text)) {
    const random = tvChannels.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
    return () => aiRespondWithChips(
      "Te recomiendo estos canales en vivo:",
      random.map(i => channelChip("pe", i)).join("")
    );
  }

  // Género musical (búsqueda real en Radio Browser)
  for (const genre in genreTagMap) {
    if (text.includes(genre)) {
      const tag = genreTagMap[genre];
      return async () => {
        const results = await searchStationsByTag(tag);
        if (results.length) {
          aiRespondWithChips(`Encontré estas radios peruanas de ${genre} en vivo:`, results.map(aiStationChip).join(""));
        } else if (stations.length) {
          aiRespondWithChips(`No encontré una radio de "${genre}" en vivo ahora mismo, prueba con esto:`, stations.slice(0, 3).map((_, i) => songChip(i)).join(""));
        } else {
          aiAddMessage(`No encontré radios de "${genre}" disponibles en este momento.`);
        }
      };
    }
  }

  // Estado de ánimo (también busca en vivo)
  for (const mood in moodTagMap) {
    if (text.includes(mood)) {
      const tag = moodTagMap[mood];
      return async () => {
        const results = await searchStationsByTag(tag);
        if (results.length) {
          aiRespondWithChips(`Según tu ánimo, te sugiero escuchar esto:`, results.map(aiStationChip).join(""));
        } else if (stations.length) {
          aiRespondWithChips(`Prueba con esto mientras tanto:`, stations.slice(0, 3).map((_, i) => songChip(i)).join(""));
        }
      };
    }
  }

  // Recomendación genérica
  if (/(recomien|sugier|suger|quiero escuchar|ponme|pon algo)/.test(text)) {
    return () => {
      if (!stations.length) { aiAddMessage("Aún estoy cargando las radios, dame un segundo y vuelve a preguntar 🙏"); return; }
      const randomIndexes = stations.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
      aiRespondWithChips("Te dejo una selección para ti:", randomIndexes.map(songChip).join(""));
    };
  }

  // Fallback
  return () => aiRespondWithChips(
    "No estoy segura de haber entendido, pero puedo ayudarte con esto:",
    ["Más sonadas", "Cumbia", "Relajarme", "Estrenos", "Canal"].map(q =>
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
  setTimeout(respond, 400 + Math.random() * 400);
});

// ===== Inicio: cargar datos reales =====
loadStations();
