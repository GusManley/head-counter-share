import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req) {
    const { searchParams } = new URL(req.url);
    const total = searchParams.get('total') ?? '0';
    const date  = searchParams.get('date')  ?? '';

    return new ImageResponse(
        {
            type: 'div',
            props: {
                style: {
                    width: '100%', height: '100%', display: 'flex',
                    flexDirection: 'column', justifyContent: 'center',
                    background: '#38c5b2', padding: '60px',
                },
                children: [
                    { type: 'div', props: { style: { fontSize: 28, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }, children: 'Head Counter' } },
                    { type: 'div', props: { style: { fontSize: 120, fontWeight: 700, color: 'white', lineHeight: 1 }, children: total } },
                    { type: 'div', props: { style: { fontSize: 36, color: 'rgba(255,255,255,0.75)', marginTop: 8 }, children: 'people' } },
                    { type: 'div', props: { style: { fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 24 }, children: date } },
                ]
            }
        },
        { width: 1200, height: 630 }
    );
}
