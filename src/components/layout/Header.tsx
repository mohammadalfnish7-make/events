'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Inline SVG icons to avoid hydration issues with lucide-react
function MenuIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function GlobeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

function SunIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
    );
}

function MoonIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

export default function Header() {
    const t = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const { setTheme, resolvedTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentYear, setCurrentYear] = useState(2024);

    useEffect(() => {
        setMounted(true);
    }, []);

    const otherLocale = locale === 'en' ? 'ar' : 'en';
    const localeLabel = locale === 'en' ? 'العربية' : 'English';

    // Hide Header on Dashboard and Login
    if (pathname.includes('/dashboard') || pathname.includes('/login')) {
        return null;
    }

    // Get path without locale prefix for language switching
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const switchLocalePath = `/${otherLocale}${pathWithoutLocale}`;

    const navLinks = [
        { href: `/${locale}`, label: t('home') },
        { href: `/${locale}/services`, label: t('services') },
        { href: `/${locale}/portfolio`, label: t('portfolio') },
        { href: `/${locale}/contact`, label: t('contact') },
    ];

    const isDark = resolvedTheme === 'dark';

    if (!mounted) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 glass dark:bg-gray-900/80 dark:border-b dark:border-gray-800">
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold gradient-bg bg-clip-text text-transparent">Events</span>
                    </div>
                </nav>
            </header>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass dark:bg-gray-900/80 dark:border-b dark:border-gray-800">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo - full logo visible, no crop */}
                    <Link
                        href={`/${locale}`}
                        className="relative flex items-center h-9 md:h-11 w-auto min-w-[8rem] md:min-w-[10rem]"
                    >
                        <Image
                            src="/images/logo.svg"
                            alt="Najmat Albnafsaj Events Management"
                            width={132}
                            height={34}
                            className="object-contain object-left w-full h-full dark:invert"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary text-gray-900 dark:text-gray-100',
                                    pathname === link.href && 'text-primary'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Theme Toggle, Language Switcher & Mobile Menu Button */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            className="p-2 rounded-lg border border-current/20 hover:bg-primary/10 transition-colors text-gray-900 dark:text-gray-100"
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        <Link
                            href={switchLocalePath}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-current/20 hover:bg-primary/10 transition-colors text-gray-900 dark:text-gray-100"
                        >
                            <GlobeIcon className="w-4 h-4" />
                            <span className="text-sm">{localeLabel}</span>
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-900 dark:text-gray-100"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-current/10 dark:border-gray-700 pt-4">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        'text-lg font-medium transition-colors hover:text-primary text-gray-900 dark:text-gray-100',
                                        pathname === link.href && 'text-primary'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
