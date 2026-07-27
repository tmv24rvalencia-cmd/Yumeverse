const ASIAN_TITLES = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    native: "나 혼자만 레벨업",
    type: "Manhwa",
    origin: "Corea del Sur",
    status: "Completado",
    year: "2018–2021",
    chapters: 200,
    chapterLabel: "200 capítulos",
    rating: 9.6,
    image: "../assets/images/asiaticos/solo-leveling.jpg",
    author: "Chugong",
    artist: "DUBU (REDICE Studio)",
    publisher: "D&C Media",
    genres: ["Acción", "Aventura", "Fantasía"],
    summary: "El cazador más débil recibe una capacidad extraordinaria: crecer sin límites en un mundo donde nadie más puede hacerlo.",
    synopsis: "Hace más de una década aparecieron portales que conectan nuestro mundo con dimensiones pobladas por monstruos. Sung Jinwoo, conocido como el cazador más débil, sobrevive a una mazmorra imposible y despierta un sistema que solo él puede ver. Cada misión transforma su fuerza, pero también lo acerca a secretos capaces de cambiar el equilibrio entre ambos mundos.",
  },
  {
    id: "omniscient-reader",
    title: "Omniscient Reader",
    native: "전지적 독자 시점",
    type: "Manhwa",
    origin: "Corea del Sur",
    status: "En publicación",
    year: "2020–",
    chapters: 245,
    chapterLabel: "245 capítulos",
    rating: 9.4,
    image: "../assets/images/asiaticos/omniscient-reader.png",
    author: "sing N song",
    artist: "Sleepy-C",
    publisher: "REDICE Studio",
    genres: ["Acción", "Supervivencia", "Fantasía"],
    summary: "El único lector de una novela olvidada descubre que el mundo empieza a seguir exactamente la historia que conoce.",
    synopsis: "Kim Dokja termina una novela web que ha leído durante años justo antes de que la realidad adopte sus reglas. Gracias a su conocimiento del argumento, deberá negociar con constelaciones, superar escenarios mortales y cambiar el destino de personajes que hasta entonces solo existían en una pantalla.",
  },
  {
    id: "after-the-rain",
    title: "After the Rain Letters",
    native: "비가 그친 뒤의 편지",
    type: "Manhwa",
    origin: "Corea del Sur",
    status: "En publicación",
    year: "2024–",
    chapters: 86,
    chapterLabel: "86 capítulos",
    rating: 8.8,
    image: "../assets/images/asiaticos/after-the-rain.png",
    author: "Han Seo-yun",
    artist: "Mina Park",
    publisher: "Yume Editions",
    genres: ["Romance", "Drama", "Vida cotidiana"],
    summary: "Una editora encuentra cartas anónimas dentro de libros devueltos y comienza a reconstruir una historia que también habla de ella.",
    synopsis: "En una librería de Seúl, Ji-eun descubre notas manuscritas que conectan a lectores desconocidos. Mientras busca a su autor, aprende a mirar su propia vida con más ternura y a aceptar que algunas historias necesitan tiempo antes de poder nombrarse.",
  },
  {
    id: "heaven-official",
    title: "Heaven Official's Blessing",
    native: "天官赐福",
    type: "Manhua",
    origin: "China",
    status: "En publicación",
    year: "2019–",
    chapters: 105,
    chapterLabel: "105 capítulos",
    rating: 9.2,
    image: "../assets/images/asiaticos/heaven-official.png",
    author: "Mo Xiang Tong Xiu",
    artist: "STARember",
    publisher: "Bilibili Comics",
    genres: ["Fantasía", "Romance", "Aventura"],
    summary: "Un dios caído asciende por tercera vez y conoce a un misterioso soberano fantasmal que parece saberlo todo sobre su pasado.",
    synopsis: "Ocho siglos después de su primera ascensión, Xie Lian regresa al reino celestial sin seguidores ni prestigio. Una misión aparentemente sencilla lo conduce hasta Hua Cheng, un temido rey fantasma, y hacia una cadena de recuerdos que revelan lealtades, pérdidas y promesas nunca olvidadas.",
  },
  {
    id: "martial-peak",
    title: "Martial Peak",
    native: "武炼巅峰",
    type: "Manhua",
    origin: "China",
    status: "En publicación",
    year: "2018–",
    chapters: 3800,
    chapterLabel: "3.800+ capítulos",
    rating: 8.6,
    image: "../assets/images/asiaticos/martial-peak.png",
    author: "Momo",
    artist: "Pikapi",
    publisher: "AC.QQ",
    genres: ["Artes marciales", "Fantasía", "Aventura"],
    summary: "Un discípulo perseverante encuentra un libro negro que abre el camino hacia la cima de las artes marciales.",
    synopsis: "Yang Kai ocupa el escalón más bajo de su secta, pero su determinación nunca se quiebra. Cuando un misterioso legado elige reconocerlo, comienza una ascensión llena de pruebas, rivales y reinos cada vez más vastos.",
  },
  {
    id: "kimetsu-no-yaiba",
    title: "Kimetsu no Yaiba",
    native: "鬼滅の刃",
    type: "Manga",
    origin: "Japón",
    status: "Completado",
    year: "2016–2020",
    chapters: 205,
    chapterLabel: "205 capítulos",
    rating: 9.0,
    image: "../assets/images/asiaticos/kimetsu-no-yaiba.jpg",
    author: "Koyoharu Gotouge",
    artist: "Koyoharu Gotouge",
    publisher: "Shueisha",
    genres: ["Acción", "Sobrenatural", "Drama"],
    summary: "Tanjiro emprende un viaje para devolverle la humanidad a su hermana y enfrentarse al origen de los demonios.",
    synopsis: "Después de perder a su familia, Tanjiro se une al cuerpo de cazadores de demonios. Su bondad y su férrea disciplina lo acompañan en una historia de duelos, vínculos familiares y sacrificios inolvidables.",
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    native: "呪術廻戦",
    type: "Manga",
    origin: "Japón",
    status: "Completado",
    year: "2018–2024",
    chapters: 271,
    chapterLabel: "271 capítulos",
    rating: 9.1,
    image: "../assets/images/asiaticos/jujutsu-kaisen.jpg",
    author: "Gege Akutami",
    artist: "Gege Akutami",
    publisher: "Shueisha",
    genres: ["Acción", "Sobrenatural", "Oscuro"],
    summary: "Un estudiante se convierte en el recipiente de una maldición legendaria y entra en el mundo de los hechiceros.",
    synopsis: "Yuji Itadori ingiere un objeto maldito para salvar a sus amigos y queda ligado a Ryomen Sukuna. Desde entonces, su vida transcurre entre combates, pérdidas y preguntas difíciles sobre la forma correcta de morir.",
  },
  {
    id: "frieren",
    title: "Frieren",
    native: "葬送のフリーレン",
    type: "Manga",
    origin: "Japón",
    status: "En publicación",
    year: "2020–",
    chapters: 140,
    chapterLabel: "140+ capítulos",
    rating: 9.5,
    image: "../assets/images/asiaticos/frieren.jpg",
    author: "Kanehito Yamada",
    artist: "Tsukasa Abe",
    publisher: "Shogakukan",
    genres: ["Fantasía", "Aventura", "Drama"],
    summary: "Una elfa inmortal inicia un nuevo viaje para comprender los breves años que compartió con sus compañeros humanos.",
    synopsis: "Tras derrotar al Rey Demonio, Frieren contempla cómo el tiempo transforma a quienes ama. Décadas después, emprende una ruta hacia el norte acompañada por una nueva generación y por preguntas que antes nunca supo formular.",
  },
  {
    id: "dr-stone",
    title: "Dr. Stone",
    native: "ドクターストーン",
    type: "Manga",
    origin: "Japón",
    status: "Completado",
    year: "2017–2022",
    chapters: 232,
    chapterLabel: "232 capítulos",
    rating: 8.7,
    image: "../assets/images/asiaticos/dr-stone.jpg",
    author: "Riichiro Inagaki",
    artist: "Boichi",
    publisher: "Shueisha",
    genres: ["Ciencia ficción", "Aventura", "Comedia"],
    summary: "Miles de años después de la petrificación de la humanidad, Senku decide reconstruir la civilización con ciencia.",
    synopsis: "En un mundo devuelto a la edad de piedra, el conocimiento se convierte en la herramienta más poderosa. Senku y sus aliados avanzan invento a invento mientras descubren qué provocó el desastre.",
  },
  {
    id: "fairy-tail",
    title: "Fairy Tail",
    native: "フェアリーテイル",
    type: "Manga",
    origin: "Japón",
    status: "Completado",
    year: "2006–2017",
    chapters: 545,
    chapterLabel: "545 capítulos",
    rating: 8.5,
    image: "../assets/images/asiaticos/fairy-tail.jpg",
    author: "Hiro Mashima",
    artist: "Hiro Mashima",
    publisher: "Kodansha",
    genres: ["Fantasía", "Aventura", "Comedia"],
    summary: "Un gremio de magos convierte cada misión en una aventura sobre la amistad, la pérdida y la familia elegida.",
    synopsis: "Lucy sueña con unirse a Fairy Tail. Al conocer a Natsu y Happy, entra en un gremio caótico donde cada nuevo encargo pone a prueba la magia y los vínculos de sus integrantes.",
  },
  {
    id: "horimiya",
    title: "Horimiya",
    native: "ホリミヤ",
    type: "Manga",
    origin: "Japón",
    status: "Completado",
    year: "2011–2021",
    chapters: 122,
    chapterLabel: "122 capítulos",
    rating: 8.9,
    image: "../assets/images/asiaticos/horimiya.jpg",
    author: "HERO",
    artist: "Daisuke Hagiwara",
    publisher: "Square Enix",
    genres: ["Romance", "Comedia", "Escolar"],
    summary: "Dos estudiantes descubren las versiones de sí mismos que esconden fuera del instituto.",
    synopsis: "Hori parece popular y perfecta; Miyamura, reservado y distante. Cuando sus vidas privadas se cruzan, nace una relación cálida que también transforma a su grupo de amigos.",
  },
  {
    id: "mahoutsukai-no-yome",
    title: "The Ancient Magus' Bride",
    native: "魔法使いの嫁",
    type: "Manga",
    origin: "Japón",
    status: "En publicación",
    year: "2013–",
    chapters: 100,
    chapterLabel: "100+ capítulos",
    rating: 8.8,
    image: "../assets/images/asiaticos/mahoutsukai-no-yome.jpg",
    author: "Kore Yamazaki",
    artist: "Kore Yamazaki",
    publisher: "Bushiroad Works",
    genres: ["Fantasía", "Drama", "Sobrenatural"],
    summary: "Chise entra en un mundo de magia antigua, criaturas feéricas y afectos que todavía debe aprender a reconocer.",
    synopsis: "Sin un lugar al que pertenecer, Chise Hatori acepta convertirse en aprendiz de Elias Ainsworth. La convivencia abre una puerta hacia lo sobrenatural y hacia una forma distinta de reconstruirse.",
  },
  {
    id: "given",
    title: "Given",
    native: "ギヴン",
    type: "Manga",
    origin: "Japón",
    status: "Completado",
    year: "2013–2023",
    chapters: 51,
    chapterLabel: "51 capítulos",
    rating: 9.0,
    image: "../assets/images/asiaticos/given.jpg",
    author: "Natsuki Kizu",
    artist: "Natsuki Kizu",
    publisher: "Shinshokan",
    genres: ["Música", "Romance", "Drama"],
    summary: "Una guitarra, una voz contenida y una banda permiten que varias heridas empiecen a encontrar palabras.",
    synopsis: "Ritsuka ha perdido la ilusión por tocar hasta que conoce a Mafuyu y escucha su voz. La música los acerca mientras ambos aprenden a sostener recuerdos que todavía pesan.",
  },
  {
    id: "slime",
    title: "That Time I Got Reincarnated as a Slime",
    native: "転生したらスライムだった件",
    type: "Manga",
    origin: "Japón",
    status: "En publicación",
    year: "2015–",
    chapters: 130,
    chapterLabel: "130+ capítulos",
    rating: 8.7,
    image: "../assets/images/asiaticos/slime.jpg",
    author: "Fuse",
    artist: "Taiki Kawakami",
    publisher: "Kodansha",
    genres: ["Fantasía", "Aventura", "Comedia"],
    summary: "Reencarnado como slime, Rimuru construye una nación donde distintas especies puedan vivir sin miedo.",
    synopsis: "Una segunda vida aparentemente absurda se convierte en una aventura política y fantástica. Rimuru reúne aliados, transforma enemigos y descubre el verdadero alcance de sus nuevas habilidades.",
  },
  {
    id: "nocturne-city",
    title: "Nocturne City",
    native: "Volumen I: La lluvia roja",
    type: "Cómic occidental",
    origin: "Estados Unidos",
    status: "En serie",
    year: "2023–",
    chapters: 28,
    chapterLabel: "28 números",
    rating: 8.7,
    image: "../assets/images/asiaticos/nocturne-city.png",
    author: "Elena Ward",
    artist: "Marcus Hale",
    publisher: "Northlight Press",
    genres: ["Noir", "Acción", "Misterio"],
    summary: "Un vigilante sin nombre persigue la verdad bajo la lluvia perpetua de una ciudad construida sobre secretos.",
    synopsis: "Nocturne City ha olvidado la luz. Cuando una serie de símbolos aparece en sus azoteas, un vigilante ligado a la caída de la ciudad descubre una conspiración que atraviesa generaciones.",
  },
  {
    id: "astral-guard",
    title: "Astral Guard",
    native: "Volumen II: Órbita de fuego",
    type: "Cómic occidental",
    origin: "Estados Unidos",
    status: "En serie",
    year: "2024–",
    chapters: 18,
    chapterLabel: "18 números",
    rating: 9.1,
    image: "../assets/images/asiaticos/astral-guard.png",
    author: "Naomi Rivers",
    artist: "Claire Sun",
    publisher: "Lumen Comics",
    genres: ["Ciencia ficción", "Aventura", "Superhéroes"],
    summary: "Una ingeniera capaz de escuchar el pulso de las estrellas protege una ciudad que existe entre dos galaxias.",
    synopsis: "Amara Vale activa por accidente una tecnología anterior a la humanidad. Convertida en guardiana de un corredor cósmico, deberá decidir qué mundos pueden cruzarlo y cuál es el precio de mantenerlos a salvo.",
  },
];

const COLLECTION = [
  { id: "solo-leveling", state: "Completado", progress: 100, note: "Un ascenso adictivo; la evolución visual es espectacular." },
  { id: "omniscient-reader", state: "En progreso", progress: 72, note: "Cada escenario cambia las reglas de forma inteligente." },
  { id: "frieren", state: "En progreso", progress: 64, note: "La forma en que habla del tiempo me parece preciosa." },
  { id: "horimiya", state: "Completado", progress: 100, note: "Sincero, cálido y con personajes que se sienten reales." },
  { id: "heaven-official", state: "En progreso", progress: 48, note: "Una ambientación delicada y llena de misterio." },
  { id: "nocturne-city", state: "Pendiente", progress: 0, note: "La estética noir me llamó la atención desde la portada." },
];

const FAVORITES_KEY = "yumeverse-asian-favorites";

function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

function typeSlug(type) {
  return type.toLowerCase().replaceAll("ó", "o").replaceAll(" ", "-");
}

function bookCard(item, options = {}) {
  const favorites = getFavorites();
  const progress = options.progress;
  const state = options.state || item.status;

  return `
    <article class="yv-card ${Number.isFinite(progress) ? "yv-collection-card" : ""}" data-title-id="${item.id}" data-state="${state}">
      <a class="yv-card__media" href="detalle.html?id=${item.id}" aria-label="Abrir expediente de ${item.title}">
        <img src="${item.image}" alt="Portada de ${item.title}" loading="lazy">
        <span class="yv-badge">${item.type}</span>
        <span class="yv-rating"><span aria-hidden="true">★</span>${item.rating.toFixed(1)}</span>
      </a>
      <div class="yv-card__body">
        <div class="yv-card__meta">
          <span>${item.origin}</span>
          <span>${item.chapterLabel}</span>
          <span>${state}</span>
        </div>
        <h3><a href="detalle.html?id=${item.id}">${item.title}</a></h3>
        <p>${item.summary}</p>
        ${
          Number.isFinite(progress)
            ? `<div class="yv-progress" aria-label="${progress}% leído"><i style="width:${progress}%"></i></div>
               <div class="yv-progress-label"><span>${progress ? "Lectura guardada" : "Aún sin comenzar"}</span><strong>${progress}%</strong></div>`
            : ""
        }
        <div class="yv-card__footer">
          <a href="detalle.html?id=${item.id}">Ver expediente <span aria-hidden="true">→</span></a>
          <button class="yv-heart ${favorites.has(item.id) ? "is-active" : ""}" type="button" data-favorite="${item.id}" aria-label="${favorites.has(item.id) ? "Quitar" : "Añadir"} ${item.title} de favoritos" aria-pressed="${favorites.has(item.id)}">♥</button>
        </div>
      </div>
    </article>
  `;
}

function showToast(message) {
  const toast = document.querySelector(".yv-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.hidden = true;
  }, 2300);
}

function syncFavoriteButtons() {
  const favorites = getFavorites();
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    const active = favorites.has(button.dataset.favorite);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    const title = ASIAN_TITLES.find((item) => item.id === button.dataset.favorite)?.title || "esta obra";
    button.setAttribute("aria-label", `${active ? "Quitar" : "Añadir"} ${title} ${active ? "de" : "a"} favoritos`);
  });
}

function initFavorites() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;
    const favorites = getFavorites();
    const id = button.dataset.favorite;
    const item = ASIAN_TITLES.find((entry) => entry.id === id);
    if (favorites.has(id)) {
      favorites.delete(id);
      showToast(`${item?.title || "La obra"} se ha quitado de favoritos.`);
    } else {
      favorites.add(id);
      showToast(`${item?.title || "La obra"} se ha añadido a favoritos.`);
    }
    saveFavorites(favorites);
    syncFavoriteButtons();
  });
}

function initNavigation() {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-nav-links]");
  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function initHome() {
  const featuredGrid = document.querySelector("#featured-grid");
  if (featuredGrid) {
    const featuredIds = ["solo-leveling", "frieren", "heaven-official", "omniscient-reader", "horimiya", "nocturne-city"];
    featuredGrid.innerHTML = featuredIds
      .map((id) => bookCard(ASIAN_TITLES.find((item) => item.id === id)))
      .join("");
  }

  const latestGrid = document.querySelector("#latest-grid");
  if (latestGrid) {
    latestGrid.innerHTML = ["after-the-rain", "martial-peak", "astral-guard", "jujutsu-kaisen"]
      .map((id) => bookCard(ASIAN_TITLES.find((item) => item.id === id)))
      .join("");
  }
}

function initExplorer() {
  const grid = document.querySelector("#catalog-grid");
  if (!grid) return;

  const search = document.querySelector("#catalog-search");
  const type = document.querySelector("#filter-type");
  const origin = document.querySelector("#filter-origin");
  const status = document.querySelector("#filter-status");
  const sort = document.querySelector("#filter-sort");
  const clear = document.querySelector("#filter-clear");
  const count = document.querySelector("#results-count");
  const empty = document.querySelector("#catalog-empty");
  const pagination = document.querySelector("#catalog-pagination");
  const pageSize = 8;
  let page = 1;

  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) search.value = params.get("q");
  if (params.get("tipo")) type.value = params.get("tipo");

  function filteredItems() {
    const needle = search.value.trim().toLocaleLowerCase("es");
    let items = ASIAN_TITLES.filter((item) => {
      const searchable = `${item.title} ${item.native} ${item.genres.join(" ")} ${item.author}`.toLocaleLowerCase("es");
      return (
        (!needle || searchable.includes(needle)) &&
        (!type.value || typeSlug(item.type) === type.value) &&
        (!origin.value || item.origin === origin.value) &&
        (!status.value || item.status === status.value)
      );
    });

    items = [...items].sort((a, b) => {
      if (sort.value === "rating") return b.rating - a.rating;
      if (sort.value === "newest") return Number.parseInt(b.year, 10) - Number.parseInt(a.year, 10);
      if (sort.value === "chapters") return b.chapters - a.chapters;
      return a.title.localeCompare(b.title, "es");
    });

    return items;
  }

  function render() {
    const items = filteredItems();
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    page = Math.min(page, totalPages);
    const visible = items.slice((page - 1) * pageSize, page * pageSize);

    grid.innerHTML = visible.map((item) => bookCard(item)).join("");
    grid.hidden = visible.length === 0;
    empty.hidden = visible.length !== 0;
    count.textContent = `${items.length} ${items.length === 1 ? "obra" : "obras"}`;

    pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;
      return `<button type="button" data-page="${pageNumber}" ${pageNumber === page ? 'aria-current="page"' : ""} aria-label="Ir a la página ${pageNumber}">${pageNumber}</button>`;
    }).join("");
    pagination.hidden = items.length <= pageSize;
    syncFavoriteButtons();
  }

  [search, type, origin, status, sort].forEach((control) => {
    control.addEventListener(control === search ? "input" : "change", () => {
      page = 1;
      render();
    });
  });

  clear.addEventListener("click", () => {
    search.value = "";
    type.value = "";
    origin.value = "";
    status.value = "";
    sort.value = "title";
    page = 1;
    render();
  });

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    page = Number(button.dataset.page);
    render();
    document.querySelector("#catalog-results")?.scrollIntoView({ behavior: "smooth" });
  });

  render();
}

function renderDetail(item) {
  document.title = `${item.title} | Yumeverse`;
  const hero = document.querySelector(".yv-detail-hero");
  if (hero) {
    hero.style.setProperty("--detail-image", `url("${item.image.replace("../assets", "/assets")}")`);
  }

  document.querySelectorAll("[data-detail-title]").forEach((node) => {
    node.textContent = item.title;
  });
  document.querySelector("[data-detail-native]").textContent = item.native;
  document.querySelector("[data-detail-summary]").textContent = item.summary;
  document.querySelector("[data-detail-synopsis]").textContent = item.synopsis;
  document.querySelector("[data-detail-cover]").src = item.image;
  document.querySelector("[data-detail-cover]").alt = `Portada de ${item.title}`;
  document.querySelector("[data-detail-type]").textContent = item.type;
  document.querySelector("[data-detail-origin]").textContent = item.origin;
  document.querySelector("[data-detail-status]").textContent = item.status;
  document.querySelector("[data-detail-year]").textContent = item.year;
  document.querySelector("[data-detail-chapters]").textContent = item.chapterLabel;
  document.querySelector("[data-detail-rating]").textContent = item.rating.toFixed(1);
  document.querySelector("[data-detail-author]").textContent = item.author;
  document.querySelector("[data-detail-artist]").textContent = item.artist;
  document.querySelector("[data-detail-publisher]").textContent = item.publisher;
  document.querySelector("[data-detail-genres]").textContent = item.genres.join(", ");
  document.querySelector("[data-detail-chips]").innerHTML = [
    `<span class="yv-chip yv-chip--accent">${item.type}</span>`,
    ...item.genres.map((genre) => `<span class="yv-chip">${genre}</span>`),
  ].join("");

  const favoriteButton = document.querySelector("[data-detail-favorite]");
  favoriteButton.dataset.favorite = item.id;

  const chapters = document.querySelector("#chapter-list");
  const last = Math.max(item.chapters, 6);
  chapters.innerHTML = Array.from({ length: 6 }, (_, index) => {
    const number = last - index;
    return `
      <article class="yv-chapter">
        <span class="yv-chapter__number">Cap. ${number}</span>
        <strong>${index === 0 ? "El umbral de una nueva historia" : `Ecos del capítulo ${number - 1}`}</strong>
        <time datetime="2026-07-${String(22 - index).padStart(2, "0")}">${22 - index} julio 2026</time>
      </article>
    `;
  }).join("");

  const related = document.querySelector("#related-grid");
  related.innerHTML = ASIAN_TITLES
    .filter((entry) => entry.id !== item.id && (entry.type === item.type || entry.genres.some((genre) => item.genres.includes(genre))))
    .slice(0, 3)
    .map((entry) => bookCard(entry))
    .join("");

  const characterNames = item.id === "solo-leveling"
    ? [
        ["Sung Jinwoo", "Cazador de rango S"],
        ["Cha Hae-In", "Cazadora de rango S"],
        ["Yoo Jinho", "Compañero de incursiones"],
      ]
    : [
        [item.author, "Autoría"],
        [item.artist, "Arte e ilustración"],
        [item.publisher, "Editorial"],
      ];

  document.querySelector("#detail-characters").innerHTML = characterNames
    .map(([name, role], index) => `
      <div class="yv-character">
        <img src="${index === 0 ? item.image : ASIAN_TITLES[(ASIAN_TITLES.indexOf(item) + index) % ASIAN_TITLES.length].image}" alt="" loading="lazy">
        <div><strong>${name}</strong><span>${role}</span></div>
      </div>
    `)
    .join("");

  syncFavoriteButtons();
}

function initDetail() {
  const detailRoot = document.querySelector("[data-detail-page]");
  if (!detailRoot) return;

  const id = new URLSearchParams(window.location.search).get("id") || "solo-leveling";
  const item = ASIAN_TITLES.find((entry) => entry.id === id) || ASIAN_TITLES[0];
  renderDetail(item);

  const tabs = [...document.querySelectorAll("[role='tab']")];
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((candidate) => {
        const selected = candidate === tab;
        candidate.setAttribute("aria-selected", String(selected));
        document.querySelector(`#${candidate.getAttribute("aria-controls")}`).hidden = !selected;
      });
    });
  });

  document.querySelector("[data-add-collection]")?.addEventListener("click", () => {
    showToast(`${item.title} se ha añadido a tu colección.`);
  });

  document.querySelector("[data-share]")?.addEventListener("click", async () => {
    const shareData = {
      title: `${item.title} | Yumeverse`,
      text: `Descubre ${item.title} en Yumeverse.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Enlace copiado.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast("No se pudo compartir el enlace.");
    }
  });
}

function initCollection() {
  const grid = document.querySelector("#collection-grid");
  if (!grid) return;
  const buttons = [...document.querySelectorAll("[data-collection-filter]")];
  const empty = document.querySelector("#collection-empty");

  function render(filter = "Todos") {
    const items = COLLECTION.filter((entry) => filter === "Todos" || entry.state === filter);
    grid.innerHTML = items
      .map((entry) => {
        const item = ASIAN_TITLES.find((candidate) => candidate.id === entry.id);
        return bookCard(item, { progress: entry.progress, state: entry.state });
      })
      .join("");
    grid.hidden = items.length === 0;
    empty.hidden = items.length !== 0;
    syncFavoriteButtons();
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      render(button.dataset.collectionFilter);
    });
  });

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initFavorites();
  initHome();
  initExplorer();
  initDetail();
  initCollection();
  syncFavoriteButtons();
});
