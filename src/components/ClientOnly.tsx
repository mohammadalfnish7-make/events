'use client';

import { ReactNode } from 'react';
import { useIsMounted } from '@/hooks/useHydration';

interface ClientOnlyProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Wrapper component that only renders children on the client
 * Use this for any component that uses browser APIs or would cause hydration mismatch
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
    const isMounted = useIsMounted();

    if (!isMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
