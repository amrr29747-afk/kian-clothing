// Vercel serverless function: POST /api/order
// Validates the order, recomputes prices from the catalog, then emails the
// order + a printable waybill to the store owner through Resend.
//
// Environment variables (Vercel -> Settings -> Environment Variables):
//   RESEND_API_KEY   your Resend API key
//   ORDER_TO_EMAIL   the address that receives the orders
//   ORDER_FROM_EMAIL (optional) defaults to "KIAN Orders <onboarding@resend.dev>"

import { INITIAL_PRODUCTS, GOVERNORATES, getShippingFee } from '../src/products.js';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => `${Number(n).toLocaleString('en-US')} EGP`;
const clean = (v, max) => String(v ?? '').replace(/[ \t]+/g, ' ').trim().slice(0, max);

// Arabic-Indic digits -> latin, then normalise to 01XXXXXXXXX
const normalizePhone = (v) => {
  let d = String(v ?? '')
    .replace(/[\u0660-\u0669]/g, (c) => c.charCodeAt(0) - 0x0660)
    .replace(/[\u06F0-\u06F9]/g, (c) => c.charCodeAt(0) - 0x06f0)
    .replace(/\D/g, '');
  if (d.startsWith('0020')) d = d.slice(4);
  else if (d.startsWith('20') && d.length === 12) d = d.slice(2);
  if (d.length === 10 && d.startsWith('1')) d = '0' + d;
  return /^01[0125]\d{8}$/.test(d) ? d : null;
};

const makeOrderId = () => {
  const d = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Cairo', year: '2-digit', month: '2-digit', day: '2-digit' });
  const [dd, mm, yy] = d.split('/');
  return `KN-${yy}${mm}${dd}-${Math.floor(1000 + Math.random() * 9000)}`;
};

function renderWaybill(o) {
  const cell = 'padding:10px 8px;border-bottom:1px solid #e5e5e5;font-size:13px;';
  const lines = o.lines
    .map(
      (l, i) => `<tr>
      <td style="${cell}">${i + 1}</td>
      <td style="${cell}"><strong>${esc(l.name)}</strong><br><span style="color:#666;font-size:12px">${l.color ? 'Color: ' + esc(l.color) + ' &middot; ' : ''}Size: ${esc(l.size)}</span></td>
      <td align="center" style="${cell}">${l.quantity}</td>
      <td align="right" style="${cell}">${money(l.price)}</td>
      <td align="right" style="${cell}"><strong>${money(l.price * l.quantity)}</strong></td>
    </tr>`
    )
    .join('');

  const info = (label, value) => `<tr>
      <td style="padding:5px 0;color:#666;font-size:12px;width:105px;vertical-align:top;text-transform:uppercase;letter-spacing:1px">${label}</td>
      <td dir="auto" style="padding:5px 0;font-size:15px;font-weight:700">${value}</td></tr>`;

  const phones = esc(o.customer.phone) + (o.customer.phone2 ? ' &nbsp;/&nbsp; ' + esc(o.customer.phone2) : '');

  return `<div style="background:#f4f4f4;padding:16px 0">
<table role="presentation" width="680" align="center" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background:#ffffff;border:2px solid #000;font-family:Arial,Helvetica,sans-serif;color:#000">
  <tr><td style="background:#000;color:#fff;padding:18px 22px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:22px;font-weight:700;letter-spacing:5px">KIAN CLOTHING</td>
      <td align="right"><span style="font-size:10px;letter-spacing:2px;color:#bbb">ORDER / WAYBILL</span><br><span style="font-family:'Courier New',monospace;font-size:20px;font-weight:700;letter-spacing:2px">${esc(o.orderId)}</span></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:12px 22px;font-size:12px;color:#555;border-bottom:1px solid #ddd">Date: <strong style="color:#000">${esc(o.date)}</strong> &nbsp;&middot;&nbsp; Payment: <strong style="color:#000">Cash on delivery</strong></td></tr>

  <tr><td style="padding:18px 22px 6px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px dashed #000"><tr>
      <td style="padding:12px 16px;font-size:12px;letter-spacing:2px;font-weight:700">AMOUNT TO COLLECT</td>
      <td align="right" style="padding:12px 16px;font-size:30px;font-weight:700">${money(o.total)}</td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:14px 22px">
    <div style="font-size:11px;letter-spacing:2px;color:#666;font-weight:700;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:6px">SHIP TO</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${info('Name', esc(o.customer.name))}
      ${info('Phone', phones)}
      ${info('Governorate', esc(o.customer.governorate))}
      ${info('City / Area', esc(o.customer.city))}
      ${info('Address', esc(o.customer.address))}
    </table>
    ${o.customer.notes ? `<div dir="auto" style="margin-top:10px;padding:10px 12px;background:#f6f6f6;border-left:4px solid #000;font-size:13px"><strong>Notes:</strong> ${esc(o.customer.notes)}</div>` : ''}
  </td></tr>

  <tr><td style="padding:6px 22px 14px">
    <div style="font-size:11px;letter-spacing:2px;color:#666;font-weight:700;border-bottom:2px solid #000;padding-bottom:6px">ITEMS</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px">
        <td style="padding:8px">#</td><td style="padding:8px">Product</td><td align="center" style="padding:8px">Qty</td><td align="right" style="padding:8px">Price</td><td align="right" style="padding:8px">Total</td>
      </tr>
      ${lines}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;font-size:14px">
      <tr><td align="right" style="padding:3px 8px;color:#555">Subtotal</td><td align="right" style="padding:3px 8px;width:130px">${money(o.subtotal)}</td></tr>
      ${o.shipping > 0 ? `<tr><td align="right" style="padding:3px 8px;color:#555">Shipping</td><td align="right" style="padding:3px 8px">${money(o.shipping)}</td></tr>` : ''}
      <tr><td align="right" style="padding:6px 8px;font-weight:700;font-size:16px">TOTAL</td><td align="right" style="padding:6px 8px;font-weight:700;font-size:16px">${money(o.total)}</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:18px 22px 22px;border-top:1px solid #ddd">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:12px;color:#555">Receiver signature:<br><br>______________________________</td>
      <td align="right" style="font-size:11px;color:#888;vertical-align:bottom">Thank you for shopping with KIAN Clothing</td>
    </tr></table>
  </td></tr>
</table></div>`;
}

async function handle(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: bots fill this hidden field. Pretend success, send nothing.
  if (body.website) return res.status(200).json({ ok: true, orderId: makeOrderId() });

  const c = body.customer || {};
  const customer = {
    name: clean(c.name, 80),
    phone: normalizePhone(c.phone),
    phone2: c.phone2 ? normalizePhone(c.phone2) : '',
    governorate: clean(c.governorate, 40),
    city: clean(c.city, 60),
    address: clean(c.address, 250),
    notes: clean(c.notes, 300),
  };

  if (customer.name.length < 3) return res.status(400).json({ error: 'Please enter your full name.' });
  if (!customer.phone) return res.status(400).json({ error: 'Please enter a valid Egyptian mobile number (e.g. 01012345678).' });
  if (c.phone2 && !customer.phone2) return res.status(400).json({ error: 'The second phone number is not valid.' });
  if (!GOVERNORATES.includes(customer.governorate)) return res.status(400).json({ error: 'Please select your governorate.' });
  if (customer.city.length < 2) return res.status(400).json({ error: 'Please enter your city or area.' });
  if (customer.address.length < 8) return res.status(400).json({ error: 'Please enter your full address.' });

  // Rebuild the order from the catalog: never trust prices or names from the browser.
  const items = Array.isArray(body.items) ? body.items.slice(0, 30) : [];
  if (items.length === 0) return res.status(400).json({ error: 'Your cart is empty.' });

  const lines = [];
  for (const it of items) {
    const product = INITIAL_PRODUCTS.find((p) => p.id === Number(it.id));
    const quantity = Number(it.quantity);
    const hasColors = Array.isArray(product?.colors) && product.colors.length > 0;
    if (
      !product ||
      !product.sizes.includes(it.size) ||
      (hasColors && !product.colors.some((col) => col.name === it.color)) ||
      !Number.isInteger(quantity) || quantity < 1 || quantity > 10
    ) {
      return res.status(400).json({ error: 'Some items in your cart are no longer available. Please refresh the page and try again.' });
    }
    lines.push({ name: product.name, size: it.size, color: hasColors ? it.color : '', quantity, price: product.price });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const shipping = getShippingFee(customer.governorate);
  const total = subtotal + shipping;
  const orderId = makeOrderId();
  const date = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Cairo', dateStyle: 'medium', timeStyle: 'short' });
  const order = { orderId, date, customer, lines, subtotal, shipping, total };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('Missing RESEND_API_KEY or ORDER_TO_EMAIL environment variable');
    return res.status(500).json({ error: 'Orders are temporarily unavailable. Please contact us on WhatsApp.' });
  }

  const html = renderWaybill(order);
  const printable = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(orderId)}</title><style>@page{size:A4;margin:10mm}body{margin:0;background:#fff}</style></head><body>${html}</body></html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.ORDER_FROM_EMAIL || 'KIAN Orders <onboarding@resend.dev>',
        to: [to],
        subject: `New order ${orderId} - ${customer.name} - ${money(total)}`,
        html,
        attachments: [{ filename: `${orderId}.html`, content: Buffer.from(printable, 'utf-8').toString('base64') }],
      }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ error: 'We could not send your order right now. Please try again or contact us on WhatsApp.' });
    }
  } catch (err) {
    console.error('Resend request failed', err);
    return res.status(502).json({ error: 'We could not send your order right now. Please try again or contact us on WhatsApp.' });
  }

  return res.status(200).json({ ok: true, orderId });
}

// Always answer with JSON, even on an unexpected crash (details go to the Vercel logs).
export default async function handler(req, res) {
  try {
    return await handle(req, res);
  } catch (err) {
    console.error('Unexpected order error', err);
    return res.status(500).json({ error: 'Unexpected server error. Please try again or contact us on WhatsApp.' });
  }
}
