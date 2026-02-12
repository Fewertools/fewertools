// Vercel Serverless Function: POST /api/subscribe
// Subscribes an email to Beehiiv server-side (reliable).
// Env vars required on Vercel:
// - BEEHIIV_API_KEY
// - BEEHIIV_PUBLICATION_ID

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  const contentType = (req.headers['content-type'] || '').toLowerCase();

  if (!raw) return {};

  if (contentType.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return {}; }
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    return Object.fromEntries(params.entries());
  }

  // Fallback: try JSON
  try { return JSON.parse(raw); } catch { return {}; }
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const e = email.trim();
  if (e.length < 5 || e.length > 254) return false;
  // Simple sanity check (not RFC-perfect)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

module.exports = async (req, res) => {
  // CORS (same-origin expected, but allow simple cross-origin if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method_not_allowed' });

  const body = await readBody(req);
  const email = (body.email || '').toString().trim();

  // Honeypot (bots often fill hidden fields)
  const hp = (body.company || body.website || body.hp || '').toString().trim();
  if (hp) return send(res, 200, { ok: true });

  if (!isValidEmail(email)) return send(res, 400, { ok: false, error: 'invalid_email' });

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return send(res, 500, { ok: false, error: 'missing_server_config' });
  }

  try {
    const url = `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Beehiiv has used API-key style auth; set both headers defensively.
        'Authorization': `Bearer ${apiKey}`,
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        email,
        utm_source: body.utm_source || 'fewertools',
        utm_medium: body.utm_medium || 'website',
        utm_campaign: body.utm_campaign || 'signup',
      }),
    });

    // Beehiiv may return 409 for existing subscriber; treat as ok.
    if (resp.ok) return send(res, 200, { ok: true });

    const text = await resp.text().catch(() => '');
    if (resp.status === 409) return send(res, 200, { ok: true, already: true });

    return send(res, 400, { ok: false, error: 'beehiiv_rejected', status: resp.status, detail: text.slice(0, 400) });
  } catch (err) {
    return send(res, 500, { ok: false, error: 'server_error' });
  }
};
