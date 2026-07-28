(function () {
  "use strict";

  async function initContact() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const root = document.body.dataset.root || "";
    const status = form.querySelector("[data-form-status]");
    let email = "";
    try {
      const site = await Yume.loadJSON(`${root}data/site.json`);
      email = site.contact?.email || "";
      const visibleEmail = document.querySelector("[data-contact-email]");
      if (visibleEmail && email) {
        visibleEmail.href = `mailto:${email}`;
        visibleEmail.textContent = email;
      }
    } catch {
      // La validación del formulario sigue funcionando.
    }

    function errorFor(field, message) {
      const output = form.querySelector(`[data-error-for="${field.name}"]`);
      if (output) output.textContent = message;
      field.setAttribute("aria-invalid", String(Boolean(message)));
      return !message;
    }

    function validate() {
      const name = form.elements.nombre;
      const sender = form.elements.correo;
      const subject = form.elements.asunto;
      const message = form.elements.mensaje;
      const privacy = form.elements.privacidad;
      const checks = [
        errorFor(name, name.value.trim().length >= 2 ? "" : "Escribe tu nombre."),
        errorFor(sender, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender.value) ? "" : "Escribe un correo válido."),
        errorFor(subject, subject.value.trim().length >= 3 ? "" : "Indica el asunto."),
        errorFor(message, message.value.trim().length >= 20 ? "" : "El mensaje debe tener al menos 20 caracteres."),
        errorFor(privacy, privacy.checked ? "" : "Debes aceptar la política de privacidad."),
      ];
      return checks.every(Boolean);
    }

    form.addEventListener("input", (event) => {
      if (event.target.name) errorFor(event.target, "");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate()) {
        status.textContent = "Revisa los campos indicados.";
        status.className = "hub-form-status is-error";
        form.querySelector("[aria-invalid=true]")?.focus();
        return;
      }
      if (!email) {
        status.textContent = "Configura contact.email en data/site.json para activar el envío.";
        status.className = "hub-form-status is-error";
        return;
      }
      const subject = encodeURIComponent(`[Yumeverse] ${form.elements.asunto.value.trim()}`);
      const body = encodeURIComponent(
        `Nombre: ${form.elements.nombre.value.trim()}\nCorreo: ${form.elements.correo.value.trim()}\n\n${form.elements.mensaje.value.trim()}`
      );
      status.textContent = "Se abrirá tu aplicación de correo con el mensaje preparado. Revísalo y pulsa Enviar.";
      status.className = "hub-form-status is-success";
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  }

  document.addEventListener("DOMContentLoaded", initContact);
})();
