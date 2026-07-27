# YUMEVERSE

> **Tu universo de anime, lecturas, cómic y arte.**

## Identidad oficial del proyecto

| Elemento | Definición definitiva |
|---|---|
| Nombre | **Yumeverse** |
| Tipo de proyecto | Plataforma cultural, editorial y de colección personal |
| Contenido | Anime, manga, manhwa, manhua, cómic, blog, fanart, ilustración y arte |
| Personalidad | Profesional, visual, mágica, divertida y única |
| Estilo | Oscuro y cinematográfico, con acentos rosa, violeta y azul |
| Modelo | Proyecto informativo y personal, sin tienda ni venta de productos |
| Eslogan | **Tu universo de anime, lecturas, cómic y arte.** |
| Idioma inicial | Español |
| Primera versión | HTML, CSS, JavaScript y archivos JSON |

**Yumeverse es el nombre definitivo.** No se utilizarán nombres provisionales, variantes ni submarcas distintas para las secciones. Anime, Asiáticos, Blog y Galería forman parte del mismo universo visual y funcional.

## Objetivo

Crear una web profesional para descubrir obras, consultar expedientes completos, leer contenido editorial, explorar arte y organizar una colección personal. Yumeverse deberá unir la apariencia de una gran plataforma de contenido con la cercanía de un proyecto creativo propio.

La web permitirá:

- Descubrir anime, manga, manhwa, manhua y cómic.
- Consultar fichas técnicas y expedientes detallados.
- Guardar obras, artículos e imágenes en colecciones personales.
- Registrar favoritos, valoraciones y progreso.
- Explorar artículos sobre anime, arte e ilustración.
- Mostrar fanart, dibujos propios y otras obras visuales.
- Encontrar actualizaciones y novedades desde la portada.
- Contactar con la creadora mediante un formulario real.

Yumeverse no será:

- Una tienda.
- Una web de compraventa.
- Una plataforma de streaming.
- Un sitio de descarga de contenido protegido.
- Un catálogo saturado de opciones en el menú.
- Una copia literal de las páginas utilizadas como referencia.

## Alcance de la primera versión

La primera versión funcional incluirá:

1. **Inicio**, con actualizaciones y una visión general de todo Yumeverse.
2. **Anime**, con portada, Explorador, Mi colección y expedientes.
3. **Asiáticos**, con Manga, Manhwa, Manhua y Cómic, además de Explorador, Mi colección y expedientes.
4. **Blog**, con artículos de Anime y Arte, Explorador, Mi colección y artículos completos.
5. **Galería**, con fanart, dibujos, ilustraciones, Explorador, Mi colección y visor.
6. **Contacto**, con formulario e ilustración lateral.
7. Búsqueda global, favoritos, páginas legales y páginas de error.
8. Guardado local de colecciones, progreso, favoritos y valoraciones.

Las cuentas de usuario, la sincronización entre dispositivos y un panel de administración quedarán preparados como posibles ampliaciones futuras, pero no bloquearán el funcionamiento de esta primera versión.

## 1. Visión definitiva

Yumeverse será una web oscura, elegante y muy visual. Debe sentirse como una plataforma editorial grande y cuidada, pero conservar una personalidad cercana, creativa y divertida.

La interfaz deberá reproducir aproximadamente el **90 % de la composición visual de las referencias entregadas**:

- Misma sensación de profundidad, orden y densidad.
- Cabecera oscura, limpia y constante.
- Hero banners cinematográficos.
- Tarjetas compactas con imágenes protagonistas.
- Bordes finos, superficies oscuras y acentos rosa, violeta y azul.
- Secciones claramente delimitadas.
- Filtros, pestañas, estados y fichas técnicas organizados como en las referencias.
- Footer completo y coherente en toda la web.

El 10 % restante se utilizará para que Yumeverse tenga identidad propia:

- Logotipo y textos originales.
- Ilustraciones propias o correctamente licenciadas.
- Detalles gráficos característicos.
- Microanimaciones suaves.
- Mensajes cercanos y pequeños elementos sorpresa.

El objetivo no es crear una plantilla genérica ni una copia sin personalidad. Las referencias se utilizarán para definir composición, jerarquía, proporciones y ambiente, siempre con textos, imágenes, identidad y componentes propios. El resultado debe parecer una plataforma profesional terminada y, al mismo tiempo, reconocerse inmediatamente como **Yumeverse**.

## 2. Reglas no negociables

1. El menú principal se mantiene simple.
2. No se añadirán categorías innecesarias a la cabecera.
3. Ningún botón o enlace podrá quedar sin función.
4. La web deberá funcionar correctamente con ratón, teclado y pantalla táctil.
5. Todas las páginas deberán adaptarse a ordenador, tableta y móvil.
6. Las imágenes tendrán calidad alta, proporciones correctas y recortes cuidados.
7. No se estirarán imágenes ni se usarán archivos borrosos o con marcas de agua.
8. Las colecciones, favoritos y progresos deberán persistir al recargar la página.
9. El contenido se cargará desde JSON y no estará repetido manualmente en varios HTML.
10. La apariencia será profesional, pero no rígida ni aburrida.

## 3. Navegación principal

La cabecera conservará únicamente estas opciones:

**Inicio · Anime · Asiáticos · Blog · Galería · Contacto · Buscar**

### 3.1 Comportamiento del menú

| Opción | Acción principal | Menú al pasar el ratón o enfocar |
|---|---|---|
| Inicio | Abre la portada | Sin desplegable |
| Anime | Abre la portada de Anime | Explorador · Mi colección |
| Asiáticos | Abre la portada de Asiáticos | Explorador · Mi colección |
| Blog | Abre la portada del Blog | Explorador · Mi colección |
| Galería | Abre la portada de Galería | Explorador · Mi colección |
| Contacto | Abre Contacto | Sin desplegable |
| Buscar | Abre la búsqueda global | Panel o página de resultados |

Los desplegables deben ser pequeños y fáciles de entender. No serán megamenús.

### 3.2 Escritorio

- Cabecera fija o `sticky`.
- Altura aproximada: 64–72 px.
- Logotipo a la izquierda.
- Navegación centrada.
- Búsqueda a la derecha.
- La sección activa tendrá una línea rosa inferior.
- El desplegable se abrirá con `hover`, foco de teclado o clic.
- Animación de apertura de 160–220 ms.
- El menú permanecerá abierto mientras el cursor esté sobre el enlace o el panel.

### 3.3 Móvil

- Logotipo, búsqueda y botón de menú visibles.
- Navegación en panel lateral o desplegable.
- Anime, Asiáticos, Blog y Galería funcionarán como acordeones.
- Cada acordeón mostrará solamente **Explorador** y **Mi colección**.
- Contacto e Inicio serán enlaces directos.
- El menú se cerrará después de seleccionar una página.

## 4. Mapa principal del sitio

```text
Inicio
├── Actualizaciones
├── Novedades
├── Recomendaciones
├── Últimos artículos
└── Galería destacada

Anime
├── Portada de Anime
├── Explorador
├── Mi colección
└── Expediente de anime

Asiáticos
├── Portada de Asiáticos
├── Explorador
│   ├── Manga
│   ├── Manhwa
│   ├── Manhua
│   └── Cómic occidental
├── Mi colección
└── Expediente de obra

Blog
├── Portada del Blog
├── Explorador
│   ├── Anime
│   └── Arte
├── Mi colección de artículos
└── Artículo completo

Galería
├── Portada de Galería
├── Explorador
│   ├── Anime
│   ├── Fanart
│   ├── Arte
│   ├── Personajes
│   └── Fondos
├── Mi colección
└── Visor de obra

Contacto
├── Formulario
├── Imagen lateral
├── Redes y otros medios
└── Información de Yumeverse
```

## 5. Especificación por página

## 5.1 Inicio — `index.html`

La portada seguirá la estructura visual de la referencia `image(14).png`.

### Contenido

1. Cabecera global.
2. Hero principal con imagen cinematográfica.
3. Título **YUMEVERSE** y frase de presentación.
4. Botones:
   - Explorar Anime.
   - Ver Galería.
5. Accesos rápidos:
   - Anime.
   - Asiáticos.
   - Blog.
   - Galería.
   - Favoritos o Mi colección.
6. Novedades agregadas recientemente.
7. Recomendaciones para la persona usuaria.
8. Últimos artículos del blog.
9. Selección destacada de la galería.
10. Footer global.

### Diseño

- Hero ancho con el texto en el lado izquierdo y el personaje en el derecho.
- En escritorio, el contenido tendrá un ancho máximo aproximado de 1180–1320 px.
- Las tarjetas se mostrarán en carrusel o rejilla sin saturar la pantalla.
- Cada sección tendrá título, enlace “Ver todo” y separación clara.
- El hero no ocupará toda la primera pantalla; debe permitir ver el comienzo del contenido.

## 5.2 Anime — `anime/index.html`

La página principal de Anime será más sencilla que el explorador.

### Contenido

- Hero breve de presentación.
- Estadísticas o novedades destacadas.
- Dos accesos principales muy claros:
  - **Explorador de Anime**.
  - **Mi colección de Anime**.
- Selección de animes recientes.
- Recomendaciones.
- Enlace a expedientes destacados.

El hero y los accesos no sustituirán las dos páginas internas. Servirán como una entrada visual y fácil de entender.

### Explorador — `anime/explorador.html`

Seguirá la pantalla central de la referencia `Sección_anime(1).png`.

- Buscador interno.
- Filtros por género, año, estado y tipo.
- Orden por popularidad, nombre, fecha y puntuación.
- Etiquetas rápidas de género.
- Vista en rejilla.
- Paginación.
- Favorito rápido.
- Botón “Ver expediente”.
- Estado de carga, vacío y error.

### Mi colección — `anime/mi-coleccion.html`

Seguirá la pantalla izquierda de la referencia `Sección_anime(1).png`.

- Resumen de estadísticas:
  - Viendo.
  - Completados.
  - Pendientes.
  - Abandonados.
  - Favoritos.
  - Total.
- Filtros por estado.
- Buscador interno.
- Vista de tarjetas o lista.
- Episodio actual y total.
- Barra de progreso.
- Valoración personal.
- Edición rápida del estado.

### Expediente — `anime/detalle.html?id=...`

Seguirá la pantalla derecha de la referencia `Sección_anime(1).png`.

- Banner y portada.
- Título y título original.
- Año, episodios, temporadas, estado y tipo.
- Puntuación general y valoración personal.
- Botones:
  - Añadir a favoritos.
  - Añadir a mi colección.
  - Actualizar progreso.
- Pestañas:
  - Información.
  - Episodios.
  - Personajes.
  - Galería.
  - Recomendaciones.
  - Relacionados.
- Sinopsis.
- Géneros, estudio, fuente, creador y clasificación.
- Personajes principales.
- Galería relacionada.
- Recomendaciones similares.

La página se construirá de forma dinámica desde el ID de la URL. No se creará un HTML distinto para cada anime.

## 5.3 Asiáticos — `asiaticos/index.html`

Esta sección reunirá:

- Manga.
- Manhwa.
- Manhua.
- Cómic occidental.

La portada seguirá la primera pantalla de `Sección_asiáticos(1).png`.

### Contenido

- Hero de la sección.
- Contadores por categoría.
- Cuatro tarjetas de acceso: Manga, Manhwa, Manhua y Cómic.
- Últimas obras agregadas.
- Recomendaciones.
- Accesos a Explorador y Mi colección.

### Explorador — `asiaticos/explorador.html`

El explorador incluirá pestañas internas para:

- Todos.
- Manga.
- Manhwa.
- Manhua.
- Cómic.

Cada pestaña tendrá buscador, filtros, ordenación, tarjetas y paginación. La cabecera principal no mostrará estas cuatro categorías como menús separados.

### Mi colección — `asiaticos/mi-coleccion.html`

- Resumen general.
- Filtro por formato.
- Estado de lectura.
- Capítulo o tomo actual.
- Porcentaje de progreso.
- Valoración personal.
- Fechas de inicio y finalización.
- Edición, idioma o formato poseído.
- Favoritos.

### Expediente — `asiaticos/detalle.html?id=...`

Seguirá la composición inferior de `Sección_asiáticos(1).png`.

- Portada y banner.
- Título, título original y títulos alternativos.
- Tipo de obra.
- Autor, artista y editorial.
- País de origen.
- Estado, año, capítulos y tomos.
- Géneros y demografía.
- Sinopsis.
- Personajes.
- Capítulos.
- Galería.
- Reseñas.
- Obras relacionadas.
- Favoritos y colección.

## 5.4 Blog — `blog/index.html`

Seguirá la primera pantalla de `Sección_blog(1).png`.

### Contenido

- Hero de bienvenida.
- Dos categorías principales:
  - Noticias y contenido de Anime.
  - Arte, ilustración y creatividad.
- Artículos destacados.
- Últimos artículos.
- Contenido popular.
- Buscador.
- Newsletter opcional.

### Explorador — `blog/explorador.html`

Tendrá dos pestañas principales:

- Anime.
- Arte.

Filtros previstos:

- Anime: anuncios, estrenos, industria, eventos y videojuegos.
- Arte: ilustración, tutoriales, inspiración, herramientas y artistas.
- Orden por fecha, popularidad o tiempo de lectura.
- Búsqueda por título, etiqueta o texto.

### Mi colección — `blog/mi-coleccion.html`

- Artículos guardados.
- Artículos favoritos.
- Pendientes de leer.
- Leídos.
- Notas personales.
- Filtros por tema.

### Artículo — `blog/articulo.html?id=...`

- Portada.
- Título.
- Categoría y etiquetas.
- Autor y fecha.
- Tiempo de lectura.
- Contenido con jerarquía tipográfica clara.
- Imágenes optimizadas.
- Contenido relacionado.
- Botón para guardar.
- Botones para compartir.

## 5.5 Galería — `galeria/index.html`

Seguirá la primera pantalla de `Sección_galeria(1).png`.

### Contenido

- Hero visual.
- Accesos a:
  - Anime.
  - Fanart.
  - Arte.
  - Personajes.
  - Fondos.
- Imágenes destacadas.
- Últimas imágenes agregadas.
- Accesos a Explorador y Mi colección.

### Explorador — `galeria/explorador.html`

- Búsqueda.
- Filtros por categoría, estilo, personaje, serie y tipo.
- Pestañas internas.
- Rejilla tipo `masonry` o rejilla adaptable.
- Favorito rápido.
- Paginación o carga progresiva.
- Visor ampliado.

### Mi colección — `galeria/mi-coleccion.html`

- Imágenes guardadas.
- Fanarts favoritos.
- Dibujos propios.
- Colecciones o álbumes.
- Filtros por categoría.
- Orden manual o por fecha.

### Visor de obra — `galeria/obra.html?id=...`

- Imagen ampliada.
- Título.
- Autoría.
- Fecha.
- Técnica.
- Descripción.
- Etiquetas.
- Serie o personaje relacionado.
- Derechos y procedencia.
- Favorito.
- Navegación anterior y siguiente.

## 5.6 Contacto — `contacto.html`

Contacto seguirá especialmente la referencia `image(13).png`.

### Composición obligatoria en escritorio

```text
┌──────────────────────────────────────────────────────┐
│ Título y texto introductorio                         │
├──────────────────────────┬───────────────────────────┤
│ Formulario               │ Ilustración vertical      │
│                          │ de personaje/mascota      │
│ Nombre                   │ integrada en el diseño    │
│ Correo                   │                           │
│ Asunto                   │                           │
│ Mensaje                  │                           │
│ Enviar                   │                           │
├──────────────────────────┴───────────────────────────┤
│ Otras formas de contacto                             │
├──────────────────────────┬───────────────────────────┤
│ Sobre Yumeverse          │ Información               │
└──────────────────────────┴───────────────────────────┘
```

### Requisitos de la imagen lateral

- Ilustración vertical de alta calidad.
- Proporción recomendada: 3:4 o 4:5.
- Personaje colocado principalmente en el centro y lado derecho.
- Fondo oscuro con luces rosas y violetas.
- Espacio visual suficiente junto al formulario.
- Degradado oscuro en el borde izquierdo para unir imagen y formulario.
- La imagen y el formulario tendrán una altura visual equilibrada.
- No se mostrará como una imagen pequeña o aislada.
- No llevará texto, logotipo ni marca de agua incrustados.

### Formulario

- Nombre.
- Correo electrónico.
- Asunto.
- Mensaje.
- Aceptación de privacidad cuando sea necesaria.
- Validación comprensible.
- Estado de envío.
- Confirmación de éxito.
- Error recuperable.

El botón “Enviar mensaje” deberá realizar una acción real. Antes de publicar, el formulario se conectará a un endpoint válido o mostrará de forma transparente una alternativa de correo; nunca fingirá que el mensaje se ha enviado.

### Otras formas de contacto

- Email.
- Instagram.
- Discord, si se utiliza.
- YouTube, si se utiliza.
- Otras redes confirmadas.

No se mostrarán redes vacías.

### Responsive

- Tableta: proporción aproximada 55 % formulario y 45 % imagen.
- Móvil: la imagen se convertirá en un banner recortado y el formulario ocupará todo el ancho.
- Los campos conservarán etiquetas visibles y áreas táctiles cómodas.

## 5.7 Otras páginas

Tomarán como referencia `Otras-paginas(1).png`.

| Página | Archivo | Función |
|---|---|---|
| Favoritos | `favoritos.html` | Reúne favoritos de todas las categorías |
| Búsqueda | `busqueda.html` | Muestra resultados globales agrupados |
| Sobre Yumeverse | `sobre-mi.html` | Explica el proyecto y su creadora |
| Privacidad | `privacidad.html` | Informa sobre datos y privacidad |
| Cookies | `cookies.html` | Explica y permite gestionar cookies |
| Aviso legal | `aviso-legal.html` | Uso, propiedad intelectual y responsabilidad |
| Página no encontrada | `404.html` | Orienta al usuario y ofrece rutas útiles |
| Error de servidor | `500.html` | Mensaje breve, volver al inicio e intentar de nuevo |

La página de servidor será `500.html`. No se utilizará `505.html`, ya que el código 505 corresponde a una versión HTTP no compatible.

## 6. Sistema de imágenes

Las imágenes son una parte central del proyecto y no se tratarán como relleno.

### 6.1 Inventario y medidas

| Uso | Proporción | Resolución recomendada | Formato |
|---|---:|---:|---|
| Hero principal | 21:9 o 16:7 | 1920 × 820 px | AVIF/WebP |
| Banner de sección | 16:6 | 1920 × 720 px | AVIF/WebP |
| Banner de expediente | 16:7 | 1600 × 700 px | AVIF/WebP |
| Portada de anime/obra | 2:3 | 800 × 1200 px | WebP |
| Tarjeta horizontal de blog | 16:9 | 1280 × 720 px | WebP |
| Imagen lateral de Contacto | 3:4 | 1500 × 2000 px | WebP |
| Galería vertical | 3:4 | 1200 × 1600 px | WebP |
| Galería cuadrada | 1:1 | 1400 × 1400 px | WebP |
| Avatar de personaje | 1:1 | 800 × 800 px | WebP/PNG |
| Logotipo | Variable | Vectorial | SVG |
| Iconos | 1:1 | Vectorial | SVG |
| Imagen social | 1.91:1 | 1200 × 630 px | WebP/JPG |

### 6.2 Dirección artística

- Estilo anime contemporáneo y cinematográfico.
- Iluminación nocturna.
- Fondos profundos en azul oscuro y negro.
- Acentos rosa, magenta, violeta y azul.
- Escenas distintas según la sección:
  - Inicio: ciudad o universo nocturno.
  - Anime: personaje aventurero o escenario dinámico.
  - Asiáticos: lectura, biblioteca o ambiente de fantasía.
  - Blog Anime: energía, acción y contraste.
  - Blog Arte: estudio creativo cálido.
  - Galería: ilustración, ciudad, naturaleza y espacios artísticos.
  - Contacto: personaje amable y elegante mirando hacia el formulario.

### 6.3 Control de calidad obligatorio

Cada imagen deberá revisarse antes de incorporarla:

- Rostros proporcionados y expresivos.
- Manos correctas, con cinco dedos y sin extremidades duplicadas.
- Anatomía, perspectiva y objetos coherentes.
- Cabello, ropa y accesorios con bordes limpios.
- Sin ojos deformados ni caras mezcladas.
- Sin texto inventado.
- Sin firmas o marcas de agua.
- Sin píxeles rotos, ruido excesivo o compresión visible.
- Sin imágenes repetidas con cambios mínimos.
- Sin personajes cortados por lugares incómodos.
- Sin deformación causada por `width` y `height`.
- Colores compatibles con la sección donde aparecerán.

Las imágenes que no superen esta revisión se regenerarán o sustituirán.

### 6.4 Uso técnico

- `object-fit: cover` para banners y tarjetas.
- `object-position` definido por imagen cuando el foco no esté centrado.
- `srcset` y `sizes` para servir tamaños adaptados.
- Atributos `width` y `height` para evitar saltos de diseño.
- `loading="lazy"` para contenido fuera de la primera pantalla.
- La imagen principal visible al cargar no usará carga diferida.
- Texto alternativo útil en imágenes informativas.
- `alt=""` en imágenes puramente decorativas.

### 6.5 Presupuesto de peso

| Tipo | Peso máximo orientativo |
|---|---:|
| Hero o banner | 350 KB |
| Portada | 180 KB |
| Miniatura | 120 KB |
| Avatar | 100 KB |
| Icono SVG | 15 KB |

Cuando una imagen necesite más calidad, se priorizará el resultado visual sin comprometer de forma excesiva la velocidad.

### 6.6 Derechos

- Las imágenes deberán ser originales, propias, generadas específicamente para el proyecto o contar con una licencia adecuada.
- No se usarán capturas de otros sitios como contenido final.
- No se eliminarán marcas de agua.
- La similitud del 90 % se aplica a la composición y experiencia visual, no a copiar ilustraciones protegidas.
- Toda obra externa mostrará autoría y fuente cuando corresponda.

## 7. Sistema de diseño

### 7.1 Paleta

| Uso | Color |
|---|---|
| Fondo principal | `#050914` |
| Fondo secundario | `#09111D` |
| Superficie | `#0E1726` |
| Tarjeta elevada | `#121C2D` |
| Borde | `#263247` |
| Texto principal | `#F8F9FD` |
| Texto secundario | `#AEB7C7` |
| Rosa principal | `#F04F9B` |
| Rosa intenso | `#FF3D8D` |
| Violeta | `#A855F7` |
| Azul de Arte | `#38A9FF` |
| Éxito | `#49C97D` |
| Aviso | `#F5B942` |
| Error | `#FB7185` |

El rosa será el acento principal. El violeta y el azul ayudarán a diferenciar contenido sin convertir cada página en una marca distinta.

### 7.2 Tipografía

- Títulos: `Poppins`, peso 600–800.
- Texto y controles: `Inter` o `Poppins`, peso 400–600.
- Tamaño mínimo de texto general: 16 px.
- Texto auxiliar: nunca inferior a 13 px.
- Interlineado: 1.45–1.65.
- Anchura máxima de párrafos: 65–75 caracteres.

### 7.3 Componentes

- Cabecera y navegación.
- Desplegable compacto.
- Buscador global.
- Hero.
- Accesos rápidos.
- Tarjeta de anime u obra.
- Tarjeta de artículo.
- Tarjeta de galería.
- Filtros.
- Pestañas.
- Migas de pan.
- Estados y etiquetas.
- Barra de progreso.
- Valoración por estrellas.
- Paginación.
- Carrusel.
- Visor de imagen.
- Formulario.
- Estado vacío.
- Skeleton de carga.
- Avisos.
- Footer.

### 7.4 Personalidad profesional y divertida

La parte divertida aparecerá en detalles controlados:

- Pequeños destellos y estrellas decorativas.
- Iconos con degradado.
- Mensajes amistosos en estados vacíos.
- Elevación de 2–4 px en tarjetas al pasar el ratón.
- Iluminación suave del borde activo.
- Mascota o personaje original en Contacto y páginas de error.

Se evitarán:

- Animaciones constantes.
- Exceso de brillos.
- Colores neón en todos los elementos.
- Botones con movimientos bruscos.
- Sonidos automáticos.
- Fondos que dificulten la lectura.

## 8. Interacciones

- Las tarjetas completas serán clicables.
- Los corazones añadirán o quitarán favoritos sin abrir la ficha.
- La pulsación mostrará una confirmación breve y accesible.
- Los filtros actualizarán la URL o conservarán el estado al volver.
- Los expedientes se abrirán mediante un ID.
- Las galerías se ampliarán sin perder la posición de la página.
- La tecla `Esc` cerrará menús, modales y visores.
- El foco quedará atrapado dentro de un modal abierto.
- Los carruseles tendrán botones, gesto táctil y navegación por teclado.
- Los formularios no borrarán el contenido si ocurre un error.

## 9. Datos JSON

El catálogo y el contenido editorial se separarán de la interfaz.

### Archivos previstos

```text
data/
├── site.json
├── navigation.json
├── home.json
├── anime.json
├── asiaticos.json
├── personajes.json
├── creadores.json
├── blog.json
├── galeria.json
├── recomendaciones.json
└── coleccion-inicial.json
```

### Ejemplo de anime

```json
{
  "id": "naruto",
  "tipo": "anime",
  "titulo": "Naruto",
  "tituloOriginal": "ナルト",
  "portada": "assets/images/anime/naruto/portada.webp",
  "banner": "assets/images/anime/naruto/banner.webp",
  "estadoPublicacion": "completado",
  "anio": 2002,
  "episodios": 220,
  "temporadas": 2,
  "generos": ["Acción", "Aventura", "Shōnen"],
  "estudio": "Studio Pierrot",
  "sinopsis": "Sinopsis editorial de la obra.",
  "personajes": ["naruto-uzumaki", "sasuke-uchiha"],
  "relacionados": ["naruto-shippuden"],
  "puntuacion": 8.6,
  "destacado": true
}
```

### Ejemplo de información personal

```json
{
  "obraId": "naruto",
  "estado": "completado",
  "progreso": 220,
  "favorito": true,
  "valoracionPersonal": 9,
  "fechaInicio": "2026-01-10",
  "fechaFin": "2026-03-28",
  "notas": "Comentario personal."
}
```

Los datos personales no se mezclarán con el catálogo general.

## 10. Guardado local

En la primera versión se usará `localStorage` para:

- Colección de anime.
- Colección de lecturas.
- Artículos guardados.
- Imágenes guardadas.
- Favoritos.
- Progreso.
- Valoraciones.
- Preferencias de visualización.

Claves recomendadas:

```text
yumeverse.anime.collection
yumeverse.asian.collection
yumeverse.blog.collection
yumeverse.gallery.collection
yumeverse.favorites
yumeverse.preferences
```

Más adelante podrá incorporarse una cuenta con base de datos y sincronización entre dispositivos.

## 11. Estructura de archivos

```text
yumeverse/
├── index.html
├── contacto.html
├── busqueda.html
├── favoritos.html
├── sobre-mi.html
├── privacidad.html
├── cookies.html
├── aviso-legal.html
├── 404.html
├── 500.html
├── README.md
│
├── anime/
│   ├── index.html
│   ├── explorador.html
│   ├── mi-coleccion.html
│   └── detalle.html
│
├── asiaticos/
│   ├── index.html
│   ├── explorador.html
│   ├── mi-coleccion.html
│   └── detalle.html
│
├── blog/
│   ├── index.html
│   ├── explorador.html
│   ├── mi-coleccion.html
│   └── articulo.html
│
├── galeria/
│   ├── index.html
│   ├── explorador.html
│   ├── mi-coleccion.html
│   └── obra.html
│
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── navigation.js
│   │   ├── search.js
│   │   ├── filters.js
│   │   ├── collection.js
│   │   ├── favorites.js
│   │   ├── gallery.js
│   │   ├── forms.js
│   │   ├── storage.js
│   │   └── cookies.js
│   ├── images/
│   │   ├── general/
│   │   ├── anime/
│   │   ├── asiaticos/
│   │   ├── blog/
│   │   ├── galeria/
│   │   ├── contacto/
│   │   ├── personajes/
│   │   └── errores/
│   ├── icons/
│   └── fonts/
│
└── data/
    ├── site.json
    ├── navigation.json
    ├── home.json
    ├── anime.json
    ├── asiaticos.json
    ├── personajes.json
    ├── creadores.json
    ├── blog.json
    ├── galeria.json
    ├── recomendaciones.json
    └── coleccion-inicial.json
```

## 12. Responsive

### Escritorio — 1200 px o más

- Rejillas de 4–6 tarjetas según el tipo.
- Formularios y contenido en dos columnas cuando corresponda.
- Filtros visibles.
- Menú horizontal.
- Imágenes de hero panorámicas.

### Tableta — 768 a 1199 px

- Rejillas de 2–4 tarjetas.
- Filtros plegables cuando falte espacio.
- Contacto conserva dos columnas mientras resulte legible.
- Márgenes reducidos.

### Móvil — hasta 767 px

- Una o dos tarjetas por fila según su tamaño.
- Menú plegable.
- Filtros en panel.
- Pestañas desplazables.
- Formulario a una columna.
- Imagen de Contacto convertida en banner.
- Sin desplazamiento horizontal accidental.

## 13. Accesibilidad

- HTML semántico.
- Contraste mínimo WCAG 2.2 AA.
- Navegación completa con teclado.
- Foco visible.
- Enlace para saltar al contenido.
- Etiquetas reales en formularios.
- Mensajes de error asociados a los campos.
- Textos alternativos.
- Jerarquía correcta de encabezados.
- Controles con nombre accesible.
- Respeto a `prefers-reduced-motion`.
- Ningún estado dependerá solamente del color.

## 14. Rendimiento

Objetivos Lighthouse:

| Área | Objetivo |
|---|---:|
| Rendimiento | 90+ |
| Accesibilidad | 95+ |
| Buenas prácticas | 95+ |
| SEO | 95+ |

Medidas:

- Imágenes AVIF o WebP.
- Fuentes locales y subconjuntos cuando sea posible.
- JavaScript modular con `defer`.
- CSS crítico pequeño.
- Carga diferida de imágenes y secciones secundarias.
- Caché de datos estáticos.
- Sin librerías pesadas para funciones sencillas.
- Sin saltos importantes de contenido durante la carga.

## 15. SEO

- Título y descripción únicos por página.
- URL legible.
- `canonical`.
- Open Graph.
- Imagen social de Yumeverse.
- `sitemap.xml`.
- `robots.txt`.
- Datos estructurados cuando correspondan.
- Enlaces internos entre obras, artículos, personas y galerías.
- Encabezados y textos reales; no depender solo de imágenes.

## 16. Privacidad y contenido

- No se recopilarán datos innecesarios.
- El formulario enlazará la política de privacidad.
- Las cookies no esenciales requerirán consentimiento.
- No se alojará contenido pirateado.
- Las imágenes y textos externos incluirán los créditos necesarios.
- Se diferenciará claramente el contenido propio del contenido editorial.

## 17. Criterios de aceptación

Una página solo se considerará terminada cuando:

- Se parezca visualmente a la referencia asignada.
- Mantenga la identidad de Yumeverse.
- Todos sus botones funcionen.
- Los enlaces apunten a páginas reales.
- Los filtros produzcan resultados.
- Las tarjetas abran un expediente o visor.
- Los favoritos y colecciones se guarden.
- No haya errores en consola.
- No haya imágenes deformadas o rotas.
- No haya texto cortado o superpuesto.
- Funcione a 360 px, 768 px, 1024 px y 1440 px.
- Sea navegable con teclado.
- Muestre estados de carga, vacío y error.
- Cumpla la revisión visual en Chrome, Safari, Firefox y Edge actuales.

## 18. Referencias visuales entregadas

| Referencia | Aplicación |
|---|---|
| `image(14).png` | Inicio |
| `Sección_anime(1).png` | Anime, Explorador, Colección y Expediente |
| `Sección_asiáticos(1).png` | Asiáticos y Expediente de lectura |
| `Sección_blog(1).png` | Blog de Anime y Arte |
| `Sección_galeria(1).png` | Galería principal, Anime y Arte |
| `image(13).png` | Contacto con ilustración lateral |
| `Otras-paginas(1).png` | Favoritos, búsqueda, legales, Sobre mí y errores |

Estas referencias definen la jerarquía, proporciones, paleta, densidad y sensación visual. Durante el desarrollo se mantendrá su lenguaje gráfico, adaptándolo a contenido original y a una interacción real.

## 19. Orden recomendado de desarrollo

### Fase 1 — Base visual

- Variables de diseño.
- Tipografía.
- Cabecera.
- Menú y desplegables.
- Footer.
- Botones, tarjetas y formularios.

### Fase 2 — Páginas principales

- Inicio.
- Anime.
- Asiáticos.
- Blog.
- Galería.
- Contacto con imagen lateral.

### Fase 3 — Exploradores y colecciones

- Buscadores.
- Filtros.
- Ordenación.
- Guardado local.
- Favoritos.
- Progreso.

### Fase 4 — Expedientes y contenido

- Detalle de anime.
- Detalle de obra asiática.
- Artículo.
- Visor de galería.
- Personajes y relaciones.

### Fase 5 — Calidad

- Generación y revisión de imágenes.
- Responsive.
- Accesibilidad.
- Rendimiento.
- SEO.
- Formularios.
- Páginas legales y de error.
- Pruebas finales.

## 20. Resultado esperado

Yumeverse debe sentirse:

- Profesional como una gran plataforma.
- Visual como una revista digital de anime y arte.
- Ordenada como una biblioteca personal.
- Divertida sin parecer infantil.
- Única sin sacrificar la facilidad de uso.
- Completa sin convertir el menú en una lista interminable.

La primera impresión debe venir de la calidad de sus imágenes y su hero; la sensación profesional, de la coherencia de sus componentes; y su personalidad, de los detalles, textos y arte original.

---

**Yumeverse — Tu universo de anime, lecturas, cómic y arte.**
