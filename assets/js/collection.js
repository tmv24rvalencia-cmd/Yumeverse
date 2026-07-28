(function () {
  "use strict";

  async function seedDefaults() {
    const root = document.body.dataset.root || "";
    if (!window.YumeverseStorage || !window.Yume) return;
    try {
      const defaults = await Yume.loadJSON(`${root}data/coleccion-inicial.json`);
      ["blog", "galeria"].forEach((section) => {
        if (localStorage.getItem(YumeverseStorage.KEYS[section]) === null) {
          YumeverseStorage.write(YumeverseStorage.KEYS[section], defaults[section] || []);
        }
      });
    } catch {
      // La colección sigue disponible aunque no pueda cargarse el archivo inicial.
    }
  }

  function refreshButtons() {
    document.querySelectorAll("[data-collection]").forEach((button) => {
      const section = button.dataset.collectionSection;
      const active = YumeverseStorage.list(section).includes(button.dataset.id);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      const label = button.querySelector("[data-collection-label]");
      if (label) label.textContent = active ? "Guardado" : "Guardar";
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-collection]");
    if (!button || !window.YumeverseStorage) return;
    event.preventDefault();
    const active = YumeverseStorage.toggleInList(button.dataset.collectionSection, button.dataset.id);
    refreshButtons();
    Yume.toast(active ? "Añadido a tu colección" : "Eliminado de tu colección");
    window.dispatchEvent(new CustomEvent("yumeverse:collection", {
      detail: { section: button.dataset.collectionSection, id: button.dataset.id },
    }));
  });

  document.addEventListener("DOMContentLoaded", async () => {
    await seedDefaults();
    refreshButtons();
  });

  window.YumeCollection = { refresh: refreshButtons, seed: seedDefaults };
})();
