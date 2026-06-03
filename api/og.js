export default function handler(req, res) {
    const total = req.query.total ?? '0'
    const date  = decodeURIComponent(req.query.date ?? '')

    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#38c5b2"/>
  <text x="60" y="96"  font-size="30" fill="rgba(255,255,255,.85)" font-family="-apple-system,sans-serif" font-weight="600">Head Counter</text>
  <text x="60" y="320" font-size="220" fill="white" font-family="-apple-system,sans-serif" font-weight="700">${total}</text>
  <text x="60" y="410" font-size="52" fill="rgba(255,255,255,.75)" font-family="-apple-system,sans-serif">people</text>
  <text x="60" y="480" font-size="34" fill="rgba(255,255,255,.65)" font-family="-apple-system,sans-serif">${date}</text>
</svg>`

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.status(200).send(svg)
}
