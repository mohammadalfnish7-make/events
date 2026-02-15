'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

const storageKey = 'events-theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey={storageKey}
            disableTransitionOnChange={false}
        >
            {children}
        </NextThemesProvider>
    );
}
