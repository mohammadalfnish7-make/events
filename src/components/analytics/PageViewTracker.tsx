'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
    const pathname = usePathname();
    const sent = useRef<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !pathname) return;
        if (pathname.includes('/dashboard') || pathname.includes('/login')) return;

        // Record one view per path per page load (so each open/refresh of a public page increases the count)
        if (sent.current === pathname) return;
        sent.current = pathname;

        fetch('/api/analytics/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: pathname }),
        }).catch(() => {});
    }, [pathname]);

    return null;
}
