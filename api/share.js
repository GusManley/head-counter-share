export default function handler(req, res) {
    const { data } = req.query
    let total = '?', dateStr = ''

    if (data) {
        try {
            const xml = Buffer.from(data, 'base64').toString('utf8')
            const t = xml.match(/total="(\d+)"/)
            const d = xml.match(/date="([^"]+)"/)
            if (t) total = t[1]
            if (d) dateStr = new Date(d[1]).toLocaleString('en-AU', {
                dateStyle: 'medium', timeStyle: 'short'
            })
        } catch {}
    }

    const title   = `Head Counter — ${total} people`
    const imgUrl  = `https://${req.headers.host}/api/og?total=${total}&date=${encodeURIComponent(dateStr)}`
    const deepLink = `headcount://import?data=${data ?? ''}`

    res.setHeader('Content-Type', 'text/html')
    res.send(`<!DOCTYPE html><html><head>
        <meta property="og:title"       content="${title}" />
        <meta property="og:description" content="${dateStr}" />
        <meta property="og:image"       content="${imgUrl}" />
        <meta property="og:type"        content="website" />
        <meta name="twitter:card"       content="summary_large_image" />
        <title>${title}</title>
        <meta http-equiv="refresh" content="0;url=${deepLink}" />
    </head><body>
        <p><a href="${deepLink}">Open in Head Counter</a></p>
    </body></html>`)
}
