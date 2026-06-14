document.addEventListener("DOMContentLoaded", () => {
  iniciarNewsletter();
  iniciarBuscador();
  iniciarAnimaciones();
});

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
  const elementos = document.querySelectorAll(".section, .anime-card, .blog-card, .quick-card");

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.15
  });

  elementos.forEach((elemento) => {
    elemento.classList.add("hidden");
    observer.observe(elemento);
  });
}

function mostrarMensaje(texto) {
  const mensaje = document.createElement("div");
  mensaje.className = "toast";
  mensaje.textContent = texto;

  document.body.appendChild(mensaje);

  setTimeout(() => {
    mensaje.classList.add("visible");
  }, 100);

  setTimeout(() => {
    mensaje.classList.remove("visible");
    setTimeout(() => mensaje.remove(), 300);
  }, 3000);
}