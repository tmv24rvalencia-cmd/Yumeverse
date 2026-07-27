(() => {
  "use strict";

  const page = document.body.dataset.page;
  const FAVORITES_KEY = "yumeverse-favorites";
  const COLLECTION_OVERRIDES_KEY = "yumeverse-collection-overrides";
  const COLLECTION_REMOVED_KEY = "yumeverse-collection-removed";

  const normalize = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const readStorage = (key, fallback) => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved ?? fallback;
    } catch {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // La página sigue funcionando aunque el navegador bloquee localStorage.
    }
  };

  const fetchJson = async (path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
    return response.json();
  };

  const statusText = {
    emision: "En emisión",
    finalizado: "Finalizado",
    viendo: "Viendo",
    completado: "Completado",
    pendiente: "Pendiente",
    pausado: "En pausa"
  };

  const collectionStatusClass = {
    viendo: "collection-card__status--watching",
    completado: "collection-card__status--completed",
    pendiente: "collection-card__status--pending",
    pausado: "collection-card__status--paused"
  };

  const formatRating = (rating) => {
    if (!rating) return "Sin valorar";
    return Number(rating).toFixed(Number(rating) % 1 === 0 ? 0 : 1);
  };

  const favoriteIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"></path>
    </svg>
  `;

  const attachImageFallbacks = (root) => {
    root.querySelectorAll("img").forEach((image) => {
      image.addEventListener(
        "error",
        () => {
          image.hidden = true;
          image.parentElement?.classList.add("is-missing-image");
        },
        { once: true }
      );
    });
  };

  const loadFavorites = (items) => {
    const saved = readStorage(FAVORITES_KEY, null);
    if (saved === null) {
      const initial = items.filter((item) => item.favorite).map((item) => item.id);
      writeStorage(FAVORITES_KEY, initial);
      return new Set(initial);
    }
    return new Set(saved);
  };

  const toggleFavorite = (id, button, favoriteIds) => {
    if (favoriteIds.has(id)) favoriteIds.delete(id);
    else favoriteIds.add(id);

    const active = favoriteIds.has(id);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute(
      "aria-label",
      `${active ? "Eliminar" : "Añadir"} ${button.dataset.title || "anime"} ${
        active ? "de" : "a"
      } favoritos`
    );
    writeStorage(FAVORITES_KEY, [...favoriteIds]);
  };

  const bindFavoriteButtons = (root, favoriteIds) => {
    root.querySelectorAll("[data-favorite-id]").forEach((button) => {
      button.addEventListener("click", () =>
        toggleFavorite(button.dataset.favoriteId, button, favoriteIds)
      );
    });
  };

  const animeCardTemplate = (item, favoriteIds) => {
    const isFavorite = favoriteIds.has(item.id);
    const statusClass = item.status === "emision" ? "anime-card__status--airing" : "";
    const episodeLabel =
      item.type === "Película"
        ? `${item.minutes || 100} minutos`
        : `${item.episodes} episodios`;

    return `
      <article class="anime-card" data-anime-id="${escapeHtml(item.id)}">
        <a
          class="anime-card__image"
          href="detalle.html?id=${encodeURIComponent(item.id)}"
          aria-label="Ver expediente de ${escapeHtml(item.title)}"
        >
          <img
            src="${escapeHtml(item.image)}"
            alt="Portada de ${escapeHtml(item.title)}"
            loading="lazy"
          >
          <span class="anime-card__overlay"></span>
          <span class="anime-card__status ${statusClass}">
            ${escapeHtml(statusText[item.status] || item.status)}
          </span>
          <span class="anime-card__rating"><span aria-hidden="true">★</span>${formatRating(item.rating)}</span>
        </a>
        <div class="anime-card__body">
          <div class="anime-card__topline">
            <span>${escapeHtml(item.type)}</span>
            <span>${item.year}</span>
            <span>${escapeHtml(episodeLabel)}</span>
          </div>
          <h3><a href="detalle.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="anime-card__genres">
            ${item.genres
              .slice(0, 2)
              .map(
                (genre) =>
                  `<button type="button" data-genre-link="${escapeHtml(genre)}">${escapeHtml(genre)}</button>`
              )
              .join("")}
          </div>
          <div class="anime-card__actions">
            <a class="anime-card__detail" href="detalle.html?id=${encodeURIComponent(item.id)}">
              Ver expediente <span aria-hidden="true">→</span>
            </a>
            <button
              class="favorite-button ${isFavorite ? "is-active" : ""}"
              type="button"
              data-favorite-id="${escapeHtml(item.id)}"
              data-title="${escapeHtml(item.title)}"
              aria-label="${isFavorite ? "Eliminar" : "Añadir"} ${escapeHtml(item.title)} ${
                isFavorite ? "de" : "a"
              } favoritos"
              aria-pressed="${isFavorite}"
            >${favoriteIcon}</button>
          </div>
        </div>
      </article>
    `;
  };

  const setupGlobalSearch = () => {
    const form = document.getElementById("global-search-form");
    const input = document.getElementById("global-search");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input?.value.trim() || "";
      window.location.href = `explorador.html${query ? `?q=${encodeURIComponent(query)}` : ""}`;
    });
  };

  const initExplorer = async () => {
    const grid = document.getElementById("anime-grid");
    if (!grid) return;

    const items = await fetchJson("../data/anime-explorador.json");
    const favoriteIds = loadFavorites(items);
    const form = document.getElementById("explorer-filters");
    const search = document.getElementById("anime-search");
    const genre = document.getElementById("filter-genre");
    const format = document.getElementById("filter-format");
    const status = document.getElementById("filter-status");
    const year = document.getElementById("filter-year");
    const rating = document.getElementById("filter-rating");
    const ratingOutput = document.getElementById("rating-output");
    const sort = document.getElementById("sort-anime");
    const activeFilters = document.getElementById("active-filters");
    const empty = document.getElementById("explorer-empty");
    const pagination = document.getElementById("pagination");
    const count = document.getElementById("anime-count");
    const pageSize = 9;
    let currentPage = 1;

    [...new Set(items.flatMap((item) => item.genres))]
      .sort((a, b) => a.localeCompare(b, "es"))
      .forEach((value) => {
        genre.insertAdjacentHTML(
          "beforeend",
          `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`
        );
      });

    [...new Set(items.map((item) => item.year))]
      .sort((a, b) => b - a)
      .forEach((value) => {
        year.insertAdjacentHTML("beforeend", `<option value="${value}">${value}</option>`);
      });

    document.getElementById("catalog-total").textContent = items.length;
    document.getElementById("catalog-genres").textContent = new Set(
      items.flatMap((item) => item.genres)
    ).size;
    document.getElementById("catalog-new").textContent = items.filter(
      (item) => item.year >= 2021
    ).length;

    const query = new URLSearchParams(window.location.search).get("q");
    if (query) {
      search.value = query;
      const globalSearch = document.getElementById("global-search");
      if (globalSearch) globalSearch.value = query;
    }

    const selectedCollectionStates = () =>
      [...form.querySelectorAll('input[name="collection-state"]:checked')].map(
        (input) => input.value
      );

    const currentFilters = () => ({
      search: search.value.trim(),
      genre: genre.value,
      format: format.value,
      status: status.value,
      year: year.value,
      rating: Number(rating.value),
      collectionStates: selectedCollectionStates()
    });

    const filterItems = () => {
      const filters = currentFilters();
      const term = normalize(filters.search);

      return items.filter((item) => {
        const searchable = normalize(
          [item.title, item.description, ...item.genres].join(" ")
        );
        const matchesCollection =
          filters.collectionStates.length === 0 ||
          filters.collectionStates.some((state) =>
            state === "favorito"
              ? favoriteIds.has(item.id)
              : item.collectionStatus === state
          );

        return (
          (!term || searchable.includes(term)) &&
          (!filters.genre || item.genres.includes(filters.genre)) &&
          (!filters.format || item.type === filters.format) &&
          (!filters.status || item.status === filters.status) &&
          (!filters.year || item.year === Number(filters.year)) &&
          item.rating >= filters.rating &&
          matchesCollection
        );
      });
    };

    const sortItems = (filtered) => {
      const result = [...filtered];
      if (sort.value === "rating-desc") result.sort((a, b) => b.rating - a.rating);
      else if (sort.value === "year-desc") result.sort((a, b) => b.year - a.year);
      else if (sort.value === "title-asc")
        result.sort((a, b) => a.title.localeCompare(b.title, "es"));
      else result.sort((a, b) => b.recommended - a.recommended);
      return result;
    };

    const renderActiveFilters = () => {
      const filters = currentFilters();
      const labels = [];
      if (filters.search) labels.push(`Búsqueda: ${filters.search}`);
      if (filters.genre) labels.push(filters.genre);
      if (filters.format) labels.push(filters.format);
      if (filters.status) labels.push(statusText[filters.status]);
      if (filters.year) labels.push(filters.year);
      if (filters.rating) labels.push(`Desde ${filters.rating} ★`);
      filters.collectionStates.forEach((state) =>
        labels.push(state === "favorito" ? "Favoritos" : statusText[state])
      );

      activeFilters.innerHTML = (labels.length ? labels : ["Todos los animes"])
        .map((label) => `<span class="active-filter">${escapeHtml(label)}</span>`)
        .join("");
    };

    const renderPagination = (totalPages) => {
      if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
      }

      pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return `
          <button
            type="button"
            data-page-number="${pageNumber}"
            class="${pageNumber === currentPage ? "is-active" : ""}"
            ${pageNumber === currentPage ? 'aria-current="page"' : ""}
          >${pageNumber}</button>
        `;
      }).join("");

      pagination.querySelectorAll("[data-page-number]").forEach((button) => {
        button.addEventListener("click", () => {
          currentPage = Number(button.dataset.pageNumber);
          render();
          document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
        });
      });
    };

    const render = () => {
      const filtered = sortItems(filterItems());
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      if (currentPage > totalPages) currentPage = 1;
      const start = (currentPage - 1) * pageSize;
      const visible = filtered.slice(start, start + pageSize);

      count.textContent = `${filtered.length} ${filtered.length === 1 ? "título" : "títulos"}`;
      grid.innerHTML = visible.map((item) => animeCardTemplate(item, favoriteIds)).join("");
      empty.hidden = filtered.length > 0;
      grid.hidden = filtered.length === 0;
      renderActiveFilters();
      renderPagination(totalPages);
      attachImageFallbacks(grid);
      bindFavoriteButtons(grid, favoriteIds);

      grid.querySelectorAll("[data-genre-link]").forEach((button) => {
        button.addEventListener("click", () => {
          genre.value = button.dataset.genreLink;
          currentPage = 1;
          render();
        });
      });
    };

    const updateRatingOutput = () => {
      ratingOutput.value = Number(rating.value)
        ? `${Number(rating.value).toFixed(1)} ★`
        : "Cualquiera";
      ratingOutput.textContent = ratingOutput.value;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      currentPage = 1;
      render();
    });

    [search, genre, format, status, year, rating, sort].forEach((control) => {
      control.addEventListener(control === search ? "input" : "change", () => {
        if (control === rating) updateRatingOutput();
        currentPage = 1;
        render();
      });
    });

    form.querySelectorAll('input[name="collection-state"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        currentPage = 1;
        render();
      });
    });

    document.getElementById("clear-filters").addEventListener("click", () => {
      form.reset();
      search.value = "";
      rating.value = "0";
      sort.value = "recommended";
      updateRatingOutput();
      currentPage = 1;
      render();
    });

    updateRatingOutput();
    render();
  };

  const collectionCardTemplate = (item, favoriteIds) => {
    const isFavorite = favoriteIds.has(item.id);
    const progress = item.episodes
      ? Math.min(100, Math.round((item.watched / item.episodes) * 100))
      : 0;
    const completed = item.status === "completado";
    const ratingMarkup = item.rating
      ? `<span aria-hidden="true">★</span><strong>${formatRating(item.rating)}</strong><small>Mi valoración</small>`
      : `<span aria-hidden="true">☆</span><strong>Sin valorar</strong>`;
    const actionLabel =
      item.status === "pendiente"
        ? "Comenzar a ver"
        : completed
          ? "Ver expediente"
          : "Continuar viendo";

    return `
      <article
        class="collection-card"
        data-collection-item
        data-id="${escapeHtml(item.id)}"
        data-title="${escapeHtml(item.title)}"
        data-status="${escapeHtml(item.status)}"
      >
        <div class="collection-card__visual">
          <a href="detalle.html?id=${encodeURIComponent(item.id)}">
            <img src="${escapeHtml(item.image)}" alt="Portada de ${escapeHtml(item.title)}" loading="lazy">
          </a>
          <span class="collection-card__status ${collectionStatusClass[item.status] || ""}">
            ${escapeHtml(statusText[item.status] || item.status)}
          </span>
          <button
            class="favorite-button ${isFavorite ? "is-active" : ""}"
            type="button"
            data-favorite-id="${escapeHtml(item.id)}"
            data-title="${escapeHtml(item.title)}"
            aria-label="${isFavorite ? "Eliminar" : "Añadir"} ${escapeHtml(item.title)} ${
              isFavorite ? "de" : "a"
            } favoritos"
            aria-pressed="${isFavorite}"
          >${favoriteIcon}</button>
        </div>
        <div class="collection-card__content">
          <div class="collection-card__meta">
            <span>${escapeHtml(item.type)}</span>
            <span>${item.year}</span>
            <span>${item.episodes} episodios</span>
          </div>
          <h3><a href="detalle.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a></h3>
          <div class="collection-card__rating ${item.rating ? "" : "collection-card__rating--empty"}">
            ${ratingMarkup}
          </div>
          <div class="collection-card__progress">
            <div>
              <span>Progreso</span>
              <strong>${completed ? "Completado" : `${item.watched} / ${item.episodes} episodios`}</strong>
            </div>
            <div
              class="progress-bar ${completed ? "progress-bar--completed" : ""}"
              role="progressbar"
              aria-label="${item.watched} de ${item.episodes} episodios vistos"
              aria-valuemin="0"
              aria-valuemax="${item.episodes}"
              aria-valuenow="${item.watched}"
            ><span style="width:${progress}%"></span></div>
          </div>
          <div class="collection-card__actions">
            <a class="collection-card__continue" href="detalle.html?id=${encodeURIComponent(item.id)}">
              ${actionLabel} <span aria-hidden="true">→</span>
            </a>
            <button
              class="collection-card__menu"
              type="button"
              aria-label="Opciones de ${escapeHtml(item.title)}"
              data-collection-menu="${escapeHtml(item.id)}"
            ><span></span><span></span><span></span></button>
          </div>
        </div>
      </article>
    `;
  };

  const initCollection = async () => {
    const grid = document.getElementById("collection-grid");
    if (!grid) return;

    const [sourceItems, explorerItems] = await Promise.all([
      fetchJson("../data/anime-mi-coleccion.json"),
      fetchJson("../data/anime-explorador.json")
    ]);
    const favoriteIds = loadFavorites([...sourceItems, ...explorerItems]);
    const overrides = readStorage(COLLECTION_OVERRIDES_KEY, {});
    const removedIds = new Set(readStorage(COLLECTION_REMOVED_KEY, []));
    let items = sourceItems
      .filter((item) => !removedIds.has(item.id))
      .map((item) => ({ ...item, status: overrides[item.id] || item.status }));
    let currentFilter = "todos";
    let activeMenuId = null;

    const search = document.getElementById("collection-search");
    const sort = document.getElementById("collection-sort");
    const empty = document.getElementById("collection-empty");
    const popover = document.getElementById("collection-menu-popover");

    const updateSummary = () => {
      const totalEpisodes = items.reduce((sum, item) => sum + item.episodes, 0);
      const watchedEpisodes = items.reduce((sum, item) => sum + item.watched, 0);
      const progress = totalEpisodes
        ? Math.round((watchedEpisodes / totalEpisodes) * 100)
        : 0;
      const ratings = items.filter((item) => item.rating).map((item) => item.rating);
      const averageRating = ratings.length
        ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
        : 0;

      document.getElementById("overview-total").textContent = items.length;
      document.getElementById("overview-progress").textContent = `${progress}%`;
      document.getElementById("overview-progress-bar").style.width = `${progress}%`;
      document.getElementById("overview-episodes").textContent = watchedEpisodes;
      document.getElementById("overview-time").textContent = `${Math.round(
        (watchedEpisodes * 24) / 60
      )} h`;
      document.getElementById("overview-rating").textContent = averageRating.toFixed(1);

      ["viendo", "completado", "pendiente", "pausado"].forEach((status) => {
        const value = items.filter((item) => item.status === status).length;
        document.querySelector(`[data-stat="${status}"]`).textContent = value;
        document.querySelector(`[data-tab-count="${status}"]`).textContent = value;
      });
      document.querySelector('[data-tab-count="todos"]').textContent = items.length;
    };

    const filteredAndSortedItems = () => {
      const term = normalize(search.value);
      const filtered = items.filter(
        (item) =>
          (currentFilter === "todos" || item.status === currentFilter) &&
          (!term || normalize(item.title).includes(term))
      );

      if (sort.value === "title-asc")
        filtered.sort((a, b) => a.title.localeCompare(b.title, "es"));
      else if (sort.value === "title-desc")
        filtered.sort((a, b) => b.title.localeCompare(a.title, "es"));
      else if (sort.value === "rating-desc")
        filtered.sort((a, b) => b.rating - a.rating);
      else if (sort.value === "progress-desc")
        filtered.sort(
          (a, b) => b.watched / b.episodes - a.watched / a.episodes
        );
      else if (sort.value === "year-desc") filtered.sort((a, b) => b.year - a.year);
      else
        filtered.sort(
          (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
      return filtered;
    };

    const closePopover = () => {
      popover.hidden = true;
      activeMenuId = null;
    };

    const openPopover = (button, id) => {
      const rect = button.getBoundingClientRect();
      const width = 210;
      popover.style.left = `${Math.min(window.innerWidth - width - 12, rect.right - width)}px`;
      popover.style.top = `${Math.min(
        window.innerHeight - popover.offsetHeight - 12,
        rect.bottom + 8
      )}px`;
      popover.hidden = false;
      activeMenuId = id;
    };

    const bindCollectionMenus = () => {
      grid.querySelectorAll("[data-collection-menu]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const id = button.dataset.collectionMenu;
          if (!popover.hidden && activeMenuId === id) closePopover();
          else openPopover(button, id);
        });
      });
    };

    const render = () => {
      const visible = filteredAndSortedItems();
      grid.innerHTML = visible
        .map((item) => collectionCardTemplate(item, favoriteIds))
        .join("");
      grid.hidden = visible.length === 0;
      empty.hidden = visible.length > 0;
      attachImageFallbacks(grid);
      bindFavoriteButtons(grid, favoriteIds);
      bindCollectionMenus();
      updateSummary();
    };

    document.querySelectorAll("[data-collection-filter]").forEach((tab) => {
      tab.addEventListener("click", () => {
        currentFilter = tab.dataset.collectionFilter;
        document.querySelectorAll("[data-collection-filter]").forEach((button) => {
          const active = button === tab;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-selected", String(active));
        });
        render();
      });
    });

    search.addEventListener("input", render);
    sort.addEventListener("change", render);

    document.getElementById("clear-collection-filters").addEventListener("click", () => {
      currentFilter = "todos";
      search.value = "";
      sort.value = "recent";
      document.querySelectorAll("[data-collection-filter]").forEach((button) => {
        const active = button.dataset.collectionFilter === "todos";
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      render();
    });

    popover.querySelectorAll("[data-collection-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!activeMenuId) return;
        const action = button.dataset.collectionAction;
        if (action === "remove") {
          removedIds.add(activeMenuId);
          items = items.filter((item) => item.id !== activeMenuId);
          writeStorage(COLLECTION_REMOVED_KEY, [...removedIds]);
        } else {
          const nextStatus =
            action === "completed"
              ? "completado"
              : action === "pending"
                ? "pendiente"
                : "pausado";
          overrides[activeMenuId] = nextStatus;
          items = items.map((item) =>
            item.id === activeMenuId
              ? {
                  ...item,
                  status: nextStatus,
                  watched: nextStatus === "completado" ? item.episodes : item.watched
                }
              : item
          );
          writeStorage(COLLECTION_OVERRIDES_KEY, overrides);
        }
        closePopover();
        render();
      });
    });

    document.addEventListener("click", (event) => {
      if (!popover.contains(event.target)) closePopover();
    });
    window.addEventListener("resize", closePopover);
    window.addEventListener("scroll", closePopover, { passive: true });

    const collectionIds = new Set(items.map((item) => item.id));
    const recommendations = explorerItems
      .filter((item) => !collectionIds.has(item.id))
      .sort((a, b) => b.recommended - a.recommended)
      .slice(0, 4);
    const recommendationGrid = document.getElementById("recommendation-grid");
    recommendationGrid.innerHTML = recommendations
      .map((item) => animeCardTemplate(item, favoriteIds))
      .join("");
    attachImageFallbacks(recommendationGrid);
    bindFavoriteButtons(recommendationGrid, favoriteIds);

    render();
  };

  setupGlobalSearch();

  const start = async () => {
    try {
      if (page === "explorador") await initExplorer();
      if (page === "coleccion") await initCollection();
    } catch (error) {
      console.error(error);
      const target =
        document.getElementById("anime-grid") ||
        document.getElementById("collection-grid");
      if (target) {
        target.innerHTML = `
          <div class="data-error">
            <strong>No se pudieron cargar los datos.</strong>
            <span>Abre la web desde un servidor local y comprueba la carpeta data.</span>
          </div>
        `;
      }
    }
  };

  start();
})();
