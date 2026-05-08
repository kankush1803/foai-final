/**
 * Get cached data from localStorage if it exists and is not expired.
 * @param {string} key - localStorage key
 * @param {number} maxAgeMs - max age in milliseconds
 * @returns parsed data or null
 */
export function getCached(key, maxAgeMs) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > maxAgeMs) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Store data in localStorage with a timestamp.
 * @param {string} key
 * @param {*} data
 */
export function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Storage full or unavailable — silently fail
  }
}
