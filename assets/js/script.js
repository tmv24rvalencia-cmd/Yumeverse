
/* =========================================================
   YUMEVERSE - SCRIPT.JS
   Páginas dinámicas desde JSON.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  cargarHome();
  cargarFavoritos();
  cargarExploradorAnime();
  cargarColeccionAnime();
  cargarAsiaticos();
  cargarBlog();
  cargarGaleria();
  cargarDetalleAnime();
  cargarDetalleAsiaticos();
  cargarBusquedaGlobal();

  iniciarNewsletter();
  iniciarBuscador();
  iniciarAnimaciones();
});

/* =========================
   HELPERS
========================= */

function existe(selector) {
  return document.querySelector(selector) !== null;
}

function rutaSegunPagina(rutaRaiz, rutaPages, rutaAnime) {
  const path = window.location.pathname;
  if (path.includes("/pages/anime/")) return rutaAnime;
  if (path.includes("/pages/asiaticos/")) return rutaAnime;
  if (path.includes("/pages/blog/")) return rutaAnime;
  if (path.includes("/pages/galeria/")) return rutaAnime;
  if (path.includes("/pages/")) return rutaPages;
  return rutaRaiz;
}

async function cargarJSON(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error(`No se pudo cargar: ${ruta}`);
  return await respuesta.json();
}

function asignarTexto(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getParam(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

function calcularProgreso(vistos, totales) {
  if (!totales || totales === 9999) return vistos > 0 ? 50 : 0;
  return Math.min(Math.round((vistos / totales) * 100), 100);
}

function formatearEstadoColeccion(estado) {
  const estados = { viendo: "Viendo", completado: "Completado", pendiente: "Pendiente", abandonado: "Abandonado", emision: "En emisión", finalizado: "Finalizado" };
  return estados[estado] || estado || "Pendiente";
}

function formatearEstadoAnime(estado) {
  const estados = { emision: "En emisión", finalizado: "Finalizado", pausado: "Pausado", cancelado: "Cancelado" };
  return estados[estado] || estado || "Sin estado";
}

/* =========================
   HOME
========================= */

async function cargarHome() {
  if (!existe("#novedades-container") && !existe("#recomendaciones-container") && !existe("#blog-container")) return;

  try {
    const datos = await cargarJSON("data/home.json");
    pintarCardsHome(datos.novedades || [], "novedades-container");
    pintarCardsHome(datos.recomendaciones || [], "recomendaciones-container");
    pintarBlogHome(datos.blog || [], "blog-container");
    iniciarAnimaciones();
  } catch (error) {
    console.error(error);
  }
}

function pintarCardsHome(items, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  contenedor.innerHTML = "";

  items.forEach((item) => {
    contenedor.innerHTML += `
      <a href="${item.url}" class="anime-card">
        <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
        <h3>${item.titulo}</h3>
        ${item.subtitulo ? `<p>${item.subtitulo}</p>` : ""}
        <span>⭐ ${item.valoracion}</span>
      </a>
    `;
  });
}

function pintarBlogHome(items, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  contenedor.innerHTML = "";

  items.forEach((item) => {
    contenedor.innerHTML += `
      <a href="${item.url}" class="blog-card">
        <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
        <div>
          <h3>${item.titulo}</h3>
          <p>${item.categoria}</p>
          <span>${item.fecha}</span>
        </div>
      </a>
    `;
  });
}

/* =========================
   FAVORITOS
========================= */

let favoritosGlobal = [];

async function cargarFavoritos() {
  const contenedor = document.getElementById("favoritos-container");
  if (!contenedor) return;

  try {
    const ruta = rutaSegunPagina("data/favoritos.json", "../data/favoritos.json", "../../data/favoritos.json");
    const datos = await cargarJSON(ruta);

    favoritosGlobal = [
      ...(datos.anime || []),
      ...(datos.manga || []),
      ...(datos.manhua || []),
      ...(datos.manhwa || []),
      ...(datos.comics || []),
      ...(datos.personajes || []),
      ...(datos.ilustraciones || [])
    ];

    pintarFavoritos(favoritosGlobal);
    actualizarContadoresFavoritos(datos);
    iniciarFiltrosFavoritos();
    iniciarAnimaciones();
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p class="empty-message">No se pudieron cargar los favoritos.</p>`;
  }
}

function pintarFavoritos(items) {
  const contenedor = document.getElementById("favoritos-container");
  const empty = document.getElementById("empty-favoritos");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  if (!items.length) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  items.forEach((item) => {
    contenedor.innerHTML += `
      <article class="favorite-card" data-tipo="${normalizar(item.tipo)}">
        <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
        <div class="favorite-card-content">
          <span class="favorite-type">${item.tipo}</span>
          <h3>${item.titulo}</h3>
          <p>${item.descripcion || ""}</p>
        </div>
      </article>
    `;
  });
}

function actualizarContadoresFavoritos(datos) {
  const total =
    (datos.anime || []).length + (datos.manga || []).length + (datos.manhua || []).length +
    (datos.manhwa || []).length + (datos.comics || []).length + (datos.personajes || []).length +
    (datos.ilustraciones || []).length;

  asignarTexto("total-favoritos", total);
  asignarTexto("total-anime", (datos.anime || []).length);
  asignarTexto("total-asiaticos", (datos.manga || []).length + (datos.manhua || []).length + (datos.manhwa || []).length + (datos.comics || []).length);
  asignarTexto("total-arte", (datos.personajes || []).length + (datos.ilustraciones || []).length);
}

function iniciarFiltrosFavoritos() {
  document.querySelectorAll(".fav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".fav-tab").forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      const filtro = tab.dataset.filter;
      const filtrados = filtro === "todos" ? favoritosGlobal : favoritosGlobal.filter((item) => normalizar(item.tipo) === filtro);
      pintarFavoritos(filtrados);
      iniciarAnimaciones();
    });
  });
}

/* =========================
   ANIME - EXPLORADOR
========================= */

let animeExplorer = [];

async function cargarExploradorAnime() {
  const contenedor = document.getElementById("anime-explorer-container");
  if (!contenedor) return;

  try {
    animeExplorer = await cargarJSON("../../data/anime-explorador.json");
    pintarExploradorAnime(animeExplorer);
    cargarOpcionesExplorador(animeExplorer);
    iniciarFiltrosExplorador();
    iniciarAnimaciones();
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p class="empty-message">No se pudo cargar ../../data/anime-explorador.json</p>`;
  }
}

function pintarExploradorAnime(items) {
  const contenedor = document.getElementById("anime-explorer-container");
  const contador = document.getElementById("anime-count");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  if (contador) contador.textContent = `${items.length} resultados`;

  if (!items.length) {
    contenedor.innerHTML = `<p class="empty-message">No se encontraron animes.</p>`;
    return;
  }

  items.forEach((anime) => {
    contenedor.innerHTML += `
      <article class="explorer-card">
        <img src="${anime.imagen}" alt="${anime.titulo}" loading="lazy">
        <div class="explorer-card-content">
          <h3>${anime.titulo}</h3>
          <p>${(anime.generos || []).join(" · ")}</p>
          <p>${formatearEstadoAnime(anime.estado)} · ${anime.year || "Sin año"}</p>
          <div class="explorer-meta">
            <span>⭐ ${anime.valoracion ?? "N/A"}</span>
            <span>${anime.tipo || "Anime"}</span>
          </div>
          <a href="detalle.html?id=${anime.id}" class="explorer-btn">Ver detalle</a>
        </div>
      </article>
    `;
  });
}

function cargarOpcionesExplorador(items) {
  const selectGenero = document.getElementById("filter-genero");
  const selectYear = document.getElementById("filter-year");
  if (!selectGenero || !selectYear) return;

  const generos = new Set();
  const years = new Set();

  items.forEach((anime) => {
    (anime.generos || []).forEach((genero) => generos.add(genero));
    if (anime.year) years.add(anime.year);
  });

  selectGenero.innerHTML = `<option value="">Género: todos</option>`;
  selectYear.innerHTML = `<option value="">Año: todos</option>`;

  [...generos].sort().forEach((genero) => selectGenero.innerHTML += `<option value="${genero}">${genero}</option>`);
  [...years].sort((a, b) => b - a).forEach((year) => selectYear.innerHTML += `<option value="${year}">${year}</option>`);
}

function iniciarFiltrosExplorador() {
  ["anime-search", "filter-genero", "filter-estado", "filter-year", "sort-anime"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", aplicarFiltrosExplorador);
    el.addEventListener("change", aplicarFiltrosExplorador);
  });
}

function aplicarFiltrosExplorador() {
  const texto = normalizar(document.getElementById("anime-search")?.value);
  const generoValor = document.getElementById("filter-genero")?.value || "";
  const estadoValor = document.getElementById("filter-estado")?.value || "";
  const yearValor = document.getElementById("filter-year")?.value || "";
  const ordenValor = document.getElementById("sort-anime")?.value || "titulo";

  let resultado = [...animeExplorer];

  if (texto) resultado = resultado.filter((a) => normalizar(a.titulo).includes(texto) || normalizar(a.descripcion).includes(texto) || (a.generos || []).some(g => normalizar(g).includes(texto)));
  if (generoValor) resultado = resultado.filter((a) => (a.generos || []).includes(generoValor));
  if (estadoValor) resultado = resultado.filter((a) => a.estado === estadoValor);
  if (yearValor) resultado = resultado.filter((a) => String(a.year) === yearValor);

  if (ordenValor === "titulo") resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  if (ordenValor === "valoracion") resultado.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  if (ordenValor === "year") resultado.sort((a, b) => (b.year || 0) - (a.year || 0));

  pintarExploradorAnime(resultado);
  iniciarAnimaciones();
}

/* =========================
   ANIME - MI COLECCIÓN
========================= */

let coleccionAnime = [];
let filtroColeccionActual = "todos";

async function cargarColeccionAnime() {
  const contenedor = document.getElementById("coleccion-anime-container");
  if (!contenedor) return;

  try {
    coleccionAnime = await cargarJSON("../../data/anime-mi-coleccion.json");
    pintarColeccionAnime(coleccionAnime);
    actualizarContadoresColeccion(coleccionAnime);
    iniciarFiltrosColeccion();
    iniciarAnimaciones();
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p class="empty-message">No se pudo cargar ../../data/anime-mi-coleccion.json</p>`;
  }
}

function pintarColeccionAnime(items) {
  const contenedor = document.getElementById("coleccion-anime-container");
  const empty = document.getElementById("empty-coleccion");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (!items.length) {
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;

  items.forEach((anime) => {
    const vistos = anime.episodios_vistos || anime.coleccion?.episodios_vistos || 0;
    const totales = anime.episodios_totales || anime.coleccion?.episodios_totales || 0;
    const estado = anime.coleccion?.estado || anime.estado || "pendiente";
    const fav = anime.favorito || anime.coleccion?.favorito;
    const progreso = calcularProgreso(vistos, totales);

    contenedor.innerHTML += `
      <article class="explorer-card collection-card">
        <img src="${anime.imagen}" alt="${anime.titulo}" loading="lazy">
        <div class="explorer-card-content collection-info">
          <span class="collection-status">${formatearEstadoColeccion(estado)}</span>
          <h3>${anime.titulo}</h3>
          <p>${(anime.generos || []).join(" · ")}</p>
          <p>Episodio ${vistos}/${totales === 9999 ? "?" : totales}</p>
          <div class="progress-bar"><div class="progress" style="width:${progreso}%"></div></div>
          <div class="explorer-meta"><span>⭐ ${anime.valoracion ?? "N/A"}</span><span>${fav ? "♡ Favorito" : "Anime"}</span></div>
          <a href="detalle.html?id=${anime.id}" class="explorer-btn">Ver detalle</a>
        </div>
      </article>
    `;
  });
}

function actualizarContadoresColeccion(items) {
  const getEstado = (a) => a.coleccion?.estado || a.estado;
  const getVistos = (a) => a.coleccion?.episodios_vistos ?? a.episodios_vistos ?? 0;
  const getFav = (a) => a.coleccion?.favorito || a.favorito;

  asignarTexto("total-vistos", items.filter((a) => getVistos(a) > 0).length);
  asignarTexto("total-completados", items.filter((a) => getEstado(a) === "completado").length);
  asignarTexto("total-viendo", items.filter((a) => getEstado(a) === "viendo" || getEstado(a) === "emision").length);
  asignarTexto("total-pendientes", items.filter((a) => getEstado(a) === "pendiente").length);
  asignarTexto("total-abandonados", items.filter((a) => getEstado(a) === "abandonado").length);
  asignarTexto("total-favoritos-anime", items.filter((a) => getFav(a)).length);
}

function iniciarFiltrosColeccion() {
  document.querySelectorAll(".collection-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".collection-tab").forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      filtroColeccionActual = tab.dataset.filter;
      aplicarFiltrosColeccion();
    });
  });

  document.getElementById("buscar-coleccion")?.addEventListener("input", aplicarFiltrosColeccion);
  document.getElementById("ordenar-coleccion")?.addEventListener("change", aplicarFiltrosColeccion);
}

function aplicarFiltrosColeccion() {
  const texto = normalizar(document.getElementById("buscar-coleccion")?.value);
  const orden = document.getElementById("ordenar-coleccion")?.value || "nombre";
  let resultado = [...coleccionAnime];

  if (filtroColeccionActual !== "todos") {
    if (filtroColeccionActual === "favorito") resultado = resultado.filter((a) => a.favorito || a.coleccion?.favorito);
    else resultado = resultado.filter((a) => (a.coleccion?.estado || a.estado) === filtroColeccionActual);
  }

  if (texto) resultado = resultado.filter((a) => normalizar(a.titulo).includes(texto) || normalizar(a.descripcion).includes(texto));
  if (orden === "nombre") resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  if (orden === "valoracion") resultado.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  if (orden === "progreso") resultado.sort((a, b) => calcularProgreso((b.episodios_vistos || b.coleccion?.episodios_vistos || 0), (b.episodios_totales || b.coleccion?.episodios_totales || 0)) - calcularProgreso((a.episodios_vistos || a.coleccion?.episodios_vistos || 0), (a.episodios_totales || a.coleccion?.episodios_totales || 0)));

  pintarColeccionAnime(resultado);
  iniciarAnimaciones();
}

/* =========================
   ASIÁTICOS
========================= */

let asiaticosData = [];

async function cargarAsiaticos() {
  const contenedor = document.getElementById("asiaticos-container");
  if (!contenedor) return;

  try {
    const datos = await cargarJSON("../../data/asiaticos.json");
    asiaticosData = datos.catalogo || [];
    cargarOpcionesAsiaticos();
    aplicarFiltrosAsiaticos();
    iniciarFiltrosAsiaticos();
  } catch (e) {
    console.error(e);
    contenedor.innerHTML = `<p class="empty-message">No se pudo cargar asiaticos.json.</p>`;
  }
}

function cargarOpcionesAsiaticos() {
  const page = document.querySelector("[data-asiaticos]")?.dataset.asiaticos || "todos";
  const tipo = document.getElementById("asiaticos-filter-tipo");
  if (tipo && page !== "todos" && page !== "coleccion") tipo.value = page === "occidentales" ? "Cómic" : page.charAt(0).toUpperCase() + page.slice(1);
}

function iniciarFiltrosAsiaticos() {
  ["asiaticos-search", "asiaticos-filter-tipo", "asiaticos-filter-estado", "asiaticos-sort"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", aplicarFiltrosAsiaticos);
    el.addEventListener("change", aplicarFiltrosAsiaticos);
  });
}

function aplicarFiltrosAsiaticos() {
  const contenedor = document.getElementById("asiaticos-container");
  const contador = document.getElementById("asiaticos-count");
  if (!contenedor) return;

  const page = document.querySelector("[data-asiaticos]")?.dataset.asiaticos || "todos";
  const texto = normalizar(document.getElementById("asiaticos-search")?.value);
  const tipo = document.getElementById("asiaticos-filter-tipo")?.value || "";
  const estado = document.getElementById("asiaticos-filter-estado")?.value || "";
  const sort = document.getElementById("asiaticos-sort")?.value || "titulo";

  let items = [...asiaticosData];

  if (page !== "todos" && page !== "coleccion") items = items.filter(i => i.categoria === page || (page === "occidentales" && i.categoria === "occidentales"));
  if (tipo) items = items.filter(i => i.tipo === tipo || (tipo === "Cómic" && i.tipo === "Cómic"));
  if (estado) items = items.filter(i => i.estado === estado);
  if (texto) items = items.filter(i => normalizar(i.titulo).includes(texto) || normalizar(i.descripcion).includes(texto));
  if (sort === "titulo") items.sort((a,b)=>a.titulo.localeCompare(b.titulo));
  if (sort === "valoracion") items.sort((a,b)=>(b.valoracion||0)-(a.valoracion||0));

  if (contador) contador.textContent = `${items.length} resultados`;
  contenedor.innerHTML = items.map(item => `
    <article class="explorer-card">
      <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
      <div class="explorer-card-content">
        <h3>${item.titulo}</h3>
        <p>${item.tipo} · ${item.capitulo}</p>
        <p>${item.estado}</p>
        <div class="explorer-meta"><span>⭐ ${item.valoracion}</span><span>${item.tipo}</span></div>
        <a href="detalle.html?id=${item.id}" class="explorer-btn">Ver detalle</a>
      </div>
    </article>`).join("");
  iniciarAnimaciones();
}

/* =========================
   BLOG
========================= */

async function cargarBlog() {
  const contenedor = document.getElementById("blog-list");
  if (!contenedor) return;

  try {
    const items = await cargarJSON("../../data/blog.json");
    const tipo = document.querySelector("[data-blog]")?.dataset.blog || "todos";
    const filtrados = tipo === "todos" ? items : items.filter(i => i.categoria === tipo);
    asignarTexto("blog-count", `${filtrados.length} artículos`);
    contenedor.innerHTML = filtrados.map(post => `
      <article class="blog-post-card">
        <img src="${post.imagen}" alt="${post.titulo}" loading="lazy">
        <div class="blog-post-content">
          <span class="post-tag">${post.tag}</span>
          <h3>${post.titulo}</h3>
          <p>${post.descripcion}</p>
          <div class="explorer-meta"><span>${post.fecha}</span><span>💬 ${post.comentarios}</span></div>
        </div>
      </article>
    `).join("");
    iniciarAnimaciones();
  } catch (e) {
    console.error(e);
    contenedor.innerHTML = `<p class="empty-message">No se pudo cargar blog.json.</p>`;
  }
}

/* =========================
   GALERÍA
========================= */

let galeriaData = [];

async function cargarGaleria() {
  const contenedor = document.getElementById("galeria-container");
  if (!contenedor) return;

  try {
    galeriaData = await cargarJSON("../../data/galeria.json");
    cargarTiposGaleria();
    aplicarFiltrosGaleria();
    iniciarFiltrosGaleria();
  } catch (e) {
    console.error(e);
    contenedor.innerHTML = `<p class="empty-message">No se pudo cargar galeria.json.</p>`;
  }
}

function cargarTiposGaleria() {
  const select = document.getElementById("galeria-filter-tipo");
  if (!select) return;
  const tipos = [...new Set(galeriaData.map(i => i.tipo))].sort();
  select.innerHTML = `<option value="">Todos los tipos</option>` + tipos.map(t => `<option value="${t}">${t}</option>`).join("");
}

function iniciarFiltrosGaleria() {
  ["galeria-search", "galeria-filter-tipo", "galeria-sort"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", aplicarFiltrosGaleria);
    el.addEventListener("change", aplicarFiltrosGaleria);
  });
}

function aplicarFiltrosGaleria() {
  const contenedor = document.getElementById("galeria-container");
  const contador = document.getElementById("galeria-count");
  if (!contenedor) return;

  const page = document.querySelector("[data-galeria]")?.dataset.galeria || "todos";
  const texto = normalizar(document.getElementById("galeria-search")?.value);
  const tipo = document.getElementById("galeria-filter-tipo")?.value || "";
  const sort = document.getElementById("galeria-sort")?.value || "titulo";

  let items = [...galeriaData];
  if (page !== "todos") items = items.filter(i => i.categoria === page);
  if (tipo) items = items.filter(i => i.tipo === tipo);
  if (texto) items = items.filter(i => normalizar(i.titulo).includes(texto) || normalizar(i.tipo).includes(texto));
  if (sort === "titulo") items.sort((a,b)=>a.titulo.localeCompare(b.titulo));
  if (sort === "favoritos") items.sort((a,b)=>(b.favorito?1:0)-(a.favorito?1:0));

  if (contador) contador.textContent = `${items.length} imágenes`;
  contenedor.innerHTML = items.map(item => `
    <article class="gallery-item">
      <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
      <div class="gallery-item-info"><h3>${item.titulo}</h3><p>${item.tipo} ${item.favorito ? "· ♡" : ""}</p></div>
    </article>
  `).join("");
  iniciarAnimaciones();
}

/* =========================
   DETALLES
========================= */

async function cargarDetalleAnime() {
  const contenedor = document.getElementById("anime-detail");
  if (!contenedor) return;
  try {
    const id = getParam("id");
    const items = await cargarJSON("../../data/anime-explorador.json");
    const anime = items.find(i => i.id === id) || items[0];
    contenedor.innerHTML = pintarDetalle(anime, "Anime");
  } catch(e) {
    contenedor.innerHTML = `<p class="empty-message">No se pudo cargar el detalle.</p>`;
  }
}

async function cargarDetalleAsiaticos() {
  const contenedor = document.getElementById("asiaticos-detail");
  if (!contenedor) return;
  try {
    const id = getParam("id");
    const datos = await cargarJSON("../../data/asiaticos.json");
    const item = (datos.catalogo || []).find(i => i.id === id) || (datos.catalogo || [])[0];
    contenedor.innerHTML = pintarDetalle(item, item.tipo || "Lectura");
  } catch(e) {
    contenedor.innerHTML = `<p class="empty-message">No se pudo cargar el detalle.</p>`;
  }
}

function pintarDetalle(item, tipo) {
  if (!item) return `<p class="empty-message">No hay datos para mostrar.</p>`;
  return `
    <img src="${item.imagen}" alt="${item.titulo}">
    <div class="detail-content">
      <span class="section-label">${tipo}</span>
      <h1>${item.titulo}</h1>
      <p>${item.descripcion || "Sin descripción disponible."}</p>
      <div class="detail-tags">
        <span>⭐ ${item.valoracion ?? "N/A"}</span>
        <span>${item.estado || "Sin estado"}</span>
        <span>${item.year || item.capitulo || ""}</span>
        ${(item.generos || []).map(g => `<span>${g}</span>`).join("")}
      </div>
      <div class="hero-buttons">
        <a href="../favoritos.html" class="btn btn-primary">Añadir a favoritos</a>
        <a href="mi-coleccion.html" class="btn btn-dark">Mi colección</a>
      </div>
    </div>
  `;
}

/* =========================
   BÚSQUEDA GLOBAL
========================= */

async function cargarBusquedaGlobal() {
  const contenedor = document.getElementById("search-results");
  if (!contenedor) return;
  try {
    const q = normalizar(getParam("q") || "");
    const input = document.getElementById("global-search");
    if (input) input.value = q;
    const [animes, asiaticos, blog] = await Promise.all([
      cargarJSON("data/anime-explorador.json").catch(()=>[]),
      cargarJSON("data/asiaticos.json").catch(()=>({catalogo:[]})),
      cargarJSON("data/blog.json").catch(()=>[])
    ]);
    const all = [
      ...animes.map(i=>({...i, origen:"Anime", url:`pages/anime/detalle.html?id=${i.id}`})),
      ...(asiaticos.catalogo || []).map(i=>({...i, origen:i.tipo, url:`pages/asiaticos/detalle.html?id=${i.id}`})),
      ...blog.map(i=>({...i, origen:"Blog", url:`pages/blog/index.html`}))
    ];
    const render = () => {
      const texto = normalizar(input?.value || q);
      const items = texto ? all.filter(i => normalizar(i.titulo).includes(texto) || normalizar(i.descripcion).includes(texto)) : all;
      asignarTexto("search-count", `${items.length} resultados`);
      contenedor.innerHTML = items.map(i => `
        <article class="explorer-card">
          <img src="${i.imagen}" alt="${i.titulo}">
          <div class="explorer-card-content">
            <h3>${i.titulo}</h3>
            <p>${i.descripcion || ""}</p>
            <div class="explorer-meta"><span>${i.origen}</span><span>⭐ ${i.valoracion || ""}</span></div>
            <a href="${i.url}" class="explorer-btn">Abrir</a>
          </div>
        </article>`).join("");
      iniciarAnimaciones();
    };
    input?.addEventListener("input", render);
    render();
  } catch(e) { console.error(e); }
}

/* =========================
   NEWSLETTER / BUSCADOR / ANIMACIONES
========================= */

function iniciarNewsletter() {
  document.querySelectorAll(".newsletter").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const email = input.value.trim();
      if (!email) return mostrarMensaje("Escribe tu correo electrónico.");
      mostrarMensaje("¡Gracias por suscribirte a Yumeverse!");
      input.value = "";
    });
  });
}

function iniciarBuscador() {
  document.querySelectorAll(".search-btn").forEach((boton) => {
    boton.addEventListener("click", () => {
      const busqueda = prompt("¿Qué quieres buscar en Yumeverse?");
      if (!busqueda || !busqueda.trim()) return;
      const q = encodeURIComponent(busqueda.trim());
      const ruta = rutaSegunPagina(`busqueda.html?q=${q}`, `../busqueda.html?q=${q}`, `../../busqueda.html?q=${q}`);
      window.location.href = ruta;
    });
  });
}

let observerGlobal = null;
function iniciarAnimaciones() {
  const elementos = document.querySelectorAll(".section, .anime-card, .blog-card, .quick-card, .favorite-card, .collection-card, .explorer-card, .blog-post-card, .gallery-item");
  if (!elementos.length) return;

  if (!observerGlobal) {
    observerGlobal = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) entrada.target.classList.add("show");
      });
    }, { threshold: 0.12 });
  }

  elementos.forEach((el) => {
    if (!el.classList.contains("show")) {
      el.classList.add("hidden");
      observerGlobal.observe(el);
    }
  });
}

function mostrarMensaje(texto) {
  document.querySelector(".toast")?.remove();
  const mensaje = document.createElement("div");
  mensaje.className = "toast";
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.classList.add("visible"), 100);
  setTimeout(() => {
    mensaje.classList.remove("visible");
    setTimeout(() => mensaje.remove(), 300);
  }, 3000);
}
