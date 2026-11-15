import { NextResponse } from 'next/server';

/**
 * Pose le cookie « no_track » : l'appareil qui passe par l'espace d'administration
 * est considéré comme celui du propriétaire et n'est plus compté dans les visites.
 */
export async function POST() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('no_track', '1', {
        maxAge: 5 * 365 * 24 * 60 * 60,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
    });
    return res;
}
