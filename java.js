// =============================================
// CONFIGURACIÓN
// =============================================
const API_URL = "https://unefa2026.onrender.com/api/revista";

// =============================================
// NOTICIAS DE RESPALDO
// =============================================
const NOTICIAS_FALLBACK = [
    {
        id: 1,
        titulo: "REVOLUCIÓN CUÁNTICA: El primer chip criogénico estable para la computación del mañana",
        autor: "Lucía Méndez",
        categoria: "Tecnología",
        fecha_publicacion: "2025-02-19",
        resumen: "Científicos han logrado mantener un chip cuántico a temperaturas criogénicas estables, abriendo la puerta a la computación cuántica comercial.",
        likes: 256
    },
    {
        id: 2,
        titulo: "Observando el primer destello: Nuevos telescopios confirman teorías",
        autor: "Carlos Ruiz",
        categoria: "CIENCIA",
        fecha_publicacion: "2025-02-18",
        resumen: "El nuevo telescopio espacial ha captado el primer destello de una estrella en formación, confirmando teorías sobre el nacimiento estelar.",
        likes: 189
    },
    {
        id: 3,
        titulo: "La próxima ola de ciencia ficción: 'Crónicas de Marte'",
        autor: "Elena Vargas",
        categoria: "CINE/Series",
        fecha_publicacion: "2025-02-17",
        resumen: "La nueva serie basada en la novela de Ray Bradbury promete revolucionar el género con efectos visuales nunca antes vistos.",
        likes: 145
    },
    {
        id: 4,
        titulo: "'Cosmic Warfare' revela su expansión multijugador",
        autor: "Miguel Torres",
        categoria: "VIDEOJUEGOS",
        fecha_publicacion: "2025-02-16",
        resumen: "El exitoso juego de estrategia espacial lanza su nueva expansión con modo multijugador masivo y nuevas facciones.",
        likes: 234
    },
    {
        id: 5,
        titulo: "Baterías de Estado Sólido: ¿El futuro inmediato de los VE?",
        autor: "Ana Martínez",
        categoria: "Tecnología",
        fecha_publicacion: "2025-02-15",
        resumen: "Las nuevas baterías de estado sólido prometen duplicar la autonomía de los vehículos eléctricos con tiempos de carga récord.",
        likes: 312
    },
    {
        id: 6,
        titulo: "Estrategia de datos en la F1: El secreto detrás de los campeones",
        autor: "Roberto Díaz",
        categoria: "Tecnología",
        fecha_publicacion: "2025-02-14",
        resumen: "Los equipos de Fórmula 1 utilizan análisis de datos en tiempo real para optimizar cada milésima de segundo en pista.",
        likes: 178
    },
    {
        id: 7,
        titulo: "'Space Academy' bate récords de audiencia en su estreno",
        autor: "Sofía Herrera",
        categoria: "CINE/Series",
        fecha_publicacion: "2025-02-13",
        resumen: "La nueva serie de ciencia ficción ha superado todas las expectativas con su primer episodio, convirtiéndose en un fenómeno global.",
        likes: 201
    },
    {
        id: 8,
        titulo: "Prueba exclusiva: Gafas VR 8K que desafían la realidad",
        autor: "Jorge Castillo",
        categoria: "VIDEOJUEGOS",
        fecha_publicacion: "2025-02-12",
        resumen: "Las nuevas gafas de realidad virtual con resolución 8K ofrecen una experiencia inmersiva que supera cualquier límite visual.",
        likes: 267
    },
    {
        id: 9,
        titulo: "El futuro de la inteligencia artificial en la medicina",
        autor: "Dra. Patricia Luna",
        categoria: "CIENCIA",
        fecha_publicacion: "2025-02-11",
        resumen: "La IA está revolucionando el diagnóstico médico con una precisión que supera a los especialistas humanos en ciertas áreas.",
        likes: 198
    },
    {
        id: 10,
        titulo: "Nuevos gadgets tecnológicos para el hogar inteligente",
        autor: "Carlos Méndez",
        categoria: "Tecnología",
        fecha_publicacion: "2025-02-10",
        resumen: "Los dispositivos del hogar conectado evolucionan con inteligencia artificial capaz de anticipar las necesidades del usuario.",
        likes: 156
    }
];

// =============================================
// IMAGEN - loremflickr.com (TEMÁTICA)
// =============================================
function getImageForArticle(article) {
    // Mapeo de categorías a temas en inglés
    const temas = {
        'Tecnología': 'technology,computer',
        'CINE/Series': 'cinema,movie,film',
        'VIDEOJUEGOS': 'videogame,gaming',
        'CIENCIA': 'science,space,lab'
    };
    
    const tema = temas[article.categoria] || 'nature,landscape';
    const random = article.id || Math.floor(Math.random() * 1000);
    
    // loremflickr.com devuelve imágenes relacionadas con el tema
    return `https://loremflickr.com/300/200/${tema}?random=${random}`;
}

// =============================================
// Estado y DOM
// =============================================
let appState = {
    user: null,
    articles: [],
    currentCategory: 'Tecnología',
    usandoFallback: false
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const loginScreen = $('#loginScreen');
const app = $('#app');
const loginForm = $('#loginForm');
const loginError = $('#loginError');
const loginStatus = $('#loginStatus');
const loginBtn = $('#loginBtn');
const userBadge = $('#userBadge');
const logoutBtn = $('#logoutBtn');
const categoryList = $('#categoryList');
const sidebarCategoryList = $('#sidebarCategoryList');
const heroSection = $('#heroSection');
const newsGrid = $('#newsGrid');
const mostRead = $('#mostRead');
const totalArticles = $('#totalArticles');
const apiStatus = $('#apiStatus');
const featuredDate = $('#featuredDate');

function mostrarMensaje(mensaje, tipo) {
    if (loginStatus) {
        loginStatus.textContent = mensaje;
        loginStatus.className = 'login-status';
        if (tipo) {
            loginStatus.classList.add(tipo);
            loginStatus.style.display = 'block';
        }
    }
    if (apiStatus) {
        apiStatus.textContent = mensaje;
        apiStatus.style.color = tipo === 'error' ? '#ff6b6b' : tipo === 'success' ? '#7ad47a' : '#b0b0b0';
    }
}

// =============================================
// API y Autenticación
// =============================================
async function obtenerArticulos(nombre, cedula) {
    const url = `${API_URL}?nombre=${encodeURIComponent(nombre)}&cedula=${encodeURIComponent(cedula)}`;
    mostrarMensaje('🔄 Conectando...', 'loading');
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        if (data.success === false || !data.data || data.data.length === 0) {
            throw new Error('No hay datos disponibles');
        }
        mostrarMensaje(`✅ ${data.data.length} artículos`, 'success');
        appState.usandoFallback = false;
        return data.data;
    } catch (error) {
        console.warn('⚠️ Usando respaldo:', error.message);
        mostrarMensaje(`📰 Usando respaldo (${NOTICIAS_FALLBACK.length})`, 'loading');
        appState.usandoFallback = true;
        return NOTICIAS_FALLBACK;
    }
}

async function login(nombre, cedula) {
    loginError.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = '⏳...';
    try {
        const articulos = await obtenerArticulos(nombre, cedula);
        appState.user = { nombre: nombre.trim(), cedula: cedula.trim() };
        localStorage.setItem('revista_user', JSON.stringify(appState.user));
        appState.articles = articulos;
        totalArticles.textContent = appState.articles.length;
        mostrarMensaje('✅ Sesión iniciada', 'success');
        showApp();
        renderAll();
    } catch (error) {
        loginError.textContent = `❌ ${error.message}`;
        loginError.classList.remove('hidden');
        appState.user = null;
        appState.articles = [];
        localStorage.removeItem('revista_user');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = '🔓 Acceder';
    }
}

function logout() {
    appState.user = null;
    appState.articles = [];
    localStorage.removeItem('revista_user');
    showLogin();
    mostrarMensaje('👋 Sesión cerrada', '');
}

function checkSavedSession() {
    const saved = localStorage.getItem('revista_user');
    if (saved) {
        try {
            const user = JSON.parse(saved);
            appState.user = user;
            showApp();
            loadArticles();
            return true;
        } catch {
            localStorage.removeItem('revista_user');
        }
    }
    return false;
}

function showLogin() {
    loginScreen.classList.remove('hidden');
    app.classList.add('hidden');
}

function showApp() {
    loginScreen.classList.add('hidden');
    app.classList.remove('hidden');
    if (appState.user) {
        userBadge.textContent = `👤 ${appState.user.nombre}`;
    }
    const now = new Date();
    featuredDate.textContent = now.getFullYear();
}

async function loadArticles() {
    if (!appState.user) {
        showLogin();
        return;
    }
    mostrarMensaje('🔄 Cargando...', 'loading');
    showSkeletons();
    try {
        const articulos = await obtenerArticulos(appState.user.nombre, appState.user.cedula);
        appState.articles = articulos;
        totalArticles.textContent = appState.articles.length;
        renderAll();
        mostrarMensaje(`✅ ${appState.articles.length} artículos`, 'success');
    } catch (error) {
        mostrarMensaje(`❌ ${error.message}`, 'error');
        if (!appState.usandoFallback) {
            appState.articles = NOTICIAS_FALLBACK;
            totalArticles.textContent = appState.articles.length;
            renderAll();
            mostrarMensaje(`📰 Usando respaldo (${appState.articles.length})`, 'loading');
        }
    }
}

// =============================================
// Render
// =============================================
function renderAll() {
    if (!appState.articles || appState.articles.length === 0) {
        appState.articles = NOTICIAS_FALLBACK;
        totalArticles.textContent = appState.articles.length;
    }
    renderHero();
    renderNewsList();
    renderMostRead();
    highlightCategory(appState.currentCategory);
    highlightNavCategory(appState.currentCategory);
}

function getFilteredArticles() {
    const cat = appState.currentCategory;
    if (cat === 'MÁS...' || cat === 'General' || cat === 'Categorías') {
        return appState.articles;
    }
    const filtrados = appState.articles.filter(a => a.categoria === cat);
    return filtrados.length > 0 ? filtrados : appState.articles;
}

function renderHero() {
    const filtered = getFilteredArticles();
    if (filtered.length === 0) {
        heroSection.innerHTML = `
            <div style="padding:20px; text-align:center; color:#b0b0b0;">
                <div style="font-size:40px; margin-bottom:8px;">📰</div>
                <h3 style="color:#ffffff;">No hay artículos</h3>
                <p style="font-size:13px;">Selecciona otra categoría</p>
            </div>
        `;
        return;
    }
    const hero = filtered[0];
    const imageUrl = getImageForArticle(hero);
    heroSection.innerHTML = `
        <div class="hero-card">
            <div class="hero-image">
                <img src="${imageUrl}" alt="${escapeHtml(hero.titulo)}" loading="lazy" />
            </div>
            <div class="hero-content">
                <span class="hero-tag">${escapeHtml(hero.categoria || 'Destacado')}</span>
                <h2>${escapeHtml(hero.titulo)}</h2>
                <p>${escapeHtml(hero.resumen || 'Sin resumen.')}</p>
                <div class="hero-meta">
                    <span>📅 ${formatDate(hero.fecha_publicacion)}</span>
                    <span>❤️ ${hero.likes || 0}</span>
                    <span>✍️ ${escapeHtml(hero.autor || 'Anónimo')}</span>
                </div>
            </div>
        </div>
    `;
}

function renderNewsList() {
    const filtered = getFilteredArticles();
    const news = filtered.slice(1, 5);
    if (news.length === 0) {
        newsGrid.innerHTML = `<p style="text-align:center; padding:20px; color:#b0b0b0;">No hay más noticias</p>`;
        return;
    }
    newsGrid.innerHTML = news.map(article => {
        const imageUrl = getImageForArticle(article);
        return `
            <div class="news-item" data-id="${article.id}">
                <div class="news-item-image">
                    <img src="${imageUrl}" alt="" loading="lazy" />
                </div>
                <div class="news-item-content">
                    <span class="item-category">${escapeHtml(article.categoria || 'General')}</span>
                    <h3>${escapeHtml(article.titulo)}</h3>
                    <p>${escapeHtml(article.resumen || '')}</p>
                    <div class="item-meta">
                        <span>📅 ${formatDate(article.fecha_publicacion)}</span>
                        <span>❤️ ${article.likes || 0}</span>
                        <span>✍️ ${escapeHtml(article.autor || 'Anónimo')}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderMostRead() {
    const filtered = getFilteredArticles();
    const top = [...filtered].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);
    if (top.length === 0) {
        mostRead.innerHTML = `<p style="text-align:center; padding:20px; color:#b0b0b0;">Sin datos</p>`;
        return;
    }
    mostRead.innerHTML = top.map((a, i) => `
        <div class="most-read-item" data-id="${a.id}">
            <span class="rank ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : 'rank-3'}">${i + 1}</span>
            <div class="item-content">
                <h4>${escapeHtml(a.titulo)}</h4>
                <span class="item-likes">❤️ ${a.likes || 0} likes</span>
            </div>
        </div>
    `).join('');
}

function highlightCategory(category) {
    sidebarCategoryList.querySelectorAll('a').forEach(el => {
        el.classList.toggle('active', el.dataset.category === category);
    });
}

function highlightNavCategory(category) {
    categoryList.querySelectorAll('a').forEach(el => {
        el.classList.toggle('active', el.dataset.category === category);
    });
}

// =============================================
// Skeletons
// =============================================
function showSkeletons() {
    heroSection.innerHTML = `
        <div class="hero-card">
            <div class="skeleton" style="flex:0 0 200px; height:140px; border-radius:8px;"></div>
            <div style="flex:1; padding:6px 0;">
                <div style="width:80px;height:14px;background:#2d2d2d;border-radius:4px;margin-bottom:6px;"></div>
                <div style="width:90%;height:20px;background:#2d2d2d;border-radius:4px;margin-bottom:4px;"></div>
                <div style="width:70%;height:12px;background:#2d2d2d;border-radius:4px;margin-bottom:6px;"></div>
                <div style="width:60%;height:10px;background:#2d2d2d;border-radius:4px;"></div>
            </div>
        </div>
    `;
    newsGrid.innerHTML = `
        <div class="skeleton" style="height:60px; border-radius:6px; margin-bottom:8px;"></div>
        <div class="skeleton" style="height:60px; border-radius:6px; margin-bottom:8px;"></div>
        <div class="skeleton" style="height:60px; border-radius:6px; margin-bottom:8px;"></div>
        <div class="skeleton" style="height:60px; border-radius:6px;"></div>
    `;
    mostRead.innerHTML = `
        <div class="skeleton" style="height:36px; border-radius:4px; margin-bottom:6px;"></div>
        <div class="skeleton" style="height:36px; border-radius:4px; margin-bottom:6px;"></div>
        <div class="skeleton" style="height:36px; border-radius:4px;"></div>
    `;
}

// =============================================
// Utilidades
// =============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return 'Fecha desconocida';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch { 
        return dateStr; 
    }
}

// =============================================
// Eventos
// =============================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    const nombre = document.getElementById('nombre').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    if (!nombre || !cedula) {
        loginError.textContent = '❌ Completa todos los campos';
        loginError.classList.remove('hidden');
        return;
    }
    await login(nombre, cedula);
});

logoutBtn.addEventListener('click', logout);

categoryList.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    const cat = link.dataset.category;
    if (cat && cat !== appState.currentCategory) {
        appState.currentCategory = cat;
        renderAll();
    }
});

sidebarCategoryList.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    const cat = link.dataset.category;
    if (cat && cat !== appState.currentCategory) {
        appState.currentCategory = cat;
        renderAll();
    }
});

newsGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.news-item');
    if (item) {
        const id = item.dataset.id;
        const article = appState.articles.find(a => a.id == id);
        if (article) {
            alert(`📰 ${article.titulo}\n\n✍️ ${article.autor || 'Anónimo'}\n📅 ${formatDate(article.fecha_publicacion)}\n❤️ ${article.likes || 0} likes\n🏷️ ${article.categoria || 'General'}\n\n${article.resumen || 'Sin contenido completo.'}`);
        }
    }
});

mostRead.addEventListener('click', (e) => {
    const item = e.target.closest('.most-read-item');
    if (item) {
        const id = item.dataset.id;
        const article = appState.articles.find(a => a.id == id);
        if (article) {
            alert(`📰 ${article.titulo}\n\n✍️ ${article.autor || 'Anónimo'}\n📅 ${formatDate(article.fecha_publicacion)}\n❤️ ${article.likes || 0} likes\n🏷️ ${article.categoria || 'General'}\n\n${article.resumen || 'Sin contenido completo.'}`);
        }
    }
});

window.logout = logout;

function init() {
    mostrarMensaje('🔐 Esperando credenciales', '');
    const hasSession = checkSavedSession();
    if (!hasSession) {
        showLogin();
    }
}

init();