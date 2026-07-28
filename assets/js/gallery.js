(function () {
  "use strict";

  const root = document.body.dataset.root || "../";
  let data;

  function workCard(work) {
    return `
      <article class="hub-art ${work.orientation === "wide" ? "hub-art--wide" : ""}">
        <a class="hub-art__media" href="obra.html?id=${encodeURIComponent(work.id)}">
          <img src="${Yume.escapeHtml(work.image)}" alt="${Yume.escapeHtml(work.title)}" loading="lazy" width="${work.orientation === "wide" ? 1100 : 800}" height="${work.orientation === "wide" ? 720 : 1100}">
          <span class="hub-art__veil"></span>
          <span class="hub-art__copy"><small>${Yume.escapeHtml(work.category)}</small><strong>${Yume.escapeHtml(work.title)}</strong></span>
        </a>
        <div class="hub-art__actions">
          <span>${Yume.escapeHtml(work.style)}</span>
          ${YumeFavorites.button("galeria", work.id, "Guardar obra como favorita")}
        </div>
      </article>`;
  }

  function collectionButton(id) {
    const active = YumeverseStorage.list("galeria").includes(id);
    return `<button class="button button--ghost ${active ? "is-active" : ""}" type="button"
      data-collection data-collection-section="galeria" data-id="${Yume.escapeHtml(id)}"
      aria-pressed="${active}"><span data-collection-label>${active ? "Guardada" : "Guardar obra"}</span></button>`;
  }

  function renderHome() {
    const featured = document.querySelector("[data-gallery-featured]");
    const latest = document.querySelector("[data-gallery-latest]");
    if (featured) featured.innerHTML = data.works.filter((item) => item.featured).slice(0, 6).map(workCard).join("");
    if (latest) latest.innerHTML = [...data.works].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map(workCard).join("");
  }

  function renderExplorer() {
    const form = document.querySelector("[data-gallery-filters]");
    const grid = document.querySelector("[data-gallery-grid]");
    const count = document.querySelector("[data-gallery-count]");
    if (!form || !grid) return;

    function update() {
      const q = form.querySelector("[name=q]").value.trim().toLocaleLowerCase("es");
      const category = form.querySelector("[name=categoria]").value;
      const style = form.querySelector("[name=estilo]").value;
      const order = form.querySelector("[name=orden]").value;
      let items = data.works.filter((item) => {
        const haystack = [item.title, item.series, item.character, item.author, item.description, ...(item.tags || [])].join(" ").toLocaleLowerCase("es");
        return (!q || haystack.includes(q))
          && (category === "todas" || item.category === category)
          && (style === "todos" || item.style === style);
      });
      items.sort((a, b) => order === "titulo" ? a.title.localeCompare(b.title, "es") : b.date.localeCompare(a.date));
      count.textContent = `${items.length} obra${items.length === 1 ? "" : "s"}`;
      if (!items.length) {
        Yume.setStatus(grid, "empty", "No hay obras con esos filtros", "Prueba otra categoría, estilo o palabra.");
        return;
      }
      grid.innerHTML = items.map(workCard).join("");
    }

    const styleSelect = form.querySelector("[name=estilo]");
    [...new Set(data.works.map((item) => item.style))].sort().forEach((style) => {
      styleSelect.insertAdjacentHTML("beforeend", `<option>${Yume.escapeHtml(style)}</option>`);
    });
    const paramCategory = Yume.query().get("categoria");
    if (paramCategory) form.querySelector("[name=categoria]").value = paramCategory;
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("reset", () => window.setTimeout(update));
    update();
  }

  async function renderCollection() {
    const grid = document.querySelector("[data-gallery-collection]");
    if (!grid) return;
    await YumeCollection.seed();
    const saved = new Set(YumeverseStorage.list("galeria"));
    const items = data.works.filter((item) => saved.has(item.id));
    const stats = document.querySelector("[data-gallery-stats]");
    if (stats) {
      stats.innerHTML = `
        <div><strong>${items.length}</strong><span>Guardadas</span></div>
        <div><strong>${items.filter((item) => item.category === "Fanart").length}</strong><span>Fanarts</span></div>
        <div><strong>${items.filter((item) => item.author === "Yumeverse").length}</strong><span>Propias</span></div>
        <div><strong>${new Set(items.map((item) => item.category)).size}</strong><span>Álbumes</span></div>`;
    }
    if (!items.length) {
      Yume.setStatus(grid, "empty", "Tu galería personal está vacía", "Guarda obras desde el explorador para crear tu archivo.");
    } else {
      grid.innerHTML = items.map(workCard).join("");
    }
  }

  function renderWork() {
    const shell = document.querySelector("[data-gallery-work]");
    if (!shell) return;
    const index = Math.max(0, data.works.findIndex((item) => item.id === Yume.query().get("id")));
    const work = data.works[index];
    const previous = data.works[(index - 1 + data.works.length) % data.works.length];
    const next = data.works[(index + 1) % data.works.length];
    document.title = `${work.title} | Galería Yumeverse`;
    shell.innerHTML = `
      <div class="container hub-viewer">
        <figure class="hub-viewer__media">
          <img src="${Yume.escapeHtml(work.image)}" alt="${Yume.escapeHtml(work.title)}" width="1400" height="1800">
        </figure>
        <article class="hub-viewer__details">
          <p class="hub-kicker">${Yume.escapeHtml(work.category)} · ${Yume.escapeHtml(work.type)}</p>
          <h1>${Yume.escapeHtml(work.title)}</h1>
          <p class="hub-viewer__lead">${Yume.escapeHtml(work.description)}</p>
          <dl>
            <div><dt>Autoría</dt><dd>${Yume.escapeHtml(work.author)}</dd></div>
            <div><dt>Fecha</dt><dd>${Yume.formatDate(work.date)}</dd></div>
            <div><dt>Técnica</dt><dd>${Yume.escapeHtml(work.technique)}</dd></div>
            <div><dt>Serie</dt><dd>${Yume.escapeHtml(work.series || "Obra original")}</dd></div>
            <div><dt>Personaje</dt><dd>${Yume.escapeHtml(work.character || "—")}</dd></div>
          </dl>
          <div class="hub-article-tags">${work.tags.map((tag) => `<span>#${Yume.escapeHtml(tag)}</span>`).join("")}</div>
          <p class="hub-rights">${Yume.escapeHtml(work.rights)}</p>
          <div class="hub-viewer__actions">${collectionButton(work.id)} ${YumeFavorites.button("galeria", work.id, "Marcar obra como favorita")}</div>
          <nav class="hub-viewer__nav" aria-label="Navegación entre obras">
            <a href="obra.html?id=${encodeURIComponent(previous.id)}">← ${Yume.escapeHtml(previous.title)}</a>
            <a href="obra.html?id=${encodeURIComponent(next.id)}">${Yume.escapeHtml(next.title)} →</a>
          </nav>
        </article>
      </div>`;
    YumeCollection.refresh();
  }

  async function init() {
    if (!document.body.dataset.view?.startsWith("gallery")) return;
    const target = document.querySelector("[data-gallery-featured], [data-gallery-grid], [data-gallery-collection], [data-gallery-work]");
    if (target) Yume.setStatus(target, "loading", "Preparando la galería", "Cargando obras desde galeria.json.");
    try {
      data = await Yume.loadJSON(`${root}data/galeria.json`);
      const view = document.body.dataset.view;
      if (view === "gallery-home") renderHome();
      if (view === "gallery-explorer") renderExplorer();
      if (view === "gallery-collection") await renderCollection();
      if (view === "gallery-work") renderWork();
    } catch {
      Yume.setStatus(target, "error", "No se pudo cargar la galería", "Comprueba data/galeria.json y abre la web desde un servidor.");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("yumeverse:collection", (event) => {
    if (event.detail.section === "galeria" && document.body.dataset.view === "gallery-collection") renderCollection();
  });
})();
