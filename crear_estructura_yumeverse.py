"""
Crea la estructura completa del proyecto Yumeverse.

Uso:
1. Guarda este archivo dentro de la carpeta del proyecto o en su carpeta padre.
2. Ejecútalo desde PyCharm o con: python crear_estructura_yumeverse.py

El script no borra ni sobrescribe archivos existentes.
"""

from __future__ import annotations

import json
from pathlib import Path


PROJECT_NAME = "yumeverse"
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR if SCRIPT_DIR.name.lower() == PROJECT_NAME else SCRIPT_DIR / PROJECT_NAME


DIRECTORIES = [
    "anime",
    "asiaticos",
    "blog",
    "galeria",
    "assets/css",
    "assets/js",
    "assets/images/general",
    "assets/images/anime",
    "assets/images/asiaticos",
    "assets/images/blog",
    "assets/images/galeria",
    "assets/images/contacto",
    "assets/images/personajes",
    "assets/images/errores",
    "assets/icons",
    "assets/fonts",
    "data",
]


HTML_PAGES = {
    "index.html": ("Inicio", "Descubre las novedades de Yumeverse."),
    "contacto.html": ("Contacto", "Ponte en contacto con Yumeverse."),
    "busqueda.html": ("Búsqueda", "Encuentra historias, obras y personajes."),
    "favoritos.html": ("Favoritos", "Consulta todo lo que has guardado."),
    "sobre-mi.html": ("Sobre mí", "Conoce a la creadora de Yumeverse."),
    "privacidad.html": ("Privacidad", "Política de privacidad de Yumeverse."),
    "cookies.html": ("Cookies", "Política de cookies de Yumeverse."),
    "aviso-legal.html": ("Aviso legal", "Información legal de Yumeverse."),
    "404.html": ("Página no encontrada", "La página que buscas no existe."),
    "500.html": ("Error del servidor", "Ha ocurrido un problema inesperado."),
    "anime/index.html": ("Anime", "Actualidad, recomendaciones y destacados de anime."),
    "anime/explorador.html": ("Explorador de anime", "Explora el catálogo completo de anime."),
    "anime/mi-coleccion.html": ("Mi colección de anime", "Organiza tu colección personal de anime."),
    "anime/detalle.html": ("Expediente de anime", "Ficha completa de la obra seleccionada."),
    "asiaticos/index.html": (
        "Asiáticos",
        "Manga, manhwa, manhua y cómic asiático.",
    ),
    "asiaticos/explorador.html": (
        "Explorador asiático",
        "Explora manga, manhwa, manhua y cómic.",
    ),
    "asiaticos/mi-coleccion.html": (
        "Mi colección asiática",
        "Organiza tus lecturas y colecciones.",
    ),
    "asiaticos/detalle.html": (
        "Expediente de lectura",
        "Ficha completa de la obra seleccionada.",
    ),
    "blog/index.html": ("Blog", "Artículos sobre anime, lectura, arte y cultura."),
    "blog/explorador.html": ("Explorador del blog", "Descubre todos los artículos."),
    "blog/mi-coleccion.html": (
        "Mi colección del blog",
        "Consulta tus artículos guardados.",
    ),
    "blog/articulo.html": ("Artículo", "Lectura completa del artículo seleccionado."),
    "galeria/index.html": ("Galería", "Arte, dibujos, fanart y proyectos creativos."),
    "galeria/explorador.html": (
        "Explorador de la galería",
        "Descubre todas las obras.",
    ),
    "galeria/mi-coleccion.html": (
        "Mi colección de arte",
        "Consulta las obras que has guardado.",
    ),
    "galeria/obra.html": ("Ficha de la obra", "Información de la obra seleccionada."),
}


CSS_FILES = {
    "assets/css/reset.css": """/* Normalización básica */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body,
h1,
h2,
h3,
p,
ul {
  margin: 0;
}

ul {
  padding: 0;
  list-style: none;
}

img {
  display: block;
  max-width: 100%;
}

button,
input,
textarea,
select {
  font: inherit;
}
""",
    "assets/css/variables.css": """/* Identidad visual de Yumeverse */
:root {
  --color-fondo: #100d19;
  --color-superficie: #1a1528;
  --color-superficie-clara: #241c36;
  --color-texto: #f8f5ff;
  --color-texto-suave: #bdb5cc;
  --color-primario: #ee5da8;
  --color-secundario: #8d6bff;
  --color-borde: rgba(255, 255, 255, 0.12);

  --fuente-titulos: "Bodoni Moda", Georgia, serif;
  --fuente-menu: "Marcellus", Georgia, serif;
  --fuente-texto: "Manrope", Arial, sans-serif;

  --radio-sm: 0.5rem;
  --radio-md: 1rem;
  --radio-lg: 1.5rem;
  --sombra: 0 1.25rem 3.5rem rgba(0, 0, 0, 0.28);
  --ancho-contenido: 75rem;
  --transicion: 180ms ease;
}
""",
    "assets/css/base.css": """/* Estilos generales */
body {
  min-height: 100vh;
  color: var(--color-texto);
  background: var(--color-fondo);
  font-family: var(--fuente-texto);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

h1,
h2,
h3 {
  font-family: var(--fuente-titulos);
  line-height: 1.15;
}

:focus-visible {
  outline: 3px solid var(--color-primario);
  outline-offset: 4px;
}
""",
    "assets/css/layout.css": """/* Estructura y distribución */
.contenedor {
  width: min(calc(100% - 2rem), var(--ancho-contenido));
  margin-inline: auto;
}

.contenido-principal {
  min-height: 65vh;
  padding-block: 5rem;
}

.rejilla {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}
""",
    "assets/css/components.css": """/* Componentes reutilizables */
.boton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.7rem 1.25rem;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
  font-weight: 700;
  cursor: pointer;
  transition: transform var(--transicion), box-shadow var(--transicion);
}

.boton:hover {
  transform: translateY(-2px);
  box-shadow: var(--sombra);
}

.tarjeta {
  padding: 1.5rem;
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-md);
  background: var(--color-superficie);
}
""",
    "assets/css/pages.css": """/* Estilos específicos de páginas */
.cabecera-pagina {
  max-width: 48rem;
}

.cabecera-pagina__etiqueta {
  margin-bottom: 0.75rem;
  color: var(--color-primario);
  font-family: var(--fuente-menu);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cabecera-pagina h1 {
  margin-bottom: 1rem;
  font-size: clamp(2.7rem, 7vw, 5.5rem);
}

.cabecera-pagina p {
  color: var(--color-texto-suave);
  font-size: 1.1rem;
}
""",
    "assets/css/responsive.css": """/* Adaptación a tabletas y móviles */
@media (max-width: 56rem) {
  .rejilla {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 42rem) {
  .contenido-principal {
    padding-block: 3.5rem;
  }

  .rejilla {
    grid-template-columns: 1fr;
  }
}
""",
}


JS_FILES = {
    "assets/js/app.js": """// Inicialización general de Yumeverse
document.documentElement.classList.add("js");
""",
    "assets/js/navigation.js": "// Menú principal y navegación móvil\n",
    "assets/js/search.js": "// Búsqueda global de contenido\n",
    "assets/js/filters.js": "// Filtros de los exploradores\n",
    "assets/js/collection.js": "// Gestión de colecciones personales\n",
    "assets/js/favorites.js": "// Gestión de favoritos\n",
    "assets/js/gallery.js": "// Interacciones de la galería\n",
    "assets/js/forms.js": "// Validación y envío de formularios\n",
    "assets/js/storage.js": "// Utilidades para almacenamiento local\n",
    "assets/js/cookies.js": "// Preferencias y consentimiento de cookies\n",
}


JSON_FILES = {
    "data/site.json": {
        "name": "Yumeverse",
        "tagline": "Donde cada historia encuentra su mundo.",
        "language": "es",
    },
    "data/navigation.json": {
        "items": [
            {"label": "Inicio", "url": "index.html"},
            {"label": "Anime", "url": "anime/index.html"},
            {"label": "Asiáticos", "url": "asiaticos/index.html"},
            {"label": "Blog", "url": "blog/index.html"},
            {"label": "Galería", "url": "galeria/index.html"},
            {"label": "Contacto", "url": "contacto.html"},
        ]
    },
    "data/home.json": {"updates": [], "featured": [], "recommendations": []},
    "data/anime.json": {"items": []},
    "data/asiaticos.json": {"items": []},
    "data/personajes.json": {"items": []},
    "data/creadores.json": {"items": []},
    "data/blog.json": {"articles": []},
    "data/galeria.json": {"works": []},
    "data/recomendaciones.json": {"items": []},
    "data/coleccion-inicial.json": {
        "anime": [],
        "asiaticos": [],
        "blog": [],
        "galeria": [],
    },
}


README = """# Yumeverse

Yumeverse es una plataforma personal para descubrir, organizar y disfrutar
anime, manga, manhwa, manhua, cómic, artículos, dibujos y arte.

## Abrir el proyecto

Abre `index.html` con el navegador o utiliza el servidor local de PyCharm.

## Estructura

- Las páginas generales están en la raíz.
- Cada universo tiene su propia carpeta.
- Los estilos están en `assets/css`.
- La funcionalidad está en `assets/js`.
- Las imágenes se organizan por temática en `assets/images`.
- El contenido dinámico se encuentra en `data`.

## Importante

El proyecto es cultural y personal. No es una tienda ni ofrece streaming.
"""


def html_template(path: str, title: str, description: str) -> str:
    """Devuelve una plantilla HTML con rutas correctas según su ubicación."""
    nested = "/" in path
    prefix = "../" if nested else ""
    home = "../index.html" if nested else "index.html"
    anime = "index.html" if path.startswith("anime/") else f"{prefix}anime/index.html"
    asiaticos = (
        "index.html" if path.startswith("asiaticos/") else f"{prefix}asiaticos/index.html"
    )
    blog = "index.html" if path.startswith("blog/") else f"{prefix}blog/index.html"
    galeria = (
        "index.html" if path.startswith("galeria/") else f"{prefix}galeria/index.html"
    )
    contacto = f"{prefix}contacto.html"

    return f"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{description}">
  <title>{title} | Yumeverse</title>
  <link rel="stylesheet" href="{prefix}assets/css/reset.css">
  <link rel="stylesheet" href="{prefix}assets/css/variables.css">
  <link rel="stylesheet" href="{prefix}assets/css/base.css">
  <link rel="stylesheet" href="{prefix}assets/css/layout.css">
  <link rel="stylesheet" href="{prefix}assets/css/components.css">
  <link rel="stylesheet" href="{prefix}assets/css/pages.css">
  <link rel="stylesheet" href="{prefix}assets/css/responsive.css">
</head>
<body>
  <header class="cabecera-sitio">
    <nav class="contenedor" aria-label="Navegación principal">
      <a href="{home}" aria-label="Ir al inicio">Yumeverse</a>
      <ul>
        <li><a href="{home}">Inicio</a></li>
        <li><a href="{anime}">Anime</a></li>
        <li><a href="{asiaticos}">Asiáticos</a></li>
        <li><a href="{blog}">Blog</a></li>
        <li><a href="{galeria}">Galería</a></li>
        <li><a href="{contacto}">Contacto</a></li>
      </ul>
    </nav>
  </header>

  <main class="contenido-principal">
    <section class="contenedor cabecera-pagina">
      <p class="cabecera-pagina__etiqueta">Yumeverse</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  </main>

  <footer class="contenedor">
    <p>&copy; <span id="current-year"></span> Yumeverse.</p>
  </footer>

  <script src="{prefix}assets/js/app.js" defer></script>
  <script src="{prefix}assets/js/navigation.js" defer></script>
</body>
</html>
"""


def create_directory(path: Path) -> bool:
    """Crea una carpeta y devuelve True solamente si era nueva."""
    existed = path.exists()
    path.mkdir(parents=True, exist_ok=True)
    return not existed


def write_if_missing(path: Path, content: str) -> bool:
    """Crea un archivo sin modificar uno que ya exista."""
    if path.exists():
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def main() -> None:
    new_directories = 0
    new_files = 0
    preserved_files = 0

    if create_directory(ROOT):
        new_directories += 1

    for directory in DIRECTORIES:
        if create_directory(ROOT / directory):
            new_directories += 1

    for path, (title, description) in HTML_PAGES.items():
        if write_if_missing(ROOT / path, html_template(path, title, description)):
            new_files += 1
        else:
            preserved_files += 1

    for path, content in CSS_FILES.items():
        if write_if_missing(ROOT / path, content):
            new_files += 1
        else:
            preserved_files += 1

    for path, content in JS_FILES.items():
        if write_if_missing(ROOT / path, content):
            new_files += 1
        else:
            preserved_files += 1

    for path, data in JSON_FILES.items():
        content = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        if write_if_missing(ROOT / path, content):
            new_files += 1
        else:
            preserved_files += 1

    if write_if_missing(ROOT / "README.md", README):
        new_files += 1
    else:
        preserved_files += 1

    print("\nEstructura de Yumeverse preparada correctamente.")
    print(f"Ubicación: {ROOT}")
    print(f"Carpetas nuevas: {new_directories}")
    print(f"Archivos nuevos: {new_files}")
    print(f"Archivos conservados: {preserved_files}")
    print("\nPuedes ejecutar el script otra vez sin perder tu trabajo.")


if __name__ == "__main__":
    main()