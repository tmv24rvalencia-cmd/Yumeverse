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