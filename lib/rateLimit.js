const memory = new Map(); // key -> { count, expiry }

export function rateLimit(key, { windowMs = 60_000, max = 5 } = {}) {
  const now = Date.now();
  const entry = memory.get(key) || { count: 0, expiry: now + windowMs };
  if (entry.expiry < now) {
    entry.count = 0;
    entry.expiry = now + windowMs;
  }
  entry.count += 1;
  memory.set(key, entry);
  return {
    ok: entry.count <= max,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.expiry,
  };
}
