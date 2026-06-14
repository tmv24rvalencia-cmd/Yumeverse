/* =========================================================
   YUMEVERSE - SCRIPT.JS
   Funciona con index, favoritos, explorador anime y colección anime.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  cargarHome();
  cargarFavoritos();
  cargarExploradorAnime();
  cargarColeccionAnime();

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
  if (path.includes("/pages/")) return rutaPages;

  return rutaRaiz;
}

async function cargarJSON(ruta) {
  const respuesta = await fetch(ruta);

  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar: ${ruta}`);
  }

  return await respuesta.json();
}

function asignarTexto(id, valor) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.textContent = valor;
  }
}

function normalizar(texto) {
  return String(texto || "").toLowerCase().trim();
}

function calcularProgreso(vistos, totales) {
  if (!totales || totales === 9999) return vistos > 0 ? 50 : 0;

  return Math.min(Math.round((vistos / totales) * 100), 100);
}

function formatearEstadoColeccion(estado) {
  const estados = {
    viendo: "Viendo",
    completado: "Completado",
    pendiente: "Pendiente",
    abandonado: "Abandonado"
  };

  return estados[estado] || estado;
}

function formatearEstadoAnime(estado) {
  const estados = {
    emision: "En emisión",
    finalizado: "Finalizado",
    pausado: "Pausado",
    cancelado: "Cancelado"
  };

  return estados[estado] || estado;
}

/* =========================
   HOME - INDEX
========================= */

async function cargarHome() {
  const hayHome =
    existe("#novedades-container") ||
    existe("#recomendaciones-container") ||
    existe("#blog-container");

  if (!hayHome) return;

  try {
    const datos = await cargarJSON("data/home.json");

    pintarCardsHome(datos.novedades || [], "novedades-container");
    pintarCardsHome(datos.recomendaciones || [], "recomendaciones-container");
    pintarBlogHome(datos.blog || [], "blog-container");

    iniciarAnimaciones();
  } catch (error) {
    console.error("Error cargando home.json:", error);
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

async function cargarFavoritos() {
  const contenedor = document.getElementById("favoritos-container");

  if (!contenedor) return;

  try {
    const ruta = rutaSegunPagina("data/favoritos.json", "../data/favoritos.json", "../../data/favoritos.json");
    const datos = await cargarJSON(ruta);

    const favoritos = [
      ...(datos.anime || []),
      ...(datos.manga || []),
      ...(datos.manhua || []),
      ...(datos.manhwa || []),
      ...(datos.comics || []),
      ...(datos.personajes || []),
      ...(datos.ilustraciones || [])
    ];

    pintarFavoritos(favoritos);
    actualizarContadoresFavoritos(datos);
    iniciarFiltrosFavoritos(favoritos);
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
    (datos.anime || []).length +
    (datos.manga || []).length +
    (datos.manhua || []).length +
    (datos.manhwa || []).length +
    (datos.comics || []).length +
    (datos.personajes || []).length +
    (datos.ilustraciones || []).length;

  asignarTexto("total-favoritos", total);
  asignarTexto("total-anime", (datos.anime || []).length);
  asignarTexto("total-asiaticos",
    (datos.manga || []).length +
    (datos.manhua || []).length +
    (datos.manhwa || []).length +
    (datos.comics || []).length
  );
  asignarTexto("total-arte",
    (datos.personajes || []).length +
    (datos.ilustraciones || []).length
  );
}

function iniciarFiltrosFavoritos(items) {
  const tabs = document.querySelectorAll(".fav-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      const filtro = tab.dataset.filter;
      const filtrados = filtro === "todos"
        ? items
        : items.filter((item) => normalizar(item.tipo) === filtro);

      pintarFavoritos(filtrados);
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
    animeExplorer = await cargarJSON("../../data/anime.json");

    pintarExploradorAnime(animeExplorer);
    cargarOpcionesExplorador(animeExplorer);
    iniciarFiltrosExplorador();
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `
      <p class="empty-message">
        No se pudo cargar el catálogo de anime.
      </p>
    `;
  }
}

function pintarExploradorAnime(items) {
  const contenedor = document.getElementById("anime-explorer-container");
  const contador = document.getElementById("anime-count");

  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (contador) {
    contador.textContent = `${items.length} resultados`;
  }

  if (!items.length) {
    contenedor.innerHTML = `
      <p class="empty-message">
        No se encontraron animes.
      </p>
    `;
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

          <a href="detalle.html?id=${anime.id}" class="explorer-btn">
            Ver detalle
          </a>
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

  selectGenero.innerHTML = `<option value="">Todos los géneros</option>`;
  selectYear.innerHTML = `<option value="">Todos los años</option>`;

  [...generos].sort().forEach((genero) => {
    selectGenero.innerHTML += `<option value="${genero}">${genero}</option>`;
  });

  [...years].sort((a, b) => b - a).forEach((year) => {
    selectYear.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

function iniciarFiltrosExplorador() {
  const elementos = [
    document.getElementById("anime-search"),
    document.getElementById("filter-genero"),
    document.getElementById("filter-estado"),
    document.getElementById("filter-year"),
    document.getElementById("sort-anime")
  ];

  elementos.forEach((elemento) => {
    if (!elemento) return;

    elemento.addEventListener("input", aplicarFiltrosExplorador);
    elemento.addEventListener("change", aplicarFiltrosExplorador);
  });
}

function aplicarFiltrosExplorador() {
  const texto = normalizar(document.getElementById("anime-search")?.value);
  const generoValor = document.getElementById("filter-genero")?.value || "";
  const estadoValor = document.getElementById("filter-estado")?.value || "";
  const yearValor = document.getElementById("filter-year")?.value || "";
  const ordenValor = document.getElementById("sort-anime")?.value || "titulo";

  let resultado = [...animeExplorer];

  if (texto) {
    resultado = resultado.filter((anime) =>
      normalizar(anime.titulo).includes(texto) ||
      normalizar(anime.descripcion).includes(texto)
    );
  }

  if (generoValor) {
    resultado = resultado.filter((anime) =>
      (anime.generos || []).includes(generoValor)
    );
  }

  if (estadoValor) {
    resultado = resultado.filter((anime) => anime.estado === estadoValor);
  }

  if (yearValor) {
    resultado = resultado.filter((anime) => String(anime.year) === yearValor);
  }

  if (ordenValor === "titulo") {
    resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  if (ordenValor === "valoracion") {
    resultado.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  }

  if (ordenValor === "year") {
    resultado.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  pintarExploradorAnime(resultado);
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
    const datos = await cargarJSON("../../data/anime.json");

    coleccionAnime = datos.filter((anime) => anime.coleccion);

    pintarColeccionAnime(coleccionAnime);
    actualizarContadoresColeccion(coleccionAnime);
    iniciarFiltrosColeccion();
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `
      <p class="empty-message">
        No se pudo cargar tu colección de anime.
      </p>
    `;
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
    const coleccion = anime.coleccion || {};
    const vistos = coleccion.episodios_vistos || anime.episodios_vistos || 0;
    const totales = coleccion.episodios_totales || anime.episodios_totales || 0;
    const progreso = calcularProgreso(vistos, totales);
    const estadoColeccion = coleccion.estado || "pendiente";

    contenedor.innerHTML += `
      <article class="collection-card">
        <a href="detalle.html?id=${anime.id}">
          <img src="${anime.imagen}" alt="${anime.titulo}" loading="lazy">
        </a>

        <div class="collection-info">
          <span class="collection-status">${formatearEstadoColeccion(estadoColeccion)}</span>

          <h3>${anime.titulo}</h3>

          <p>${anime.descripcion || ""}</p>

          <p>
            Episodios: ${vistos} / ${totales === 9999 ? "?" : totales}
          </p>

          <div class="progress-bar">
            <div class="progress" style="width: ${progreso}%"></div>
          </div>

          <div class="rating">
            ⭐ ${anime.valoracion ?? "N/A"}
            ${coleccion.favorito ? " · ♡ Favorito" : ""}
          </div>
        </div>
      </article>
    `;
  });
}

function actualizarContadoresColeccion(items) {
  const vistos = items.filter((anime) => (anime.coleccion?.episodios_vistos || 0) > 0).length;
  const completados = items.filter((anime) => anime.coleccion?.estado === "completado").length;
  const viendo = items.filter((anime) => anime.coleccion?.estado === "viendo").length;
  const pendientes = items.filter((anime) => anime.coleccion?.estado === "pendiente").length;
  const abandonados = items.filter((anime) => anime.coleccion?.estado === "abandonado").length;
  const favoritos = items.filter((anime) => anime.coleccion?.favorito).length;

  asignarTexto("total-vistos", vistos);
  asignarTexto("total-completados", completados);
  asignarTexto("total-viendo", viendo);
  asignarTexto("total-pendientes", pendientes);
  asignarTexto("total-abandonados", abandonados);
  asignarTexto("total-favoritos-anime", favoritos);
}

function iniciarFiltrosColeccion() {
  const tabs = document.querySelectorAll(".collection-tab");
  const buscador = document.getElementById("buscar-coleccion");
  const ordenar = document.getElementById("ordenar-coleccion");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      filtroColeccionActual = tab.dataset.filter;
      aplicarFiltrosColeccion();
    });
  });

  if (buscador) {
    buscador.addEventListener("input", aplicarFiltrosColeccion);
  }

  if (ordenar) {
    ordenar.addEventListener("change", aplicarFiltrosColeccion);
  }
}

function aplicarFiltrosColeccion() {
  const texto = normalizar(document.getElementById("buscar-coleccion")?.value);
  const orden = document.getElementById("ordenar-coleccion")?.value || "nombre";

  let resultado = [...coleccionAnime];

  if (filtroColeccionActual !== "todos") {
    if (filtroColeccionActual === "favorito") {
      resultado = resultado.filter((anime) => anime.coleccion?.favorito);
    } else {
      resultado = resultado.filter((anime) => anime.coleccion?.estado === filtroColeccionActual);
    }
  }

  if (texto) {
    resultado = resultado.filter((anime) =>
      normalizar(anime.titulo).includes(texto) ||
      normalizar(anime.descripcion).includes(texto)
    );
  }

  if (orden === "nombre") {
    resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  if (orden === "valoracion") {
    resultado.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  }

  if (orden === "progreso") {
    resultado.sort((a, b) => {
      const progresoA = calcularProgreso(a.coleccion?.episodios_vistos || 0, a.coleccion?.episodios_totales || 0);
      const progresoB = calcularProgreso(b.coleccion?.episodios_vistos || 0, b.coleccion?.episodios_totales || 0);
      return progresoB - progresoA;
    });
  }

  pintarColeccionAnime(resultado);
}

/* =========================
   NEWSLETTER / BUSCADOR / ANIMACIONES
========================= */

function iniciarNewsletter() {
  const formularios = document.querySelectorAll(".newsletter");

  formularios.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const input = form.querySelector("input");
      const email = input.value.trim();

      if (!email) {
        mostrarMensaje("Escribe tu correo electrónico.");
        return;
      }

      mostrarMensaje("¡Gracias por suscribirte a Yumeverse!");
      input.value = "";
    });
  });
}

function iniciarBuscador() {
  const botonesBuscar = document.querySelectorAll(".search-btn");

  botonesBuscar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const busqueda = prompt("¿Qué quieres buscar en Yumeverse?");

      if (!busqueda || !busqueda.trim()) return;

      const ruta = rutaSegunPagina(
        `busqueda.html?q=${encodeURIComponent(busqueda.trim())}`,
        `busqueda.html?q=${encodeURIComponent(busqueda.trim())}`,
        `../busqueda.html?q=${encodeURIComponent(busqueda.trim())}`
      );

      window.location.href = ruta;
    });
  });
}

function iniciarAnimaciones() {
  const elementos = document.querySelectorAll(
    ".section, .anime-card, .blog-card, .quick-card, .favorite-card, .collection-card, .explorer-card"
  );

  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((elemento) => {
    elemento.classList.add("hidden");
    observer.observe(elemento);
  });
}

function mostrarMensaje(texto) {
  const mensajeAnterior = document.querySelector(".toast");

  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }

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
