// Local-only persistence: IndexedDB for progress and artwork, localStorage for small prefs.
// Nothing ever leaves the device.

const DB_NAME = 'colorjoy';
const DB_VERSION = 1;
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in self)) return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('art')) db.createObjectStore('art', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

async function tx(store, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    let result;
    const r = fn(s);
    if (r) r.onsuccess = () => { result = r.result; };
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

const safe = (p, fallback) => p.catch((err) => { console.warn('[storage]', err); return fallback; });

export const progress = {
  get: (id) => safe(tx('progress', 'readonly', (s) => s.get(id)), undefined),
  put: (rec) => safe(tx('progress', 'readwrite', (s) => s.put(rec)), undefined),
  remove: (id) => safe(tx('progress', 'readwrite', (s) => s.delete(id)), undefined),
  all: () => safe(tx('progress', 'readonly', (s) => s.getAll()), []),
};

export const art = {
  add: (rec) => safe(tx('art', 'readwrite', (s) => s.add(rec)), undefined),
  remove: (id) => safe(tx('art', 'readwrite', (s) => s.delete(id)), undefined),
  all: () => safe(tx('art', 'readonly', (s) => s.getAll()), []),
};

export async function clearAll() {
  await safe(tx('progress', 'readwrite', (s) => s.clear()), undefined);
  await safe(tx('art', 'readwrite', (s) => s.clear()), undefined);
  for (const k of ['favorites', 'recentColors']) lsSet(k, undefined);
}

// ---- localStorage helpers (always guarded: private mode can throw) ----
const PREFIX = 'colorjoy.';
export function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
export function lsSet(key, value) {
  try {
    if (value === undefined) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable; ignore */
  }
}

const DEFAULT_SETTINGS = { sound: true, voice: false, contrast: false, colorblind: false, reduceMotion: false };
const listeners = new Set();
export const settings = {
  get() {
    return { ...DEFAULT_SETTINGS, ...lsGet('settings', {}) };
  },
  set(patch) {
    const next = { ...this.get(), ...patch };
    lsSet('settings', next);
    listeners.forEach((fn) => fn(next));
    return next;
  },
  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export const favorites = {
  list: () => new Set(lsGet('favorites', [])),
  has(id) { return this.list().has(id); },
  toggle(id) {
    const s = this.list();
    s.has(id) ? s.delete(id) : s.add(id);
    lsSet('favorites', [...s]);
    return s.has(id);
  },
};

export function reducedMotion() {
  return settings.get().reduceMotion || (self.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
}
