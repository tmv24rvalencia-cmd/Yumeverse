(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-persist-filters]").forEach((form) => {
      const updateUrl = () => {
        const url = new URL(window.location.href);
        new FormData(form).forEach((value, key) => {
          if (String(value).trim()) url.searchParams.set(key, value);
          else url.searchParams.delete(key);
        });
        history.replaceState({}, "", url);
      };
      form.addEventListener("change", updateUrl);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateUrl();
      });
    });
  });
})();
