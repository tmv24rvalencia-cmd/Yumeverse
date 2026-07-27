(() => {
  "use strict";

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
      if (Array.isArray(saved)) return new Set(saved);
    } catch {
      // Se usarán los favoritos iniciales del JSON.
    }
    return new Set(data.works.filter((work) => work.favorite).map((work) => work.id));
  };

  const saveFavorites = (favorites) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
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
    if (episodeList) {
      const total = Math.max(1, Number(work.episodes) || 1);
      episodeList.innerHTML = Array.from({ length: Math.min(6, total) }, (_, index) => {
        const episode = total - index;
        return `<li><span>Episodio ${episode}</span><strong>${escapeHtml(work.title)}</strong></li>`;
      }).join("");
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
    ["anime-home-featured", "anime-grid", "collection-grid", "anime-comments-list"]
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
