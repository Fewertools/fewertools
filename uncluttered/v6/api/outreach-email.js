// Vercel Serverless Function: POST /api/outreach-email
// Sends controlled outbound email via Resend.
//
// Required env vars (Vercel project-level):
// - RESEND_API_KEY
// - EMAIL_FROM
// - OUTREACH_TOKEN

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const e = email.trim();
  if (e.length < 5 || e.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-outreach-token');

  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method_not_allowed' });

  const expected = process.env.OUTREACH_TOKEN;
  const token = (req.headers['x-outreach-token'] || '').toString();
  if (!expected || token !== expected) return send(res, 401, { ok: false, error: 'unauthorized' });

  const body = await readBody(req);
  const to = (body.to || '').toString().trim();
  const subject = (body.subject || '').toString().trim();
  const text = (body.text || '').toString().trim();
  const replyTo = (body.reply_to || '').toString().trim();

  if (!isValidEmail(to)) return send(res, 400, { ok: false, error: 'invalid_to' });
  if (!subject || subject.length > 140) return send(res, 400, { ok: false, error: 'invalid_subject' });
  if (!text || text.length > 8000) return send(res, 400, { ok: false, error: 'invalid_text' });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return send(res, 500, { ok: false, error: 'missing_server_config' });

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Inter,Arial,sans-serif;line-height:1.5;color:#111;white-space:pre-wrap;">${escapeHtml(text)}</div>`;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        reply_to: replyTo || from,
      }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return send(res, 400, {
        ok: false,
        error: 'resend_rejected',
        status: resp.status,
        detail: JSON.stringify(data).slice(0, 400),
      });
    }

    return send(res, 200, { ok: true, id: data.id || null });
  } catch {
    return send(res, 500, { ok: false, error: 'server_error' });
  }
};
