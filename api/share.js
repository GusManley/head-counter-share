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
    const deepLink = `headcount://import?data=${data ?? ''}`

    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(`<!DOCTYPE html><html><head>
        <meta property="og:title"       content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:type"        content="website">
        <meta name="twitter:card"       content="summary">
        <title>${title}</title>
        <meta http-equiv="refresh"      content="0;url=${deepLink}">
        <meta property="og:image" content="https://${req.headers.host}/api/og?total=${total}&date=${encodeURIComponent(dateStr)}">
        <style>body{font-family:-apple-system,sans-serif;max-width:480px;margin:80px auto;padding:20px;text-align:center}
        .n{font-size:80px;font-weight:700;color:#38c5b2}.btn{display:inline-block;margin-top:24px;padding:14px 28px;background:#38c5b2;color:#fff;border-radius:12px;text-decoration:none;font-weight:600}</style>
    </head><body>
        <h2>Head Counter</h2>
        <div class="n">${total}</div>
        <p>${desc}</p>
        <a class="btn" href="${deepLink}">Open in Head Counter</a>
    </body></html>`)
}
