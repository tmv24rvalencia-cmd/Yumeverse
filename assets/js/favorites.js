(function () {
  "use strict";

  const DATASETS = [
    { type: "anime", path: "data/anime.json", key: "works", detail: "anime/detalle.html?id=" },
    { type: "asiaticos", path: "data/asiaticos.json", key: "works", detail: "asiaticos/detalle.html?id=" },
    { type: "blog", path: "data/blog.json", key: "articles", detail: "blog/articulo.html?id=" },
    { type: "galeria", path: "data/galeria.json", key: "works", detail: "galeria/obra.html?id=" },
  ];

  function favoriteButton(type, id, label = "Guardar") {
    const active = window.YumeverseStorage?.isFavorite(type, id);
    return `
      <button class="hub-icon-button ${active ? "is-active" : ""}" type="button"
        data-favorite data-type="${Yume.escapeHtml(type)}" data-id="${Yume.escapeHtml(id)}"
        aria-pressed="${active}" aria-label="${active ? "Quitar de favoritos" : label}">
        <span aria-hidden="true">${active ? "♥" : "♡"}</span>
      </button>`;
  }

  async function renderFavorites() {
    const root = document.querySelector("[data-favorites-grid]");
    if (!root) return;
    Yume.setStatus(root, "loading", "Preparando tu archivo", "Reuniendo tus favoritos.");
    try {
      const datasets = await Promise.all(DATASETS.map(async (source) => ({
        ...source,
        data: await Yume.loadJSON(source.path),
      })));
      if (localStorage.getItem(window.YumeverseStorage.KEYS.favorites) === null) {
        const initial = [];
        datasets.forEach((source) => {
          (source.data[source.key] || []).forEach((item) => {
            if (item.favorite) initial.push(window.YumeverseStorage.favoriteKey(source.type, item.id));
          });
        });
        window.YumeverseStorage.write(window.YumeverseStorage.KEYS.favorites, initial);
      }
      const saved = new Set(window.YumeverseStorage.favorites());
      const items = [];
      datasets.forEach((source) => {
        (source.data[source.key] || []).forEach((item) => {
          const key = window.YumeverseStorage.favoriteKey(source.type, item.id);
          if (saved.has(key)) {
            items.push({ ...item, contentType: source.type, detail: source.detail });
          }
        });
      });

      if (!items.length) {
        Yume.setStatus(root, "empty", "Todavía no hay favoritos", "Usa el corazón de cualquier tarjeta para guardar una obra.");
        return;
      }

      root.innerHTML = items.map((item) => {
        const title = item.title || item.titulo;
        const image = Yume.normalizePath(item.image || item.portada, "");
        return `
          <article class="hub-card">
            <a class="hub-card__media" href="${item.detail}${encodeURIComponent(item.id)}">
              <img src="${Yume.escapeHtml(image)}" alt="${Yume.escapeHtml(title)}" loading="lazy" width="640" height="900">
              <span class="hub-card__type">${Yume.escapeHtml(item.contentType)}</span>
            </a>
            <div class="hub-card__body">
              <div><h2><a href="${item.detail}${encodeURIComponent(item.id)}">${Yume.escapeHtml(title)}</a></h2>
              <p>${Yume.escapeHtml(item.description || item.summary || item.excerpt || item.category || "")}</p></div>
              ${favoriteButton(item.contentType, item.id)}
            </div>
          </article>`;
      }).join("");
    } catch {
      Yume.setStatus(root, "error", "No se pudieron cargar los favoritos", "Comprueba los archivos JSON y vuelve a intentarlo.");
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-favorite]");
    if (!button || !window.YumeverseStorage) return;
    event.preventDefault();
    const active = window.YumeverseStorage.toggleFavorite(button.dataset.type, button.dataset.id);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector("span").textContent = active ? "♥" : "♡";
    Yume.toast(active ? "Guardado en favoritos" : "Eliminado de favoritos");
    if (document.querySelector("[data-favorites-grid]")) renderFavorites();
  });

  document.addEventListener("DOMContentLoaded", renderFavorites);
  window.YumeFavorites = { button: favoriteButton, render: renderFavorites };
})();
