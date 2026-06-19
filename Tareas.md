Aquí tienes el documento completo, formateado exactamente como lo pediste, sin código, listo para que lo copies, lo pegues en un archivo de texto o Markdown (como Notion, Obsidian o un `.md` en tu repositorio) y vayas tachando las tareas.

***

## ✅ CHECKLIST MAESTRO DE TAREAS - YUMEVERSE

### **FASE 1: ESTRUCTURA BASE Y DISEÑO VISUAL (Prioridad CRÍTICA)**

#### **📄 Documento: CSS (Hoja de estilos principal)**
- [ ] Definir variables globales para la paleta de colores (fondos oscuros, acentos neón rosa/morado/azul).
- [ ] Definir variables de tipografía (fuentes principales y de títulos).
- [ ] Definir variables de espaciado, bordes redondeados y sombras.
- [ ] Crear un reset CSS global para eliminar márgenes por defecto.
- [ ] Estilizar la barra de navegación (efecto cristal/blur, sticky, enlaces activos).
- [ ] Crear el sistema de rejilla (Grid) responsivo para las tarjetas.
- [ ] Diseñar la tarjeta base (Card) con efecto hover (elevación y brillo neón).
- [ ] Estilizar los botones principales y secundarios con gradientes.
- [ ] Crear estilos para etiquetas (badges) de estado (ej. "En emisión", "Completado").
- [ ] Diseñar el pie de página (Footer) con columnas y enlaces.
- [ ] Implementar el diseño responsivo (Media queries para móviles y tablets).
- [ ] Añadir animaciones suaves (fade-in, transiciones de hover).
- [ ] Personalizar la barra de desplazamiento (scrollbar) con los colores de la marca.

#### **📂 Carpeta: Imágenes y Recursos (Assets)**
- [ ] Crear la estructura de carpetas para imágenes (anime, mangas, personajes, blog, ui).
- [ ] Convertir todas las imágenes al formato WebP para mejor rendimiento.
- [ ] Asegurar que todos los pósters de anime tengan la misma proporción (ej. 2:3).
- [ ] Asegurar que los banners tengan la misma proporción (ej. 3:1 o 16:9).
- [ ] Comprimir todas las imágenes para que pesen lo menos posible sin perder calidad.
- [ ] Crear un favicon y un logo en formato SVG o PNG transparente.

---

### **FASE 2: ESTRUCTURA HTML Y PÁGINAS (Prioridad ALTA)**

#### **📄 Documentos: HTML (Todas las páginas)**
- [ ] Añadir etiquetas meta básicas en el head (título, descripción, viewport).
- [ ] Importar las fuentes de Google Fonts correctamente.
- [ ] Vincular la hoja de estilos CSS principal.
- [ ] Usar etiquetas semánticas (header, nav, main, section, footer).
- [ ] Añadir atributos `alt` descriptivos a todas las imágenes para accesibilidad.
- [ ] Añadir el atributo `loading="lazy"` a las imágenes que no están en la parte superior.

#### **📄 Página: Inicio (Home)**
- [ ] Crear la sección "Hero" con el título grande y botones de acción.
- [ ] Crear la sección de "Animes Destacados" con carrusel o grid.
- [ ] Crear la sección de "Últimas novedades del Blog".
- [ ] Crear la sección de "Galería destacada".

#### ** Página: Explorador de Anime**
- [ ] Crear la barra de búsqueda principal.
- [ ] Crear los filtros de género, año y estado.
- [ ] Crear el contenedor donde se inyectarán las tarjetas de anime.
- [ ] Crear los controles de paginación en la parte inferior.

#### **📄 Página: Detalle de Anime**
- [ ] Crear el banner de fondo con efecto de desenfoque.
- [ ] Crear la sección de información principal (póster, título, puntuación, botones).
- [ ] Crear el sistema de pestañas (Información, Episodios, Personajes, Galería).
- [ ] Crear la sección de "Animes relacionados".

#### **📄 Página: Sección Asiáticos (Manga/Manhwa)**
- [ ] Crear las pestañas para cambiar entre Manga, Manhua y Manhwa.
- [ ] Replicar el sistema de filtros y grid usado en el explorador de anime.

#### **📄 Página: Galería**
- [ ] Crear los filtros por categoría (Anime, Arte, Fondos).
- [ ] Crear un diseño tipo "Masonry" o Grid para las imágenes.
- [ ] Crear el modal (lightbox) para ver las imágenes en grande al hacer clic.

#### ** Página: Blog**
- [ ] Crear la lista de categorías de noticias.
- [ ] Diseñar la tarjeta de artículo (imagen, categoría, título, extracto, fecha).
- [ ] Crear la página individual para leer un artículo completo.

#### **📄 Páginas: Usuario y Contacto**
- [ ] Crear la página de "Mis Favoritos" (grid dinámico).
- [ ] Crear la página de "Mi Colección" (con estados: viendo, completado, pendiente).
- [ ] Crear el formulario de contacto con validación visual.
- [ ] Crear las páginas de error (404 y 505) con ilustraciones temáticas.

---

### **FASE 3: LÓGICA Y FUNCIONALIDAD (Prioridad ALTA)**

#### **📄 Documento: JavaScript (Lógica principal)**
- [ ] Crear la función para cargar los datos desde los archivos JSON.
- [ ] Crear la función para renderizar (dibujar) las tarjetas de anime/manga en el HTML.
- [ ] Implementar la función de búsqueda en tiempo real (con un pequeño retraso/debounce).
- [ ] Implementar la lógica de filtrado por géneros y categorías.
- [ ] Implementar la lógica de ordenamiento (por popularidad, puntuación, fecha).
- [ ] Crear la función para guardar y cargar "Favoritos" usando el almacenamiento local del navegador (LocalStorage).
- [ ] Crear la función para guardar y cargar "Mi Colección" usando LocalStorage.
- [ ] Hacer que los botones de "corazón" cambien de estado visual al hacer clic.
- [ ] Implementar la lógica de paginación (cuántos items mostrar por página).
- [ ] Crear la función para cambiar de pestaña (tabs) en la página de detalle.
- [ ] Implementar el menú hamburguesa para la versión móvil.
- [ ] Manejar los estados de "Cargando..." (Loading skeletons o spinners).
- [ ] Manejar los errores si un archivo JSON no se carga correctamente.

---

### **FASE 4: BASE DE DATOS Y CONTENIDO (Prioridad MEDIA)**

#### **📄 Documentos: Archivos JSON (Datos)**
- [ ] Crear el archivo `animes.json` con la estructura correcta (id, título, imagen, sinopsis, géneros, etc.).
- [ ] Crear el archivo `mangas.json` con la misma estructura adaptada a cómics.
- [ ] Crear el archivo `personajes.json` vinculado a los animes/mangas.
- [ ] Crear el archivo `blog.json` para los artículos.
- [ ] Crear el archivo `galeria.json` para las imágenes de la galería.
- [ ] Revisar que todas las rutas de las imágenes dentro del JSON coincidan exactamente con las carpetas de assets.
- [ ] Validar que el formato JSON no tenga errores de sintaxis (comas faltantes, comillas mal cerradas).
- [ ] Asegurar que los IDs sean únicos y no se repitan entre elementos.

---

### **FASE 5: OPTIMIZACIÓN Y PULIDO FINAL (Prioridad BAJA)**

#### **📄 Documentos: PHP (Si se utiliza para includes)**
- [ ] Separar el código del Header (menú) en un archivo `header.php`.
- [ ] Separar el código del Footer en un archivo `footer.php`.
- [ ] Incluir estos archivos en todas las páginas HTML para no repetir código.
- [ ] Crear un archivo de funciones o configuración global si es necesario.

#### ** Optimización Web y SEO**
- [ ] Comprimir (minificar) los archivos CSS y JS para la versión de producción.
- [ ] Añadir etiquetas Open Graph para que se vea bien al compartir enlaces en redes sociales.
- [ ] Crear el archivo `robots.txt` para los motores de búsqueda.
- [ ] Crear el archivo `sitemap.xml` con la lista de todas las páginas.
- [ ] Revisar que no haya enlaces rotos en ninguna página.
- [ ] Probar la web en diferentes navegadores (Chrome, Firefox, Safari).
- [ ] Probar la web en diferentes dispositivos (Móvil, Tablet, Escritorio).
- [ ] Asegurar que las transiciones y animaciones no ralenticen la carga de la página.

***

**💡 Consejo de uso:** Copia todo este texto, pégalo en un archivo llamado `TAREAS.md` o `ROADMAP.md` en la raíz de tu repositorio de GitHub. Así podrás ir marcando las casillas `[ ]` cambiándolas por `[x]` a medida que vayas completando cada parte. ¡Mucho éxito con Yumeverse!
