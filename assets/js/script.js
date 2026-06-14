document.addEventListener("DOMContentLoaded", () => {
  cargarHome();
  iniciarNewsletter();
  iniciarBuscador();
  iniciarAnimaciones();
});

async function cargarHome() {
  try {
    const respuesta = await fetch("data/home.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar data/home.json");
    }

    const datos = await respuesta.json();

    pintarCards(datos.novedades, "novedades-container");
    pintarCards(datos.recomendaciones, "recomendaciones-container");
    pintarBlog(datos.blog, "blog-container");

    iniciarAnimaciones();
  } catch (error) {
    console.error("Error cargando home.json:", error);
  }
}

function pintarCards(items, contenedorId) {
  const contenedor = document.getElementById(contenedorId);

  if (!contenedor || !items) return;

  contenedor.innerHTML = "";

  items.forEach((item) => {
    contenedor.innerHTML += `
      <a href="${item.url}" class="anime-card">
        <img src="${item.imagen}" alt="${item.titulo}">
        <h3>${item.titulo}</h3>
        ${item.subtitulo ? `<p>${item.subtitulo}</p>` : ""}
        <span>⭐ ${item.valoracion}</span>
      </a>
    `;
  });
}

function pintarBlog(items, contenedorId) {
  const contenedor = document.getElementById(contenedorId);

  if (!contenedor || !items) return;

  contenedor.innerHTML = "";

  items.forEach((item) => {
    contenedor.innerHTML += `
      <a href="${item.url}" class="blog-card">
        <img src="${item.imagen}" alt="${item.titulo}">
        <div>
          <h3>${item.titulo}</h3>
          <p>${item.categoria}</p>
          <span>${item.fecha}</span>
        </div>
      </a>
    `;
  });
}

function iniciarNewsletter() {
  const form = document.querySelector(".newsletter");

  if (!form) return;

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
}

function iniciarBuscador() {
  const botonBuscar = document.querySelector(".search-btn");

  if (!botonBuscar) return;

  botonBuscar.addEventListener("click", () => {
    const busqueda = prompt("¿Qué quieres buscar en Yumeverse?");

    if (busqueda && busqueda.trim() !== "") {
      window.location.href = `busqueda.html?q=${encodeURIComponent(busqueda.trim())}`;
    }
  });
}

function iniciarAnimaciones() {
  const elementos = document.querySelectorAll(
    ".section, .anime-card, .blog-card, .quick-card"
  );

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.15,
    }
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

  setTimeout(() => {
    mensaje.classList.add("visible");
  }, 100);

  setTimeout(() => {
    mensaje.classList.remove("visible");

    setTimeout(() => {
      mensaje.remove();
    }, 300);
  }, 3000);
}
async function cargarFavoritos() {
  const contenedor = document.getElementById("favoritos-container");

  if (!contenedor) return;

  try {
    const respuesta = await fetch("../data/favoritos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar favoritos.json");
    }

    const datos = await respuesta.json();

    const favoritos = [
      ...datos.anime,
      ...datos.manga,
      ...datos.manhua,
      ...datos.manhwa,
      ...datos.comics,
      ...datos.personajes,
      ...datos.ilustraciones
    ];

    pintarFavoritos(favoritos);
    actualizarContadores(datos);

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p class="empty-message">No se pudieron cargar los favoritos.</p>`;
  }
}

function pintarFavoritos(items) {
  const contenedor = document.getElementById("favoritos-container");
  const empty = document.getElementById("empty-favoritos");

  contenedor.innerHTML = "";

  if (!items.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  items.forEach(item => {
    contenedor.innerHTML += `
      <article class="favorite-card" data-tipo="${item.tipo}">
        <img src="${item.imagen}" alt="${item.titulo}">
        <div class="favorite-card-content">
          <span class="favorite-type">${item.tipo}</span>
          <h3>${item.titulo}</h3>
          <p>${item.descripcion || ""}</p>
        </div>
      </article>
    `;
  });
}

function actualizarContadores(datos) {
  const total =
    datos.anime.length +
    datos.manga.length +
    datos.manhua.length +
    datos.manhwa.length +
    datos.comics.length +
    datos.personajes.length +
    datos.ilustraciones.length;

  document.getElementById("total-favoritos").textContent = total;
  document.getElementById("total-anime").textContent = datos.anime.length;

  document.getElementById("total-asiaticos").textContent =
    datos.manga.length + datos.manhua.length + datos.manhwa.length + datos.comics.length;

  document.getElementById("total-arte").textContent =
    datos.personajes.length + datos.ilustraciones.length;
}
let coleccionAnime = [];

async function cargarColeccionAnime() {
  const contenedor = document.getElementById("coleccion-anime-container");

  if (!contenedor) return;

  try {
    const respuesta = await fetch("../../data/anime-mi-coleccion.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar anime-mi-coleccion.json");
    }

    coleccionAnime = await respuesta.json();

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
    const progreso = calcularProgreso(
      anime.episodios_vistos,
      anime.episodios_totales
    );

    contenedor.innerHTML += `
      <article class="collection-card">
        <a href="detalle.html?id=${anime.id}">
          <img src="${anime.imagen}" alt="${anime.titulo}">
        </a>

        <div class="collection-info">
          <span class="collection-status">${formatearEstado(anime.estado)}</span>

          <h3>${anime.titulo}</h3>

          <p>${anime.descripcion}</p>

          <p>
            Episodios: ${anime.episodios_vistos} / 
            ${anime.episodios_totales === 9999 ? "?" : anime.episodios_totales}
          </p>

          <div class="progress-bar">
            <div class="progress" style="width: ${progreso}%"></div>
          </div>

          <div class="rating">
            ⭐ ${anime.valoracion}
            ${anime.favorito ? " · ♡ Favorito" : ""}
          </div>
        </div>
      </article>
    `;
  });
}

function actualizarContadoresColeccion(items) {
  const vistos = items.filter(item => item.episodios_vistos > 0).length;
  const completados = items.filter(item => item.estado === "completado").length;
  const viendo = items.filter(item => item.estado === "viendo").length;
  const pendientes = items.filter(item => item.estado === "pendiente").length;
  const abandonados = items.filter(item => item.estado === "abandonado").length;
  const favoritos = items.filter(item => item.favorito).length;

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

  let filtroActual = "todos";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      filtroActual = tab.dataset.filter;
      aplicarFiltrosColeccion(filtroActual);
    });
  });

  if (buscador) {
    buscador.addEventListener("input", () => {
      aplicarFiltrosColeccion(filtroActual);
    });
  }

  if (ordenar) {
    ordenar.addEventListener("change", () => {
      aplicarFiltrosColeccion(filtroActual);
    });
  }
}

function aplicarFiltrosColeccion(filtro) {
  const buscador = document.getElementById("buscar-coleccion");
  const ordenar = document.getElementById("ordenar-coleccion");

  const texto = buscador ? buscador.value.toLowerCase().trim() : "";
  const orden = ordenar ? ordenar.value : "nombre";

  let resultado = [...coleccionAnime];

  if (filtro !== "todos") {
    if (filtro === "favorito") {
      resultado = resultado.filter(item => item.favorito);
    } else {
      resultado = resultado.filter(item => item.estado === filtro);
    }
  }

  if (texto) {
    resultado = resultado.filter(item =>
      item.titulo.toLowerCase().includes(texto) ||
      item.descripcion.toLowerCase().includes(texto)
    );
  }

  if (orden === "nombre") {
    resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  if (orden === "valoracion") {
    resultado.sort((a, b) => b.valoracion - a.valoracion);
  }

  if (orden === "progreso") {
    resultado.sort((a, b) => {
      const progresoA = calcularProgreso(a.episodios_vistos, a.episodios_totales);
      const progresoB = calcularProgreso(b.episodios_vistos, b.episodios_totales);
      return progresoB - progresoA;
    });
  }

  pintarColeccionAnime(resultado);
}

function calcularProgreso(vistos, totales) {
  if (!totales || totales === 9999) return 50;

  const progreso = (vistos / totales) * 100;

  return Math.min(Math.round(progreso), 100);
}

function formatearEstado(estado) {
  const estados = {
    viendo: "Viendo",
    completado: "Completado",
    pendiente: "Pendiente",
    abandonado: "Abandonado"
  };

  return estados[estado] || estado;
}

function asignarTexto(id, valor) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.textContent = valor;
  }
}
let animeExplorer = [];

async function cargarExploradorAnime() {
  const contenedor = document.getElementById("anime-explorer-container");

  if (!contenedor) return;

  try {
    const respuesta = await fetch("../../data/anime.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar anime.json");
    }

    animeExplorer = await respuesta.json();

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
        <img src="${anime.imagen}" alt="${anime.titulo}">

        <div class="explorer-card-content">
          <h3>${anime.titulo}</h3>
          <p>${anime.generos.join(" · ")}</p>
          <p>${formatearEstadoAnime(anime.estado)} · ${anime.year}</p>

          <div class="explorer-meta">
            <span>⭐ ${anime.valoracion}</span>
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
    anime.generos.forEach((genero) => generos.add(genero));
    years.add(anime.year);
  });

  [...generos].sort().forEach((genero) => {
    selectGenero.innerHTML += `
      <option value="${genero}">${genero}</option>
    `;
  });

  [...years].sort((a, b) => b - a).forEach((year) => {
    selectYear.innerHTML += `
      <option value="${year}">${year}</option>
    `;
  });
}

function iniciarFiltrosExplorador() {
  const buscador = document.getElementById("anime-search");
  const genero = document.getElementById("filter-genero");
  const estado = document.getElementById("filter-estado");
  const year = document.getElementById("filter-year");
  const ordenar = document.getElementById("sort-anime");

  [buscador, genero, estado, year, ordenar].forEach((elemento) => {
    if (!elemento) return;

    elemento.addEventListener("input", aplicarFiltrosExplorador);
    elemento.addEventListener("change", aplicarFiltrosExplorador);
  });
}

function aplicarFiltrosExplorador() {
  const buscador = document.getElementById("anime-search");
  const genero = document.getElementById("filter-genero");
  const estado = document.getElementById("filter-estado");
  const year = document.getElementById("filter-year");
  const ordenar = document.getElementById("sort-anime");

  const texto = buscador ? buscador.value.toLowerCase().trim() : "";
  const generoValor = genero ? genero.value : "";
  const estadoValor = estado ? estado.value : "";
  const yearValor = year ? year.value : "";
  const ordenValor = ordenar ? ordenar.value : "titulo";

  let resultado = [...animeExplorer];

  if (texto) {
    resultado = resultado.filter((anime) =>
      anime.titulo.toLowerCase().includes(texto)
    );
  }

  if (generoValor) {
    resultado = resultado.filter((anime) =>
      anime.generos.includes(generoValor)
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
    resultado.sort((a, b) => b.valoracion - a.valoracion);
  }

  if (ordenValor === "year") {
    resultado.sort((a, b) => b.year - a.year);
  }

  pintarExploradorAnime(resultado);
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