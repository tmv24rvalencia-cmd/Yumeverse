(function () {
  "use strict";

  const FALLBACK_ICON = "♡";

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  function closeMenu() {
    const check = document.querySelector(".nav-check");
    if (check) check.checked = false;
    document.querySelectorAll(".nav-item.is-open").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".nav-spark")?.setAttribute("aria-expanded", "false");
    });
  }

  function currentSection() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const known = ["anime", "asiaticos", "blog", "galeria"];
    return known.find((section) => parts.includes(section)) || (
      /contacto\.html$/i.test(window.location.pathname) ? "contacto" : "inicio"
    );
  }

  function applyTheme(theme = {}) {
    const root = document.documentElement;
    const tokens = {
      "--nav-dropdown-background": theme.dropdownBackground,
      "--nav-card-explorer": theme.explorerBackground,
      "--nav-card-collection": theme.collectionBackground,
      "--nav-card-text": theme.text,
      "--nav-card-muted": theme.mutedText,
      "--nav-card-accent": theme.accent
    };
    Object.entries(tokens).forEach(([name, value]) => {
      if (/^#[0-9a-f]{6}$/i.test(value || "")) root.style.setProperty(name, value);
    });
  }

  function navigationItem(item, root, active, icon) {
    const isActive = active === item.id;
    const activeClass = isActive ? " is-active" : "";
    const current = isActive ? ' aria-current="page"' : "";
    const href = `${root}${item.url}`;

    if (!item.children?.length) {
      return `<a class="nav-link${activeClass}" href="${escapeHtml(href)}"${current}>${escapeHtml(item.label)}</a>`;
    }

    const children = item.children.map((child) => `
      <a class="nav-dropdown__link nav-dropdown__link--${escapeHtml(child.id)}" href="${escapeHtml(`${root}${child.url}`)}">
        <span>
          <strong>${escapeHtml(child.label)}</strong>
          <small>${escapeHtml(child.description)}</small>
        </span>
      </a>
    `).join("");

    return `
      <div class="nav-item nav-item--dropdown">
        <div class="nav-parent">
          <a class="nav-link${activeClass}" href="${escapeHtml(href)}"${current}>${escapeHtml(item.label)}</a>
          <button class="nav-spark" type="button" data-symbol="${escapeHtml(icon)}"
            aria-label="Mostrar opciones de ${escapeHtml(item.label)}"
            aria-expanded="false"></button>
        </div>
        <div class="nav-dropdown">${children}</div>
      </div>
    `;
  }

  async function renderNavigation() {
    const container = document.querySelector(".main-nav__inner");
    if (!container) return;

    const root = document.body.dataset.root || "";
    try {
      const response = await fetch(`${root}data/navigation.json`, {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("No se pudo cargar la navegación");
      const data = await response.json();
      const icon = data.menuIcon || FALLBACK_ICON;
      applyTheme(data.theme);
      container.innerHTML = (data.items || [])
        .map((item) => navigationItem(item, root, currentSection(), icon))
        .join("");
    } catch {
      document.querySelectorAll(".dropdown-number").forEach((number) => number.remove());
      document.querySelectorAll(".nav-spark").forEach((button) => {
        button.dataset.symbol = FALLBACK_ICON;
        button.textContent = "";
      });
    }
  }

  function bindNavigation() {
    document.querySelectorAll(".nav-spark").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const item = button.closest(".nav-item");
        const open = !item.classList.contains("is-open");
        document.querySelectorAll(".nav-item.is-open").forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            other.querySelector(".nav-spark")?.setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });

    document.querySelectorAll(".main-nav a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await renderNavigation();
    bindNavigation();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-header")) closeMenu();
    });
  });
})();
