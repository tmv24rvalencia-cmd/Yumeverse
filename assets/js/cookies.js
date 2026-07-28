(function () {
  "use strict";

  const key = "yumeverse.cookies";

  function save(value) {
    try {
      localStorage.setItem(key, JSON.stringify({ choice: value, date: new Date().toISOString() }));
    } catch {
      // La página sigue operativa sin almacenamiento.
    }
  }

  function current() {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  }

  function banner() {
    if (current()) return;
    const element = document.createElement("aside");
    element.className = "hub-cookie-banner";
    element.setAttribute("aria-label", "Preferencias de cookies");
    element.innerHTML = `
      <div><strong>Tu experiencia, bajo tu control</strong>
      <p>Yumeverse usa almacenamiento esencial para recordar colecciones y preferencias. Las cookies opcionales permanecen desactivadas hasta que las aceptes.</p></div>
      <div><button class="button button--primary" type="button" data-cookie-choice="all">Aceptar</button>
      <button class="button button--ghost" type="button" data-cookie-choice="essential">Solo esenciales</button>
      <a href="${document.body.dataset.root || ""}cookies.html">Configurar</a></div>`;
    document.body.append(element);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie-choice]");
    if (!button) return;
    save(button.dataset.cookieChoice);
    document.querySelector(".hub-cookie-banner")?.remove();
    document.querySelectorAll("[data-cookie-current]").forEach((node) => {
      node.textContent = button.dataset.cookieChoice === "all" ? "Todas aceptadas" : "Solo esenciales";
    });
    Yume.toast("Preferencias de cookies guardadas");
  });

  document.addEventListener("DOMContentLoaded", () => {
    banner();
    document.querySelectorAll("[data-cookie-current]").forEach((node) => {
      const value = current()?.choice;
      node.textContent = value === "all" ? "Todas aceptadas" : value === "essential" ? "Solo esenciales" : "Sin configurar";
    });
  });
})();
