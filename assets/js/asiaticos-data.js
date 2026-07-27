(() => {
  "use strict";

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
      return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
    } catch {
      return new Set();
    }
  };

  const saveFavorites = (favorites) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
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
