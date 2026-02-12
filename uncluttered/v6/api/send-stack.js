// Vercel Serverless Function: POST /api/send-stack
// Sends a transactional email with the user's saved stack link.
// Env vars required on Vercel:
// - RESEND_API_KEY
// - EMAIL_FROM   (e.g. "Fewertools <hello@fewertools.com>")
// Optional:
// - EMAIL_REPLY_TO (defaults to EMAIL_FROM)

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
  try { return JSON.parse(raw); } catch { return {}; }
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const e = email.trim();
  if (e.length < 5 || e.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function safeUrl(url) {
  if (typeof url !== 'string') return null;
  const u = url.trim();
  if (!u) return null;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    // Only allow sending fewertools links to avoid abuse.
    if (!/\.fewertools\.com$/.test(parsed.hostname) && parsed.hostname !== 'fewertools.com') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method_not_allowed' });

  const body = await readBody(req);
  const email = (body.email || '').toString().trim();
  const url = safeUrl((body.url || '').toString());

  // Honeypot
  const hp = (body.company || body.website || body.hp || '').toString().trim();
  if (hp) return send(res, 200, { ok: true });

  if (!isValidEmail(email)) return send(res, 400, { ok: false, error: 'invalid_email' });
  if (!url) return send(res, 400, { ok: false, error: 'invalid_url' });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO || from;

  if (!apiKey || !from) {
    return send(res, 500, {
      ok: false,
      error: 'missing_server_config',
      missing: [
        !apiKey ? 'RESEND_API_KEY' : null,
        !from ? 'EMAIL_FROM' : null,
      ].filter(Boolean),
    });
  }

  const subject = 'Your Fewertools stack (saved)';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Inter, Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2 style="margin:0 0 12px;">Here’s your saved stack</h2>
      <p style="margin:0 0 16px;">Tap the link below to open your personalised stack any time:</p>
      <p style="margin:0 0 20px;"><a href="${url}" style="display:inline-block; background:#0D9488; color:#fff; text-decoration:none; padding:12px 16px; border-radius:10px; font-weight:600;">Open my stack</a></p>
      <p style="margin:0 0 12px; color:#444; font-size:14px;">Or copy/paste this link:</p>
      <p style="margin:0 0 24px; font-size:14px;"><a href="${url}" style="color:#0D9488;">${url}</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="margin:0; color:#666; font-size:12px;">Fewertools. Less tools. More building.</p>
    </div>
  `;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: email,
        reply_to: replyTo,
        subject,
        html,
      }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return send(res, 400, { ok: false, error: 'resend_rejected', status: resp.status, detail: JSON.stringify(data).slice(0, 400) });
    }

    return send(res, 200, { ok: true, id: data.id || null });
  } catch (e) {
    return send(res, 500, { ok: false, error: 'server_error' });
  }
};
