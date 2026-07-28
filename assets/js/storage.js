(function () {
  "use strict";

  const KEYS = {
    favorites: "yumeverse.favorites",
    anime: "yumeverse.anime.collection",
    asiaticos: "yumeverse.asian.collection",
    blog: "yumeverse.blog.collection",
    galeria: "yumeverse.gallery.collection",
    preferences: "yumeverse.preferences",
    cookies: "yumeverse.cookies",
  };

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function list(section) {
    return read(KEYS[section], []);
  }

  function toggleInList(section, id) {
    const items = new Set(list(section));
    if (items.has(id)) items.delete(id);
    else items.add(id);
    write(KEYS[section], [...items]);
    return items.has(id);
  }

  function favoriteKey(type, id) {
    return `${type}:${id}`;
  }

  function favorites() {
    return read(KEYS.favorites, []);
  }

  function isFavorite(type, id) {
    return favorites().includes(favoriteKey(type, id));
  }

  function toggleFavorite(type, id) {
    const key = favoriteKey(type, id);
    const values = new Set(favorites());
    if (values.has(key)) values.delete(key);
    else values.add(key);
    write(KEYS.favorites, [...values]);
    window.dispatchEvent(new CustomEvent("yumeverse:favorites", { detail: { type, id } }));
    return values.has(key);
  }

  window.YumeverseStorage = {
    KEYS,
    favoriteKey,
    favorites,
    isFavorite,
    list,
    read,
    toggleFavorite,
    toggleInList,
    write,
  };
})();
