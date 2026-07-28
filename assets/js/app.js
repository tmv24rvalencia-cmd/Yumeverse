(function () {
  "use strict";

  const cache = new Map();

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizePath(path, root = "") {
    if (!path) return "";
    if (/^(https?:|data:|\/)/.test(path)) return path;
    return `${root}${path.replace(/^(\.\.\/)+/, "")}`;
  }

  async function loadJSON(path) {
    if (cache.has(path)) return cache.get(path);
    const request = fetch(path, { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
        return response.json();
      });
    cache.set(path, request);
    return request;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function stars(value = 0, maximum = 10) {
    const normalized = Math.max(0, Math.min(maximum, Number(value) || 0));
    const label = normalized.toFixed(normalized % 1 ? 1 : 0);
    return `<span class="hub-stars" aria-label="${label} de ${maximum}">★ ${label}</span>`;
  }

  function toast(message) {
    let region = document.querySelector(".hub-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "hub-toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.append(region);
    }
    const item = document.createElement("div");
    item.className = "hub-toast";
    item.textContent = message;
    region.append(item);
    requestAnimationFrame(() => item.classList.add("is-visible"));
    window.setTimeout(() => {
      item.classList.remove("is-visible");
      window.setTimeout(() => item.remove(), 220);
    }, 2400);
  }

  function setStatus(container, kind, title, text) {
    if (!container) return;
    container.innerHTML = `
      <div class="hub-state hub-state--${escapeHtml(kind)}" role="${kind === "error" ? "alert" : "status"}">
        <span aria-hidden="true">${kind === "error" ? "!" : kind === "empty" ? "◇" : "✦"}</span>
        <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>
      </div>`;
  }

  function query() {
    return new URLSearchParams(window.location.search);
  }

  window.Yume = {
    escapeHtml,
    formatDate,
    loadJSON,
    normalizePath,
    query,
    setStatus,
    stars,
    toast,
  };

  document.addEventListener("DOMContentLoaded", async () => {
    document.querySelectorAll("#current-year, [data-current-year]").forEach((node) => {
      node.textContent = "2026";
    });

    const footerEmail = document.querySelector("[data-footer-email]");
    if (footerEmail) {
      try {
        const root = document.body.dataset.root || "";
        const site = await loadJSON(`${root}data/site.json`);
        const year = site.year || new Date().getFullYear();
        document.querySelectorAll("#current-year, [data-current-year]").forEach((node) => {
          node.textContent = String(year);
        });
        if (site.contact?.email) {
          footerEmail.href = `mailto:${site.contact.email}`;
          footerEmail.textContent = site.contact.email;
        } else {
          footerEmail.hidden = true;
        }
      } catch {
        // El footer conserva su contenido de respaldo.
      }
    }

    document.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.closest(".hub-media, .hub-card__media, .hub-art__media, .world-card__media, .update-card")?.classList.add("is-missing");
        image.hidden = true;
      });
    });
  });
})();

/* Páginas de Anime: contenido cargado desde data/anime.json. */

(() => {
  "use strict";

  if (!document.body.dataset.view?.startsWith("anime-")) return;

  const DATA_URL = "../data/anime.json";
  const FAVORITES_KEY = "yumeverse-anime-favorites";
  let data = { home: {}, works: [], collection: [], comments: [] };

  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const normalize = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .trim();

  const formatScore = (value) =>
    Number(value || 0).toLocaleString("es-ES", {
      minimumFractionDigits: Number(value) % 1 ? 1 : 0,
      maximumFractionDigits: 1
    });

  const safeColor = (value, fallback) =>
    /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback;

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = new Date(`${value}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const statusText = {
    emision: "En emisión",
    finalizado: "Finalizado",
    viendo: "Viendo",
    completado: "Completado",
    pendiente: "Pendiente",
    pausado: "En pausa"
  };

  const workById = (id) =>
    data.works.find((work) => work.id === id);

  const readFavorites = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "null");
      const global = JSON.parse(localStorage.getItem("yumeverse.favorites") || "[]")
        .filter((item) => String(item).startsWith("anime:"))
        .map((item) => String(item).slice(6));
      if (Array.isArray(saved)) return new Set([...saved, ...global]);
    } catch {
      // Se usarán los favoritos iniciales del JSON.
    }
    return new Set(data.works.filter((work) => work.favorite).map((work) => work.id));
  };

  const saveFavorites = (favorites) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
      const global = new Set(JSON.parse(localStorage.getItem("yumeverse.favorites") || "[]"));
      [...global].filter((item) => String(item).startsWith("anime:")).forEach((item) => global.delete(item));
      favorites.forEach((id) => global.add(`anime:${id}`));
      localStorage.setItem("yumeverse.favorites", JSON.stringify([...global]));
    } catch {
      // La página continúa funcionando sin almacenamiento local.
    }
  };

  const favoriteButton = (work) => {
    const active = readFavorites().has(work.id);
    return `
      <button class="favorite-button ${active ? "is-active" : ""}"
        type="button"
        data-favorite-id="${escapeHtml(work.id)}"
        data-title="${escapeHtml(work.title)}"
        aria-label="${active ? "Quitar" : "Añadir"} ${escapeHtml(work.title)} ${active ? "de" : "a"} favoritos"
        aria-pressed="${active}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"></path>
        </svg>
      </button>
    `;
  };

  const animeCard = (work) => {
    if (!work) return "";
    const episodeLabel =
      work.type === "Película"
        ? `${work.minutes || 100} minutos`
        : `${work.episodes || 0} episodios`;

    return `
      <article class="anime-card" data-anime-id="${escapeHtml(work.id)}">
        <a class="anime-card__image"
          href="detalle.html?id=${encodeURIComponent(work.id)}"
          aria-label="Ver expediente de ${escapeHtml(work.title)}">
          <img src="${escapeHtml(work.image)}"
            alt="Portada de ${escapeHtml(work.title)}"
            loading="lazy">
          <span class="anime-card__overlay"></span>
          <span class="anime-card__status ${work.status === "emision" ? "anime-card__status--airing" : ""}">
            ${escapeHtml(statusText[work.status] || work.status)}
          </span>
          <span class="anime-card__rating"><span aria-hidden="true">★</span>${formatScore(work.rating)}</span>
        </a>
        <div class="anime-card__body">
          <div class="anime-card__topline">
            <span>${escapeHtml(work.type)}</span>
            <span>${escapeHtml(work.year)}</span>
            <span>${escapeHtml(episodeLabel)}</span>
          </div>
          <h3><a href="detalle.html?id=${encodeURIComponent(work.id)}">${escapeHtml(work.title)}</a></h3>
          <p>${escapeHtml(work.description)}</p>
          <div class="anime-card__genres">
            ${(work.genres || [])
              .slice(0, 2)
              .map((genre) => `<button type="button" data-genre-link="${escapeHtml(genre)}">${escapeHtml(genre)}</button>`)
              .join("")}
          </div>
          <div class="anime-card__actions">
            <a class="anime-card__detail" href="detalle.html?id=${encodeURIComponent(work.id)}">
              Ver expediente <span aria-hidden="true">→</span>
            </a>
            ${favoriteButton(work)}
          </div>
        </div>
      </article>
    `;
  };

  const syncFavorites = () => {
    const favorites = readFavorites();
    document.querySelectorAll("[data-favorite-id]").forEach((button) => {
      const active = favorites.has(button.dataset.favoriteId);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute(
        "aria-label",
        `${active ? "Quitar" : "Añadir"} ${button.dataset.title || workById(button.dataset.favoriteId)?.title || "anime"} ${active ? "de" : "a"} favoritos`
      );
    });
  };

  const initFavorites = () => {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-favorite-id]");
      if (!button) return;
      const favorites = readFavorites();
      if (favorites.has(button.dataset.favoriteId)) {
        favorites.delete(button.dataset.favoriteId);
      } else {
        favorites.add(button.dataset.favoriteId);
      }
      saveFavorites(favorites);
      syncFavorites();
    });
  };

  const initGlobalSearch = () => {
    const form = byId("global-search-form");
    const input = byId("global-search");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input?.value.trim();
      window.location.href = `explorador.html${query ? `?q=${encodeURIComponent(query)}` : ""}`;
    });
  };

  const initHome = () => {
    const grid = byId("anime-home-featured");
    if (!grid) return;
    const works = (data.home.featured || []).map(workById).filter(Boolean).slice(0, 3);
    grid.innerHTML = works
      .map(
        (work, index) => `
          <a class="update-card ${index === 0 ? "update-card--feature" : index === 1 ? "update-card--editorial" : "update-card--art"}"
            href="detalle.html?id=${encodeURIComponent(work.id)}">
            ${index !== 1 ? `<img src="${escapeHtml(work.image)}" alt="Portada de ${escapeHtml(work.title)}">` : `<span class="update-card__number" aria-hidden="true">0${index + 1}</span>`}
            ${index !== 1 ? '<span class="update-card__veil"></span>' : ""}
            <div class="update-card__content">
              <span class="tag">${escapeHtml(work.type)} · ${escapeHtml(statusText[work.status] || work.status)}</span>
              <h3>${escapeHtml(work.title)}</h3>
              <p>${escapeHtml(work.description)}</p>
              <strong>Ver expediente <span aria-hidden="true">→</span></strong>
            </div>
          </a>
        `
      )
      .join("");
  };

  const initRoutes = () => {
    const grid = byId("anime-home-routes");
    if (!grid) return;
    const routes = Array.isArray(data.home.routes) ? data.home.routes : [];

    if (!routes.length) {
      grid.innerHTML = '<p class="data-hint">Añade los accesos dentro de <strong>home → routes</strong> en anime.json.</p>';
      return;
    }

    grid.innerHTML = routes.map((route) => {
      const background = safeColor(route.background, "#171421");
      const foreground = safeColor(route.foreground, "#F8F4FA");
      const muted = safeColor(route.muted, "#C8C0CC");
      const accent = safeColor(route.accent, "#FF6EAF");
      const links = (route.links || []).map((link) => `
        <a href="${escapeHtml(link.url)}">
          ${escapeHtml(link.label)} <span aria-hidden="true">→</span>
        </a>
      `).join("");

      return `
        <article class="anime-route-card anime-route-card--${escapeHtml(route.id)}"
          style="--route-background:${background};--route-foreground:${foreground};--route-muted:${muted};--route-accent:${accent}">
          <div>
            <span class="anime-route-card__kicker">${escapeHtml(route.kicker)}</span>
            <h3>${escapeHtml(route.title)}</h3>
            <p>${escapeHtml(route.description)}</p>
          </div>
          <div class="anime-route-card__links">${links}</div>
        </article>
      `;
    }).join("");
  };

  const initExplorer = () => {
    const grid = byId("anime-grid");
    if (!grid) return;

    const form = byId("explorer-filters");
    const search = byId("anime-search");
    const genre = byId("filter-genre");
    const format = byId("filter-format");
    const status = byId("filter-status");
    const year = byId("filter-year");
    const rating = byId("filter-rating");
    const ratingOutput = byId("rating-output");
    const sort = byId("sort-anime");
    const activeFilters = byId("active-filters");
    const empty = byId("explorer-empty");
    const pagination = byId("pagination");
    const count = byId("anime-count");
    const pageSize = 9;
    let currentPage = 1;

    [...new Set(data.works.flatMap((work) => work.genres || []))]
      .sort((a, b) => a.localeCompare(b, "es"))
      .forEach((value) => {
        genre.insertAdjacentHTML(
          "beforeend",
          `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`
        );
      });

    [...new Set(data.works.map((work) => work.year))]
      .sort((a, b) => b - a)
      .forEach((value) => {
        year.insertAdjacentHTML("beforeend", `<option value="${value}">${value}</option>`);
      });

    byId("catalog-total").textContent = data.works.length;
    byId("catalog-genres").textContent = new Set(data.works.flatMap((work) => work.genres || [])).size;
    byId("catalog-new").textContent = data.works.filter((work) => Number(work.year) >= 2021).length;

    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) search.value = params.get("q");
    if (params.get("genero")) genre.value = params.get("genero");

    const currentFilters = () => ({
      search: search.value.trim(),
      genre: genre.value,
      format: format.value,
      status: status.value,
      year: year.value,
      rating: Number(rating.value)
    });

    const filteredWorks = () => {
      const filters = currentFilters();
      const needle = normalize(filters.search);
      const works = data.works.filter((work) => {
        const searchable = normalize(
          `${work.title} ${work.description} ${(work.genres || []).join(" ")} ${work.studio || ""}`
        );
        return (
          (!needle || searchable.includes(needle)) &&
          (!filters.genre || work.genres?.includes(filters.genre)) &&
          (!filters.format || work.type === filters.format) &&
          (!filters.status || work.status === filters.status) &&
          (!filters.year || Number(work.year) === Number(filters.year)) &&
          Number(work.rating) >= filters.rating
        );
      });

      return works.sort((a, b) => {
        if (sort.value === "rating-desc") return b.rating - a.rating;
        if (sort.value === "year-desc") return b.year - a.year;
        if (sort.value === "title-asc") return a.title.localeCompare(b.title, "es");
        return b.recommended - a.recommended;
      });
    };

    const render = () => {
      const works = filteredWorks();
      const totalPages = Math.max(1, Math.ceil(works.length / pageSize));
      currentPage = Math.min(currentPage, totalPages);
      const visible = works.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      const filters = currentFilters();
      const labels = [
        filters.search ? `Búsqueda: ${filters.search}` : "",
        filters.genre,
        filters.format,
        filters.status ? statusText[filters.status] : "",
        filters.year,
        filters.rating ? `Desde ${filters.rating} ★` : ""
      ].filter(Boolean);

      grid.innerHTML = visible.map(animeCard).join("");
      grid.hidden = !visible.length;
      empty.hidden = Boolean(visible.length);
      count.textContent = `${works.length} ${works.length === 1 ? "título" : "títulos"}`;
      activeFilters.innerHTML = (labels.length ? labels : ["Todos los animes"])
        .map((label) => `<span class="active-filter">${escapeHtml(label)}</span>`)
        .join("");
      pagination.innerHTML =
        totalPages > 1
          ? Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return `<button type="button" data-page-number="${pageNumber}" ${pageNumber === currentPage ? 'class="is-active" aria-current="page"' : ""}>${pageNumber}</button>`;
            }).join("")
          : "";
      syncFavorites();
    };

    const updateRating = () => {
      const value = Number(rating.value);
      ratingOutput.value = value ? `${formatScore(value)} ★` : "Cualquiera";
      ratingOutput.textContent = ratingOutput.value;
    };

    [search, genre, format, status, year, rating, sort].forEach((control) => {
      control.addEventListener(control === search ? "input" : "change", () => {
        if (control === rating) updateRating();
        currentPage = 1;
        render();
      });
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      currentPage = 1;
      render();
    });

    byId("clear-filters")?.addEventListener("click", () => {
      form.reset();
      search.value = "";
      rating.value = "0";
      sort.value = "recommended";
      currentPage = 1;
      updateRating();
      render();
    });

    pagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page-number]");
      if (!button) return;
      currentPage = Number(button.dataset.pageNumber);
      render();
      byId("catalogo")?.scrollIntoView({ behavior: "smooth" });
    });

    grid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-genre-link]");
      if (!button) return;
      genre.value = button.dataset.genreLink;
      currentPage = 1;
      render();
    });

    updateRating();
    render();
  };

  const collectionItem = (entry) => {
    const work = workById(entry.workId);
    return work ? { ...work, ...entry, id: work.id } : null;
  };

  const collectionCard = (item) => {
    const progress = item.episodes
      ? Math.min(100, Math.round((item.watched / item.episodes) * 100))
      : 0;
    const completed = item.status === "completado";
    return `
      <article class="collection-card" data-status="${escapeHtml(item.status)}">
        <div class="collection-card__visual">
          <a href="detalle.html?id=${encodeURIComponent(item.id)}">
            <img src="${escapeHtml(item.image)}" alt="Portada de ${escapeHtml(item.title)}" loading="lazy">
          </a>
          <span class="collection-card__status">${escapeHtml(statusText[item.status] || item.status)}</span>
          ${favoriteButton(item)}
        </div>
        <div class="collection-card__content">
          <div class="collection-card__meta">
            <span>${escapeHtml(item.type)}</span><span>${escapeHtml(item.year)}</span><span>${item.episodes} episodios</span>
          </div>
          <h3><a href="detalle.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></h3>
          <div class="collection-card__rating">
            <span aria-hidden="true">${item.rating ? "★" : "☆"}</span>
            <strong>${item.rating ? formatScore(item.rating) : "Sin valorar"}</strong>
            ${item.rating ? "<small>Mi valoración</small>" : ""}
          </div>
          <div class="collection-card__progress">
            <div><span>Progreso</span><strong>${completed ? "Completado" : `${item.watched} / ${item.episodes} episodios`}</strong></div>
            <div class="progress-bar" role="progressbar" aria-valuenow="${item.watched}" aria-valuemin="0" aria-valuemax="${item.episodes}">
              <span style="width:${progress}%"></span>
            </div>
          </div>
          <div class="collection-card__actions">
            <a class="collection-card__continue" href="detalle.html?id=${encodeURIComponent(item.id)}">
              ${item.status === "pendiente" ? "Comenzar a ver" : completed ? "Ver expediente" : "Continuar viendo"}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </article>
    `;
  };

  const renderComments = () => {
    const list = byId("anime-comments-list");
    if (!list) return;
    list.innerHTML = data.comments
      .map(
        (comment, index) => `
          <article class="collection-note">
            <span class="collection-note__number">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <div class="collection-note__meta">
                <span>${escapeHtml(comment.title || workById(comment.workId)?.title || "")}</span>
                <time datetime="${escapeHtml(comment.date)}">${escapeHtml(formatDate(comment.date))}</time>
              </div>
              <blockquote>“${escapeHtml(comment.text)}”</blockquote>
              <div class="collection-note__rating" aria-label="${formatScore(comment.rating)} de 10">
                <span aria-hidden="true">${"★".repeat(Math.round(Number(comment.rating) / 2))}${"☆".repeat(5 - Math.round(Number(comment.rating) / 2))}</span>
                <strong>${formatScore(comment.rating)} / 10</strong>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  };

  const initCollection = () => {
    const grid = byId("collection-grid");
    if (!grid) return;
    const items = data.collection.map(collectionItem).filter(Boolean);
    const search = byId("collection-search");
    const sort = byId("collection-sort");
    const empty = byId("collection-empty");
    let filter = "todos";

    const updateSummary = () => {
      const totalEpisodes = items.reduce((sum, item) => sum + Number(item.episodes || 0), 0);
      const watched = items.reduce((sum, item) => sum + Number(item.watched || 0), 0);
      const progress = totalEpisodes ? Math.round((watched / totalEpisodes) * 100) : 0;
      const ratings = items.filter((item) => item.rating).map((item) => Number(item.rating));
      const average = ratings.length
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

      byId("overview-total").textContent = items.length;
      byId("overview-progress").textContent = `${progress}%`;
      byId("overview-progress-bar").style.width = `${progress}%`;
      byId("overview-episodes").textContent = watched;
      byId("overview-time").textContent = `${Math.round((watched * 24) / 60)} h`;
      byId("overview-rating").textContent = formatScore(average);
      ["viendo", "completado", "pendiente", "pausado"].forEach((state) => {
        const amount = items.filter((item) => item.status === state).length;
        document.querySelector(`[data-stat="${state}"]`)?.replaceChildren(String(amount));
        document.querySelector(`[data-tab-count="${state}"]`)?.replaceChildren(String(amount));
      });
      document.querySelector('[data-tab-count="todos"]')?.replaceChildren(String(items.length));
    };

    const render = () => {
      const needle = normalize(search.value);
      const visible = items
        .filter(
          (item) =>
            (filter === "todos" || item.status === filter) &&
            (!needle || normalize(item.title).includes(needle))
        )
        .sort((a, b) => {
          if (sort.value === "title-asc") return a.title.localeCompare(b.title, "es");
          if (sort.value === "title-desc") return b.title.localeCompare(a.title, "es");
          if (sort.value === "rating-desc") return b.rating - a.rating;
          if (sort.value === "progress-desc") return b.watched / b.episodes - a.watched / a.episodes;
          if (sort.value === "year-desc") return b.year - a.year;
          return new Date(b.addedAt) - new Date(a.addedAt);
        });

      grid.innerHTML = visible.map(collectionCard).join("");
      grid.hidden = !visible.length;
      empty.hidden = Boolean(visible.length);
      syncFavorites();
    };

    document.querySelectorAll("[data-collection-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        filter = button.dataset.collectionFilter;
        document.querySelectorAll("[data-collection-filter]").forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-selected", String(active));
        });
        render();
      });
    });

    search?.addEventListener("input", render);
    sort?.addEventListener("change", render);
    byId("clear-collection-filters")?.addEventListener("click", () => {
      filter = "todos";
      search.value = "";
      sort.value = "recent";
      render();
    });

    const collectionIds = new Set(items.map((item) => item.id));
    const recommendations = data.works
      .filter((work) => !collectionIds.has(work.id))
      .sort((a, b) => b.recommended - a.recommended)
      .slice(0, 4);
    const recommendationGrid = byId("recommendation-grid");
    if (recommendationGrid) {
      recommendationGrid.innerHTML = recommendations.map(animeCard).join("");
    }

    updateSummary();
    render();
    renderComments();
  };

  const setText = (id, value) => {
    const node = byId(id);
    if (node) node.textContent = value ?? "";
  };

  const initDetail = () => {
    if (document.body.dataset.page !== "detalle") return;
    const requested = new URLSearchParams(window.location.search).get("id");
    const work = workById(requested) || data.works[0];
    if (!work) return;

    document.title = `${work.title} | Yumeverse`;
    setText("breadcrumb-title", work.title);
    setText("anime-title", work.title);
    setText("anime-original-title", work.originalTitle);
    setText("anime-short-description", work.description);
    setText("anime-format", work.type);
    setText("anime-year", work.year);
    setText("anime-age", work.ageRating);
    setText("anime-rating", formatScore(work.rating));
    setText("anime-votes", work.votes ? `Basada en ${Number(work.votes).toLocaleString("es-ES")} valoraciones` : "Valoración personal");
    setText("summary-format", work.type);
    setText("summary-episodes", work.episodes);
    setText("summary-duration", work.duration);
    setText("summary-release", work.release);
    setText("summary-studio", work.studio || "Añádelo en anime.json");
    setText("summary-source", work.source || "Añádelo en anime.json");

    const poster = byId("anime-poster");
    const backdrop = byId("anime-backdrop");
    [poster, backdrop].forEach((image) => {
      if (!image) return;
      image.src = work.image;
      image.alt = `Portada de ${work.title}`;
    });
    setText("anime-status", statusText[work.status] || work.status);

    const genres = byId("anime-genres");
    if (genres) {
      genres.innerHTML = (work.genres || [])
        .map((genre) => `<span>${escapeHtml(genre)}</span>`)
        .join("");
    }

    const synopsis = byId("anime-synopsis");
    if (synopsis) synopsis.innerHTML = `<p>${escapeHtml(work.synopsis || work.description)}</p>`;

    const technical = byId("technical-information");
    if (technical) {
      technical.innerHTML = `
        <div><dt>Título</dt><dd>${escapeHtml(work.title)}</dd></div>
        <div><dt>Formato</dt><dd>${escapeHtml(work.type)}</dd></div>
        <div><dt>Año</dt><dd>${escapeHtml(work.year)}</dd></div>
        <div><dt>Estudio</dt><dd>${escapeHtml(work.studio || "Añádelo en anime.json")}</dd></div>
        <div><dt>Fuente</dt><dd>${escapeHtml(work.source || "Añádelo en anime.json")}</dd></div>
      `;
    }

    const episodeList = byId("episode-list");
    const episodeButton = byId("show-all-episodes");
    if (episodeList) {
      const guide = work.episodeGuide || {};
      const total = Math.max(1, Number(guide.totalEpisodes || work.episodes) || 1);
      const minutesPerEpisode = Number.parseInt(work.duration, 10) || 24;
      const episodes = Array.isArray(guide.episodes) && guide.episodes.length
        ? guide.episodes
        : Array.from({ length: total }, (_, index) => ({
            number: index + 1,
            title: `Episodio ${index + 1}`,
            minutes: minutesPerEpisode,
            description: "Información pendiente de completar en data/anime.json."
          }));
      const initialVisible = Math.max(1, Number(guide.initialVisible) || 6);
      let expanded = false;

      setText("episode-season-title", guide.seasonTitle || "Guía de episodios");
      setText("episode-summary-count", guide.totalEpisodes || episodes.length);
      setText(
        "episode-summary-minutes",
        guide.totalMinutes || episodes.reduce((sum, episode) => sum + (Number(episode.minutes) || 0), 0)
      );
      setText("episode-summary-year", guide.year || work.year);

      const renderEpisodes = () => {
        const visible = expanded ? episodes : episodes.slice(0, initialVisible);
        episodeList.innerHTML = visible.map((episode) => `
          <li class="episode-item">
            <span class="episode-item__number">${String(episode.number).padStart(2, "0")}</span>
            <div class="episode-item__content">
              <div>
                <h3>${escapeHtml(episode.title)}</h3>
                <span>${escapeHtml(episode.minutes)} minutos</span>
              </div>
              <p>${escapeHtml(episode.description)}</p>
            </div>
            <label class="episode-check">
              <input type="checkbox" data-episode="${escapeHtml(episode.number)}">
              <span>Visto</span>
            </label>
          </li>
        `).join("");

        if (episodeButton) {
          episodeButton.hidden = episodes.length <= initialVisible;
          episodeButton.innerHTML = expanded
            ? 'Mostrar menos episodios <span aria-hidden="true">↑</span>'
            : `Mostrar los ${episodes.length} episodios <span aria-hidden="true">↓</span>`;
          episodeButton.setAttribute("aria-expanded", String(expanded));
        }
      };

      episodeButton?.addEventListener("click", () => {
        expanded = !expanded;
        renderEpisodes();
      });
      renderEpisodes();
    }

    const characterGrid = byId("character-grid");
    if (characterGrid) {
      characterGrid.innerHTML = (work.characters || [])
        .map(
          (character) => `
            <article class="character-card">
              <img src="${escapeHtml(character.image || work.image)}" alt="${escapeHtml(character.name)}">
              <h3>${escapeHtml(character.name)}</h3>
              <p>${escapeHtml(character.role || "")}</p>
            </article>
          `
        )
        .join("");
      if (!work.characters?.length) {
        characterGrid.innerHTML = `<p class="data-hint">Añade personajes dentro de <strong>works → characters</strong> en anime.json.</p>`;
      }
    }

    const related = byId("related-anime");
    if (related) {
      related.innerHTML = data.works
        .filter(
          (candidate) =>
            candidate.id !== work.id &&
            candidate.genres?.some((genre) => work.genres?.includes(genre))
        )
        .slice(0, 4)
        .map(animeCard)
        .join("");
    }

    document.querySelectorAll("[data-favorite-id]").forEach((button) => {
      if (button.closest(".detail-hero")) {
        button.dataset.favoriteId = work.id;
        button.dataset.title = work.title;
      }
    });

    const form = byId("anime-collection-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      setText("collection-feedback", "Cambios guardados en este navegador.");
    });

    syncFavorites();
  };

  const showDataError = () => {
    ["anime-home-featured", "anime-home-routes", "anime-grid", "collection-grid", "anime-comments-list"]
      .map(byId)
      .filter(Boolean)
      .forEach((target) => {
        target.innerHTML = `
          <div class="data-error">
            <strong>No se pudieron cargar los datos.</strong>
            <span>Comprueba data/anime.json y abre la web desde un servidor local.</span>
          </div>
        `;
      });
  };

  const start = async () => {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`No se pudo cargar ${DATA_URL}`);
      data = await response.json();
      data.home ||= {};
      data.works ||= [];
      data.collection ||= [];
      data.comments ||= [];
      initFavorites();
      initGlobalSearch();
      initHome();
      initRoutes();
      initExplorer();
      initCollection();
      initDetail();
      syncFavorites();
    } catch (error) {
      console.error(error);
      showDataError();
    }
  };

  document.addEventListener("DOMContentLoaded", start);
})();

/* Páginas de Asiáticos: contenido cargado desde data/asiaticos.json. */

(() => {
  "use strict";

  if (!document.body.dataset.view?.startsWith("asian-")) return;

  const DATA_URL = "../data/asiaticos.json";
  const FAVORITES_KEY = "yumeverse-asian-favorites";
  let data = { home: {}, works: [], collection: [], comments: [] };

  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const normalize = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .trim();

  const typeSlug = (type = "") =>
    normalize(type).replaceAll(" ", "-");

  const formatScore = (value) =>
    Number(value).toLocaleString("es-ES", {
      minimumFractionDigits: Number(value) % 1 ? 1 : 0,
      maximumFractionDigits: 1
    });

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = new Date(`${value}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const ratingStars = (rating) => {
    const filled = Math.max(0, Math.min(5, Math.round(Number(rating) / 2)));
    return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
  };

  const getFavorites = () => {
    try {
      const local = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const global = JSON.parse(localStorage.getItem("yumeverse.favorites") || "[]")
        .filter((item) => String(item).startsWith("asiaticos:"))
        .map((item) => String(item).slice(11));
      return new Set([...local, ...global]);
    } catch {
      return new Set();
    }
  };

  const saveFavorites = (favorites) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
      const global = new Set(JSON.parse(localStorage.getItem("yumeverse.favorites") || "[]"));
      [...global].filter((item) => String(item).startsWith("asiaticos:")).forEach((item) => global.delete(item));
      favorites.forEach((id) => global.add(`asiaticos:${id}`));
      localStorage.setItem("yumeverse.favorites", JSON.stringify([...global]));
    } catch {
      // La web continúa funcionando si el navegador bloquea el almacenamiento.
    }
  };

  const showToast = (message) => {
    const toast = document.querySelector(".yv-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  };

  const workById = (id) =>
    data.works.find((work) => work.id === id);

  const bookCard = (work, collectionEntry = null) => {
    if (!work) return "";
    const favorites = getFavorites();
    const progress = collectionEntry?.progress;
    const state = collectionEntry?.state || work.status;
    const hasProgress = Number.isFinite(progress);

    return `
      <article class="yv-card ${hasProgress ? "yv-collection-card" : ""}"
        data-title-id="${escapeHtml(work.id)}"
        data-state="${escapeHtml(state)}">
        <a class="yv-card__media"
          href="detalle.html?id=${encodeURIComponent(work.id)}"
          aria-label="Abrir expediente de ${escapeHtml(work.title)}">
          <img src="${escapeHtml(work.image)}"
            alt="Portada de ${escapeHtml(work.title)}"
            loading="lazy">
          <span class="yv-badge">${escapeHtml(work.type)}</span>
          <span class="yv-rating"><span aria-hidden="true">★</span>${formatScore(work.rating)}</span>
        </a>
        <div class="yv-card__body">
          <div class="yv-card__meta">
            <span>${escapeHtml(work.origin)}</span>
            <span>${escapeHtml(work.chapterLabel)}</span>
            <span>${escapeHtml(state)}</span>
          </div>
          <h3><a href="detalle.html?id=${encodeURIComponent(work.id)}">${escapeHtml(work.title)}</a></h3>
          <p>${escapeHtml(work.summary)}</p>
          ${
            hasProgress
              ? `<div class="yv-progress" aria-label="${progress}% leído"><i style="width:${progress}%"></i></div>
                 <div class="yv-progress-label">
                   <span>${progress ? "Lectura guardada" : "Aún sin comenzar"}</span>
                   <strong>${progress}%</strong>
                 </div>`
              : ""
          }
          <div class="yv-card__footer">
            <a href="detalle.html?id=${encodeURIComponent(work.id)}">Ver expediente <span aria-hidden="true">→</span></a>
            <button class="yv-heart ${favorites.has(work.id) ? "is-active" : ""}"
              type="button"
              data-favorite="${escapeHtml(work.id)}"
              aria-label="${favorites.has(work.id) ? "Quitar" : "Añadir"} ${escapeHtml(work.title)} ${favorites.has(work.id) ? "de" : "a"} favoritos"
              aria-pressed="${favorites.has(work.id)}">♥</button>
          </div>
        </div>
      </article>
    `;
  };

  const syncFavoriteButtons = () => {
    const favorites = getFavorites();
    document.querySelectorAll("[data-favorite]").forEach((button) => {
      const active = favorites.has(button.dataset.favorite);
      const work = workById(button.dataset.favorite);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute(
        "aria-label",
        `${active ? "Quitar" : "Añadir"} ${work?.title || "esta obra"} ${active ? "de" : "a"} favoritos`
      );
    });
  };

  const initFavorites = () => {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-favorite]");
      if (!button) return;
      const favorites = getFavorites();
      const work = workById(button.dataset.favorite);
      if (favorites.has(button.dataset.favorite)) {
        favorites.delete(button.dataset.favorite);
        showToast(`${work?.title || "La obra"} se ha quitado de favoritos.`);
      } else {
        favorites.add(button.dataset.favorite);
        showToast(`${work?.title || "La obra"} se ha añadido a favoritos.`);
      }
      saveFavorites(favorites);
      syncFavoriteButtons();
    });
  };

  const initHome = () => {
    const featured = byId("featured-grid");
    if (featured) {
      featured.innerHTML = (data.home.featured || [])
        .map((id) => bookCard(workById(id)))
        .join("");
    }

    const latest = byId("latest-grid");
    if (latest) {
      latest.innerHTML = (data.home.latest || [])
        .map((id) => bookCard(workById(id)))
        .join("");
    }

    const miniList = document.querySelector(".yv-mini-list");
    if (miniList) {
      miniList.innerHTML = data.collection
        .filter((entry) => entry.state === "En progreso")
        .slice(0, 2)
        .map((entry) => {
          const work = workById(entry.workId);
          if (!work) return "";
          return `
            <a class="yv-mini-item" href="detalle.html?id=${encodeURIComponent(work.id)}">
              <img src="${escapeHtml(work.image)}" alt="">
              <span><strong>${escapeHtml(work.title)}</strong><span>${entry.progress}% leído</span></span>
              <span class="yv-progress" aria-label="${entry.progress}% leído"><i style="width:${entry.progress}%"></i></span>
            </a>
          `;
        })
        .join("");
    }
  };

  const initExplorer = () => {
    const grid = byId("catalog-grid");
    if (!grid) return;

    const search = byId("catalog-search");
    const type = byId("filter-type");
    const origin = byId("filter-origin");
    const status = byId("filter-status");
    const sort = byId("filter-sort");
    const clear = byId("filter-clear");
    const count = byId("results-count");
    const empty = byId("catalog-empty");
    const pagination = byId("catalog-pagination");
    const pageSize = 8;
    let page = 1;

    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) search.value = params.get("q");
    if (params.get("tipo")) type.value = params.get("tipo");

    const filteredWorks = () => {
      const needle = normalize(search.value);
      const result = data.works.filter((work) => {
        const searchable = normalize(
          `${work.title} ${work.native} ${(work.genres || []).join(" ")} ${work.author}`
        );
        return (
          (!needle || searchable.includes(needle)) &&
          (!type.value || typeSlug(work.type) === type.value) &&
          (!origin.value || work.origin === origin.value) &&
          (!status.value || work.status === status.value)
        );
      });

      return result.sort((a, b) => {
        if (sort.value === "rating") return b.rating - a.rating;
        if (sort.value === "newest") return Number.parseInt(b.year, 10) - Number.parseInt(a.year, 10);
        if (sort.value === "chapters") return b.chapters - a.chapters;
        return a.title.localeCompare(b.title, "es");
      });
    };

    const render = () => {
      const works = filteredWorks();
      const pages = Math.max(1, Math.ceil(works.length / pageSize));
      page = Math.min(page, pages);
      const visible = works.slice((page - 1) * pageSize, page * pageSize);

      grid.innerHTML = visible.map((work) => bookCard(work)).join("");
      grid.hidden = !visible.length;
      empty.hidden = Boolean(visible.length);
      count.textContent = `${works.length} ${works.length === 1 ? "obra" : "obras"}`;
      pagination.innerHTML = Array.from({ length: pages }, (_, index) => {
        const pageNumber = index + 1;
        return `<button type="button" data-page="${pageNumber}" ${pageNumber === page ? 'aria-current="page"' : ""}>${pageNumber}</button>`;
      }).join("");
      pagination.hidden = works.length <= pageSize;
      syncFavoriteButtons();
    };

    [search, type, origin, status, sort].forEach((control) => {
      control?.addEventListener(control === search ? "input" : "change", () => {
        page = 1;
        render();
      });
    });

    clear?.addEventListener("click", () => {
      search.value = "";
      type.value = "";
      origin.value = "";
      status.value = "";
      sort.value = "title";
      page = 1;
      render();
    });

    pagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");
      if (!button) return;
      page = Number(button.dataset.page);
      render();
      byId("catalog-results")?.scrollIntoView({ behavior: "smooth" });
    });

    render();
  };

  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value ?? "";
  };

  const renderDetail = (work) => {
    if (!work) return;
    document.title = `${work.title} | Yumeverse`;
    const hero = document.querySelector(".yv-detail-hero");
    hero?.style.setProperty("--detail-image", `url("${work.image}")`);

    document.querySelectorAll("[data-detail-title]").forEach((node) => {
      node.textContent = work.title;
    });
    setText("[data-detail-native]", work.native);
    setText("[data-detail-summary]", work.summary);
    setText("[data-detail-synopsis]", work.synopsis);
    setText("[data-detail-type]", work.type);
    setText("[data-detail-origin]", work.origin);
    setText("[data-detail-status]", work.status);
    setText("[data-detail-year]", work.year);
    setText("[data-detail-chapters]", work.chapterLabel);
    setText("[data-detail-rating]", formatScore(work.rating));
    setText("[data-detail-author]", work.author);
    setText("[data-detail-artist]", work.artist);
    setText("[data-detail-publisher]", work.publisher);
    setText("[data-detail-genres]", (work.genres || []).join(", "));

    const cover = document.querySelector("[data-detail-cover]");
    if (cover) {
      cover.src = work.image;
      cover.alt = `Portada de ${work.title}`;
    }

    const chips = document.querySelector("[data-detail-chips]");
    if (chips) {
      chips.innerHTML = [
        `<span class="yv-chip yv-chip--accent">${escapeHtml(work.type)}</span>`,
        ...(work.genres || []).map((genre) => `<span class="yv-chip">${escapeHtml(genre)}</span>`)
      ].join("");
    }

    const favorite = document.querySelector("[data-detail-favorite]");
    if (favorite) favorite.dataset.favorite = work.id;

    const chapters = byId("chapter-list");
    if (chapters) {
      const last = Math.max(Number(work.chapters) || 6, 6);
      chapters.innerHTML = Array.from({ length: 6 }, (_, index) => {
        const number = last - index;
        return `
          <article class="yv-chapter">
            <span class="yv-chapter__number">Cap. ${number}</span>
            <strong>${index === 0 ? "Último capítulo registrado" : `Capítulo ${number}`}</strong>
            <time>${escapeHtml(data.updatedAt || "")}</time>
          </article>
        `;
      }).join("");
    }

    const related = byId("related-grid");
    if (related) {
      related.innerHTML = data.works
        .filter(
          (candidate) =>
            candidate.id !== work.id &&
            (candidate.type === work.type ||
              candidate.genres?.some((genre) => work.genres?.includes(genre)))
        )
        .slice(0, 3)
        .map((candidate) => bookCard(candidate))
        .join("");
    }

    syncFavoriteButtons();
  };

  const initDetail = () => {
    if (!document.querySelector("[data-detail-page]")) return;
    const requested = new URLSearchParams(window.location.search).get("id");
    const work = workById(requested) || data.works[0];
    renderDetail(work);

    document.querySelector("[data-add-collection]")?.addEventListener("click", () => {
      showToast(`${work.title} se ha añadido a tu colección.`);
    });
  };

  const renderComments = () => {
    const list = byId("asian-comments-list");
    if (!list) return;
    list.innerHTML = data.comments
      .map(
        (comment, index) => `
          <article class="yv-note">
            <span class="yv-note__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <div class="yv-note__content">
              <div class="yv-note__meta">
                <strong>${escapeHtml(comment.title || workById(comment.workId)?.title || "")}</strong>
                <time datetime="${escapeHtml(comment.date)}">${escapeHtml(formatDate(comment.date))}</time>
              </div>
              <blockquote>“${escapeHtml(comment.text)}”</blockquote>
              <div class="yv-note__rating" aria-label="Valoración: ${formatScore(comment.rating)} de 10">
                <span class="yv-note__stars" aria-hidden="true">${ratingStars(comment.rating)}</span>
                <strong>${formatScore(comment.rating)} / 10</strong>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  };

  const initCollection = () => {
    const grid = byId("collection-grid");
    if (!grid) return;
    const buttons = [...document.querySelectorAll("[data-collection-filter]")];
    const empty = byId("collection-empty");

    const render = (filter = "Todos") => {
      const entries = data.collection.filter(
        (entry) => filter === "Todos" || entry.state === filter
      );
      grid.innerHTML = entries
        .map((entry) => bookCard(workById(entry.workId), entry))
        .join("");
      grid.hidden = !entries.length;
      empty.hidden = Boolean(entries.length);
      syncFavoriteButtons();
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((candidate) =>
          candidate.setAttribute("aria-pressed", String(candidate === button))
        );
        render(button.dataset.collectionFilter);
      });
    });

    const stats = document.querySelectorAll(".yv-stat-box strong");
    if (stats.length >= 4) {
      stats[0].textContent = String(data.collection.length).padStart(2, "0");
      stats[1].textContent = String(data.collection.filter((entry) => entry.state === "En progreso").length).padStart(2, "0");
      stats[2].textContent = String(data.collection.filter((entry) => entry.state === "Completado").length).padStart(2, "0");
      stats[3].textContent = String(data.collection.filter((entry) => entry.state === "Pendiente").length).padStart(2, "0");
    }

    render();
    renderComments();
  };

  const showDataError = () => {
    ["featured-grid", "latest-grid", "catalog-grid", "collection-grid", "asian-comments-list"]
      .map(byId)
      .filter(Boolean)
      .forEach((target) => {
        target.innerHTML = `
          <div class="data-error">
            <strong>No se pudieron cargar los datos.</strong>
            <span>Comprueba el archivo data/asiaticos.json y abre la web desde un servidor local.</span>
          </div>
        `;
      });
  };

  const start = async () => {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`No se pudo cargar ${DATA_URL}`);
      data = await response.json();
      data.home ||= {};
      data.works ||= [];
      data.collection ||= [];
      data.comments ||= [];

      initFavorites();
      initHome();
      initExplorer();
      initDetail();
      initCollection();
      syncFavoriteButtons();
    } catch (error) {
      console.error(error);
      showDataError();
    }
  };

  document.addEventListener("DOMContentLoaded", start);
})();

/* Blog: contenido cargado desde data/blog.json. */

(function () {
  "use strict";

  const root = document.body.dataset.root || "../";
  let data;

  function articleCard(article, featured = false) {
    return `
      <article class="hub-article-card ${featured ? "hub-article-card--featured" : ""}">
        <a class="hub-article-card__media" href="articulo.html?id=${encodeURIComponent(article.id)}">
          <img src="${Yume.escapeHtml(article.image)}" alt="${Yume.escapeHtml(article.title)}" loading="lazy" width="960" height="540">
          <span>${Yume.escapeHtml(article.category)}</span>
        </a>
        <div class="hub-article-card__body">
          <p class="hub-meta">${Yume.formatDate(article.date)} · ${article.readTime} min</p>
          <h3><a href="articulo.html?id=${encodeURIComponent(article.id)}">${Yume.escapeHtml(article.title)}</a></h3>
          <p>${Yume.escapeHtml(article.excerpt)}</p>
          <div class="hub-card-actions">
            <a class="hub-text-link" href="articulo.html?id=${encodeURIComponent(article.id)}">Leer artículo →</a>
            ${YumeFavorites.button("blog", article.id, "Guardar artículo")}
          </div>
        </div>
      </article>`;
  }

  function collectionButton(id) {
    const active = YumeverseStorage.list("blog").includes(id);
    return `<button class="button button--ghost ${active ? "is-active" : ""}" type="button"
      data-collection data-collection-section="blog" data-id="${Yume.escapeHtml(id)}"
      aria-pressed="${active}"><span data-collection-label>${active ? "Guardado" : "Guardar"}</span></button>`;
  }

  function renderHome() {
    const featured = document.querySelector("[data-blog-featured]");
    const latest = document.querySelector("[data-blog-latest]");
    const popular = document.querySelector("[data-blog-popular]");
    if (featured) featured.innerHTML = data.articles.filter((item) => item.featured).slice(0, 3).map((item) => articleCard(item, true)).join("");
    if (latest) latest.innerHTML = [...data.articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map(articleCard).join("");
    if (popular) popular.innerHTML = data.articles.filter((item) => item.popular).slice(0, 4).map((item, index) => `
      <a class="hub-ranked" href="articulo.html?id=${encodeURIComponent(item.id)}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${Yume.escapeHtml(item.title)}</strong>
        <small>${item.readTime} min</small>
      </a>`).join("");
  }

  function renderExplorer() {
    const form = document.querySelector("[data-blog-filters]");
    const grid = document.querySelector("[data-blog-grid]");
    const count = document.querySelector("[data-blog-count]");
    if (!form || !grid) return;
    const params = Yume.query();
    const queryInput = form.querySelector("[name=q]");
    const categoryInput = form.querySelector("[name=categoria]");
    if (params.get("q")) queryInput.value = params.get("q");
    if (params.get("categoria")) categoryInput.value = params.get("categoria");

    function update() {
      const q = queryInput.value.trim().toLocaleLowerCase("es");
      const category = categoryInput.value;
      const order = form.querySelector("[name=orden]").value;
      let items = data.articles.filter((item) => {
        const haystack = [item.title, item.excerpt, item.subCategory, ...(item.tags || [])].join(" ").toLocaleLowerCase("es");
        return (!q || haystack.includes(q)) && (category === "todos" || item.category.toLocaleLowerCase("es") === category);
      });
      items.sort((a, b) => {
        if (order === "popular") return Number(b.popular) - Number(a.popular) || b.date.localeCompare(a.date);
        if (order === "lectura") return a.readTime - b.readTime;
        return b.date.localeCompare(a.date);
      });
      count.textContent = `${items.length} artículo${items.length === 1 ? "" : "s"}`;
      if (!items.length) {
        Yume.setStatus(grid, "empty", "No encontramos artículos", "Cambia la búsqueda o limpia los filtros.");
        return;
      }
      grid.innerHTML = items.map(articleCard).join("");
    }

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("reset", () => window.setTimeout(update));
    update();
  }

  async function renderCollection() {
    const grid = document.querySelector("[data-blog-collection]");
    if (!grid) return;
    await YumeCollection.seed();
    const saved = new Set(YumeverseStorage.list("blog"));
    const items = data.articles.filter((item) => saved.has(item.id));
    const stats = document.querySelector("[data-blog-stats]");
    if (stats) {
      stats.innerHTML = `
        <div><strong>${items.length}</strong><span>Guardados</span></div>
        <div><strong>${items.filter((item) => item.category === "Anime").length}</strong><span>Anime</span></div>
        <div><strong>${items.filter((item) => item.category === "Arte").length}</strong><span>Arte</span></div>
        <div><strong>${data.comments?.length || 0}</strong><span>Notas</span></div>`;
    }
    if (!items.length) {
      Yume.setStatus(grid, "empty", "Tu biblioteca está esperando", "Guarda artículos desde el explorador para encontrarlos aquí.");
    } else {
      grid.innerHTML = items.map(articleCard).join("");
    }
    const notes = document.querySelector("[data-blog-notes]");
    if (notes) {
      notes.innerHTML = (data.comments || []).map((note, index) => {
        const article = data.articles.find((item) => item.id === note.articleId);
        return `
          <article class="hub-comment">
            <span class="hub-comment__number">${String(index + 1).padStart(2, "0")}</span>
            <div class="hub-comment__head"><strong>${Yume.escapeHtml(article?.title || "Nota personal")}</strong><time>${Yume.formatDate(note.date)}</time></div>
            <p>“${Yume.escapeHtml(note.text)}”</p>
            ${Yume.stars(note.rating)}
          </article>`;
      }).join("");
    }
  }

  function renderArticle() {
    const shell = document.querySelector("[data-blog-article]");
    if (!shell) return;
    const article = data.articles.find((item) => item.id === Yume.query().get("id")) || data.articles[0];
    document.title = `${article.title} | Yumeverse`;
    shell.innerHTML = `
      <header class="hub-article-hero">
        <img src="${Yume.escapeHtml(article.image)}" alt="${Yume.escapeHtml(article.title)}" width="1600" height="900">
        <div class="hub-article-hero__veil"></div>
        <div class="container hub-article-hero__content">
          <p class="hub-kicker">${Yume.escapeHtml(article.category)} · ${Yume.escapeHtml(article.subCategory)}</p>
          <h1>${Yume.escapeHtml(article.title)}</h1>
          <p>${Yume.escapeHtml(article.excerpt)}</p>
          <div class="hub-article-byline"><span>Por ${Yume.escapeHtml(article.author)}</span><time>${Yume.formatDate(article.date)}</time><span>${article.readTime} min de lectura</span></div>
        </div>
      </header>
      <div class="container hub-article-layout">
        <article class="hub-prose">
          ${article.content.map((section) => `
            <section><h2>${Yume.escapeHtml(section.heading)}</h2>
            ${section.paragraphs.map((paragraph) => `<p>${Yume.escapeHtml(paragraph)}</p>`).join("")}</section>`).join("")}
          <footer class="hub-article-tags">${article.tags.map((tag) => `<span>#${Yume.escapeHtml(tag)}</span>`).join("")}</footer>
        </article>
        <aside class="hub-article-aside">
          <strong>Guarda esta lectura</strong>
          <p>Consérvala en tu colección personal o márcala como favorita.</p>
          ${collectionButton(article.id)}
          ${YumeFavorites.button("blog", article.id, "Marcar artículo como favorito")}
          <a class="hub-text-link" href="explorador.html">Volver al blog →</a>
        </aside>
      </div>
      <section class="section section--dark"><div class="container">
        <header class="hub-section-head"><div><p class="hub-kicker">Sigue leyendo</p><h2>Artículos relacionados</h2></div></header>
        <div class="hub-article-grid">${data.articles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 3).map(articleCard).join("")}</div>
      </div></section>`;
    YumeCollection.refresh();
  }

  async function init() {
    if (!document.body.dataset.view?.startsWith("blog")) return;
    const target = document.querySelector("[data-blog-grid], [data-blog-featured], [data-blog-collection], [data-blog-article]");
    if (target) Yume.setStatus(target, "loading", "Abriendo el cuaderno", "Cargando artículos desde blog.json.");
    try {
      data = await Yume.loadJSON(`${root}data/blog.json`);
      const view = document.body.dataset.view;
      if (view === "blog-home") renderHome();
      if (view === "blog-explorer") renderExplorer();
      if (view === "blog-collection") await renderCollection();
      if (view === "blog-article") renderArticle();
    } catch {
      Yume.setStatus(target, "error", "No se pudo cargar el blog", "Comprueba data/blog.json y abre la web desde un servidor.");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("yumeverse:collection", (event) => {
    if (event.detail.section === "blog" && document.body.dataset.view === "blog-collection") renderCollection();
  });
})();

/* Inicio: novedades y estadísticas calculadas desde data/*.json. */

(function () {
  "use strict";

  const sources = [
    {
      key: "anime",
      label: "Anime",
      path: "data/anime.json",
      list: "works",
      href: (item) => `anime/detalle.html?id=${encodeURIComponent(item.id)}`,
      tag: (item) => `Anime · ${item.type || "Expediente"}`,
    },
    {
      key: "asiaticos",
      label: "Asiáticos",
      path: "data/asiaticos.json",
      list: "works",
      href: (item) => `asiaticos/detalle.html?id=${encodeURIComponent(item.id)}`,
      tag: (item) => `${item.type || "Lectura"} · Nueva ficha`,
    },
    {
      key: "blog",
      label: "Blog",
      path: "data/blog.json",
      list: "articles",
      href: (item) => `blog/articulo.html?id=${encodeURIComponent(item.id)}`,
      tag: (item) => `Blog · ${item.category || "Artículo"}`,
    },
    {
      key: "galeria",
      label: "Galería",
      path: "data/galeria.json",
      list: "works",
      href: (item) => `galeria/obra.html?id=${encodeURIComponent(item.id)}`,
      tag: (item) => `Galería · ${item.category || "Obra"}`,
    },
  ];

  const cleanImage = (value = "") => value.replace(/^(\.\.\/)+/, "");

  function newestItem(source, data) {
    const items = [...(data[source.list] || [])];
    const preferredId = data.home?.latest?.[0];
    const preferred = preferredId && items.find((item) => item.id === preferredId);
    const dated = items
      .filter((item) => item.date || item.updatedAt)
      .sort((a, b) => String(b.updatedAt || b.date).localeCompare(String(a.updatedAt || a.date)));
    const item = dated[0] || preferred || items[0];
    if (!item) return null;
    return {
      ...item,
      source,
      publishedAt: item.updatedAt || item.date || data.updatedAt || "",
    };
  }

  function updateText(item) {
    const text = item.excerpt || item.description || item.summary || item.synopsis || "";
    return text.length > 132 ? `${text.slice(0, 129).trim()}…` : text;
  }

  function renderUpdates(loaded) {
    const container = document.querySelector("[data-home-updates]");
    if (!container) return;
    const items = loaded
      .map(({ source, data }) => newestItem(source, data))
      .filter(Boolean)
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

    if (!items.length) {
      Yume.setStatus(container, "empty", "Aún no hay novedades", "Añade contenido a los JSON de cada sección.");
      return;
    }

    container.innerHTML = items.map((item, index) => `
      <a class="update-card ${index === 0 ? "update-card--feature" : "update-card--standard"}"
        href="${item.source.href(item)}">
        <img src="${Yume.escapeHtml(cleanImage(item.image || item.portada || ""))}"
          alt="${Yume.escapeHtml(item.title || item.titulo || item.source.label)}"
          loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
        <span class="update-card__veil"></span>
        <div class="update-card__content">
          <span class="tag">${Yume.escapeHtml(item.source.tag(item))}</span>
          <h3>${Yume.escapeHtml(item.title || item.titulo || "Nueva incorporación")}</h3>
          <p>${Yume.escapeHtml(updateText(item))}</p>
          <small>${item.publishedAt ? Yume.formatDate(item.publishedAt) : "Añadido recientemente"}</small>
          <strong>Descubrir <span aria-hidden="true">→</span></strong>
        </div>
      </a>`).join("");
  }

  function storedList(section, defaults) {
    try {
      const key = YumeverseStorage.KEYS[section];
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaults;
    } catch {
      return defaults;
    }
  }

  function renderStats(loaded, initialCollection) {
    const catalogued = loaded.reduce(
      (total, { source, data }) => total + (data[source.list] || []).length,
      0,
    );
    const files = loaded
      .filter(({ source }) => source.key === "anime" || source.key === "asiaticos")
      .reduce((total, { source, data }) => total + (data[source.list] || []).length, 0);
    const saved = ["anime", "asiaticos", "blog", "galeria"]
      .reduce((total, section) => total + storedList(section, initialCollection[section] || []).length, 0);
    const progress = catalogued ? Math.min(100, Math.round((saved / catalogued) * 100)) : 0;

    document.querySelector("[data-stat-catalogued]").textContent = String(catalogued);
    document.querySelector("[data-stat-files]").textContent = String(files);
    document.querySelector("[data-stat-saved]").textContent = String(saved);
    document.querySelector("[data-stat-progress]").textContent = `${progress}%`;
    document.querySelector("[data-stat-progress-bar]").style.width = `${progress}%`;
  }

  async function initHome() {
    if (document.body.dataset.view !== "home") return;
    const updates = document.querySelector("[data-home-updates]");
    try {
      const [loaded, initialCollection] = await Promise.all([
        Promise.all(sources.map(async (source) => ({
          source,
          data: await Yume.loadJSON(source.path),
        }))),
        Yume.loadJSON("data/coleccion-inicial.json"),
      ]);
      renderUpdates(loaded);
      const refreshStats = () => renderStats(loaded, initialCollection);
      refreshStats();
      window.addEventListener("yumeverse:collection", refreshStats);
      window.addEventListener("yumeverse:favorites", refreshStats);
      window.addEventListener("storage", refreshStats);
    } catch {
      Yume.setStatus(
        updates,
        "error",
        "No se pudieron preparar las novedades",
        "Comprueba los JSON de Anime, Asiáticos, Blog y Galería.",
      );
    }
  }

  document.addEventListener("DOMContentLoaded", initHome);
})();

