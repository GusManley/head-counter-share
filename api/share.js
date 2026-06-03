export default function handler(req, res) {
    const { data } = req.query
    let total = '0', dateStr = '', areas = ''

    if (data) {
        try {
            const xml = Buffer.from(data, 'base64').toString('utf8')
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
    res.status(200).send(`<!DOCTYPE html><html><head>
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
            body{font-family:-apple-system,sans-serif;background:#f2f2f7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
            .card{background:#38c5b2;border-radius:20px;overflow:hidden;max-width:360px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.15)}
            .header{padding:20px;color:white}
            .label{font-size:13px;font-weight:600;opacity:.85;margin-bottom:8px}
            .count{font-size:72px;font-weight:700;line-height:1}
            .people{font-size:22px;font-weight:500;opacity:.8;margin-top:4px}
            .date{font-size:14px;opacity:.7;margin-top:8px}
            .footer{background:white;padding:20px;text-align:center}
            .btn{display:block;background:#38c5b2;color:white;text-decoration:none;padding:14px;border-radius:12px;font-weight:600;font-size:16px}
            .sub{font-size:12px;color:#8e8e93;margin-top:10px}
        </style>
    </head><body>
        <div class="card">
            <div class="header">
                <div class="label">Head Counter</div>
                <div class="count">${total}</div>
                <div class="people">people</div>
                <div class="date">${dateStr}</div>
            </div>
            <div class="footer">
                <a class="btn" href="${deepLink}">Open in Head Counter</a>
                <p class="sub">Requires Head Counter app installed</p>
            </div>
        </div>
    </body></html>`)
}
