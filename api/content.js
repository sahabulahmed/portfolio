const { redis, authed } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const v = await redis(['GET', 'portfolio']);
      return res.status(200).json(v ? JSON.parse(v) : {});
    }
    if (!authed(req)) return res.status(401).json({ error: 'Wrong password' });
    if (req.method === 'POST') return res.status(200).json({ ok: true });
    if (req.method === 'PUT') {
      const body = req.body;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid data' });
      const s = JSON.stringify(body);
      if (s.length > 900000) return res.status(413).json({ error: 'Too large. Use smaller images.' });
      await redis(['SET', 'portfolio', s]);
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
