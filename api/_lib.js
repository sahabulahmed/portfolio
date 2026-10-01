const U = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const T = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const crypto = require('crypto');

async function redis(cmd) {
  const r = await fetch(U, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + T, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

function authed(req) {
  const real = process.env.ADMIN_PASSWORD || '';
  const given = String(req.headers['x-admin-password'] || '');
  const h = (s) => crypto.createHash('sha256').update(s).digest();
  return real.length > 0 && crypto.timingSafeEqual(h(real), h(given));
}

async function limited(req, key, max, seconds) {
  const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
  const k = `rl:${key}:${ip}`;
  const n = await redis(['INCR', k]);
  if (n === 1) await redis(['EXPIRE', k, seconds]);
  return n > max;
}

// A simple list API: anyone can POST, admin can read/delete (or anyone can read if publicGet)
function listApi(key, { fields, required, publicGet, hideFromPublic = [] }) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (req.method === 'POST') {
        if (await limited(req, key, 5, 3600)) return res.status(429).json({ error: 'Too many submissions. Try again later.' });
        const b = req.body || {};
        const item = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), date: new Date().toISOString() };
        for (const f in fields) item[f] = String(b[f] || '').trim().slice(0, fields[f]);
        if (required.some((f) => !item[f])) return res.status(400).json({ error: 'Please fill in all required fields.' });
        await redis(['LPUSH', key, JSON.stringify(item)]);
        await redis(['LTRIM', key, 0, 199]);
        return res.status(200).json({ ok: true });
      }
      const isAdmin = authed(req);
      if (req.method === 'GET' && !publicGet && !isAdmin) return res.status(401).json({ error: 'Wrong password' });
      if (req.method === 'GET') {
        const list = (await redis(['LRANGE', key, 0, 199])).map((s) => JSON.parse(s));
        if (!isAdmin) list.forEach((i) => hideFromPublic.forEach((f) => delete i[f]));
        return res.status(200).json(list);
      }
      if (!isAdmin) return res.status(401).json({ error: 'Wrong password' });
      if (req.method === 'DELETE') {
        const raw = (await redis(['LRANGE', key, 0, 199])).find((s) => JSON.parse(s).id === req.query.id);
        if (raw) await redis(['LREM', key, 1, raw]);
        return res.status(200).json({ ok: true });
      }
      res.status(405).json({ error: 'Method not allowed' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = { redis, authed, limited, listApi };
