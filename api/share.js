export default function handler(req, res) {
    const { data } = req.query
    let total = '0', dateStr = '', areas = ''

    if (data) {
        try {
            const b64 = data.replace(/-/g, '+').replace(/_/g, '/')
            const xml = Buffer.from(b64, 'base64').toString('utf8')
            const t = xml.match(/total="(\d+)"/)
            const d = xml.match(/date="([^"]+)"/)
            const a = [...xml.matchAll(/<area /g)]
            if (t) total = t[1]
            if (d) dateStr = new Date(d[1]).toLocaleString('en-AU', {
                dateStyle: 'medium', timeStyle: 'short'
            })
            areas = a.length ? `${a.length} area${a.length !== 1 ? 's' : ''}` : ''
        } catch {}
    }

    const title    = `Head Counter — ${total} people`
    const desc     = [dateStr, areas].filter(Boolean).join(' · ')
    const deepLink = `headcount://import?data=${encodeURIComponent(data ?? '')}`
    const imgUrl   = `https://${req.headers.host}/api/og?total=${total}&date=${encodeURIComponent(dateStr)}`

    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta property="og:title"       content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image"       content="${imgUrl}">
  <meta property="og:type"        content="website">
  <meta name="twitter:card"       content="summary_large_image">
  <title>${title}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,sans-serif;background:#f2f2f7;min-height:100vh;
         display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#38c5b2;border-radius:20px;overflow:hidden;
          max-width:360px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.15)}
    .hdr{padding:24px;color:white}
    .lbl{font-size:13px;font-weight:600;opacity:.85;margin-bottom:12px}
    .num{font-size:80px;font-weight:700;line-height:1}
    .ppl{font-size:20px;font-weight:500;opacity:.8;margin-top:4px}
    .dte{font-size:13px;opacity:.7;margin-top:10px}
    .ftr{background:white;padding:20px;text-align:center}
    .btn{display:block;background:#38c5b2;color:white;text-decoration:none;
         padding:14px;border-radius:12px;font-weight:600;font-size:16px;margin-bottom:10px}
    .sub{font-size:12px;color:#8e8e93}
    
  </style>
</head>
<body>
  <div class="card">
    <div class="hdr">
      <div class="lbl">Head Counter</div>
      <div class="num">${total}</div>
      <div class="ppl">people</div>
      <div class="dte">${desc}</div>
    </div>
    <div class="ftr">
      <a class="btn" href="${deepLink}">Open in Head Counter</a>
      <p class="sub">Requires Head Counter installed on your device </p>
      <p class="sub" id="status-msg">Requires Head Counter installed on your device</p>
    </div>
  </div>
  <script>
  // Try opening the app immediately. If installed, iOS switches to it.
  // If not, the page stays visible (Safari can't open unknown schemes).
  var deepLink = '${deepLink}';
  var start = Date.now();
  window.location.replace(deepLink);
  
  // After 1.5s, if we're still here the app isn't installed — show a hint
  setTimeout(function() {
    var msg = document.getElementById('status-msg');
    if (msg) msg.textContent = 'Head Counter doesn\\'t appear to be installed on this device.';
  }, 1500);
</script>
</body>
</html>`)
}
