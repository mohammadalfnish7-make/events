'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to safely handle client-side only rendering
 * Prevents hydration mismatch by waiting for client mount
 */
export function useIsMounted() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return isMounted;
}

/**
 * Hook to get window dimensions safely
 * Returns null during SSR, actual dimensions after mount
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState<{
        width: number | undefined;
        height: number | undefined;
    }>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Call handler right away so state gets updated with initial window size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

/**
 * Hook to detect if user prefers dark mode
 */
export function usePrefersDarkMode() {
    const [prefersDark, setPrefersDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setPrefersDark(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersDark;
}
