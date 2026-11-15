'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function VisitorTracker() {
    const pathname = usePathname();
    const { status } = useSession();
    const lastPathname = useRef<string | null>(null);

    useEffect(() => {
        // Skip tracking if user is authenticated (admin)
        if (status === 'authenticated') return;

        // Espace d'administration : on mémorise cet appareil comme « propriétaire »
        // (cookie no_track) pour ne plus jamais compter ses visites.
        if (pathname?.startsWith('/protected_access')) {
            fetch('/api/track/ignore', { method: 'POST' }).catch(() => {});
            return;
        }

        const trackVisit = async () => {
            // Only track if consent is given
            const consent = localStorage.getItem('cookie-consent');
            if (consent !== 'accepted') return;

            if (pathname !== lastPathname.current) {
                try {
                    await fetch('/api/track/visitor', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            path: pathname,
                            referer: document.referrer || null,
                        }),
                    });
                    lastPathname.current = pathname;
                } catch (error) {
                    console.error('Failed to track visit:', error);
                }
            }
        };

        trackVisit();

        // Listen for consent changes to start tracking immediately
        window.addEventListener('cookie-consent-changed', trackVisit);
        return () => window.removeEventListener('cookie-consent-changed', trackVisit);
    }, [pathname, status]);

    return null; // This component doesn't render anything
}
