(function () {
  "use strict";

  const SOURCES = [
    { type: "Anime", path: "data/anime.json", key: "works", url: "anime/detalle.html?id=" },
    { type: "Lectura", path: "data/asiaticos.json", key: "works", url: "asiaticos/detalle.html?id=" },
    { type: "Blog", path: "data/blog.json", key: "articles", url: "blog/articulo.html?id=" },
    { type: "Galería", path: "data/galeria.json", key: "works", url: "galeria/obra.html?id=" },
  ];

  function searchableText(item) {
    return [
      item.title,
      item.titulo,
      item.native,
      item.category,
      item.type,
      item.author,
      item.artist,
      item.description,
      item.summary,
      item.excerpt,
      ...(item.genres || []),
      ...(item.tags || []),
    ].filter(Boolean).join(" ").toLocaleLowerCase("es");
  }

  async function render() {
    const form = document.querySelector("[data-global-search]");
    const grid = document.querySelector("[data-search-results]");
    if (!form || !grid) return;

    const input = form.querySelector('input[type="search"]');
    input.value = Yume.query().get("q") || "";

    let entries = [];
    try {
      const loaded = await Promise.all(SOURCES.map(async (source) => ({
        ...source,
        data: await Yume.loadJSON(source.path),
      })));
      loaded.forEach((source) => {
        (source.data[source.key] || []).forEach((item) => {
          entries.push({ ...item, contentType: source.type, href: `${source.url}${encodeURIComponent(item.id)}` });
        });
      });
    } catch {
      Yume.setStatus(grid, "error", "No se pudo abrir el buscador", "Revisa los archivos JSON del proyecto.");
      return;
    }

    function update() {
      const query = input.value.trim().toLocaleLowerCase("es");
      const type = form.querySelector("[name=tipo]")?.value || "todos";
      const results = entries.filter((item) => {
        const typeMatch = type === "todos" || item.contentType.toLocaleLowerCase("es") === type;
        return typeMatch && (!query || searchableText(item).includes(query));
      });
      document.querySelector("[data-results-count]").textContent = `${results.length} resultado${results.length === 1 ? "" : "s"}`;
      if (!results.length) {
        Yume.setStatus(grid, "empty", "Sin coincidencias", "Prueba con otro título, autor, género o categoría.");
        return;
      }
      grid.innerHTML = results.map((item) => `
        <a class="hub-search-result" href="${item.href}">
          <img src="${Yume.escapeHtml(Yume.normalizePath(item.image || item.portada, ""))}" alt="" loading="lazy" width="220" height="150">
          <span class="hub-search-result__type">${Yume.escapeHtml(item.contentType)}</span>
          <span><strong>${Yume.escapeHtml(item.title || item.titulo)}</strong>
          <small>${Yume.escapeHtml(item.excerpt || item.summary || item.description || item.category || item.type || "")}</small></span>
          <i aria-hidden="true">→</i>
        </a>`).join("");
    }

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const url = new URL(window.location.href);
      if (input.value) url.searchParams.set("q", input.value);
      else url.searchParams.delete("q");
      history.replaceState({}, "", url);
      update();
    });
    update();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
