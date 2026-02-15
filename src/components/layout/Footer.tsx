'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Inline SVG icons to avoid hydration issues
function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
    );
}

function TwitterIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
    );
}

function MessageCircleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

export default function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');
    const locale = useLocale();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [currentYear, setCurrentYear] = useState(2024);

    if (pathname?.includes('/dashboard') || pathname?.includes('/login')) {
        return null;
    }

    useEffect(() => {
        setMounted(true);
        setCurrentYear(new Date().getFullYear());
    }, []);

    const navLinks = [
        { href: `/${locale}`, label: tNav('home') },
        { href: `/${locale}/services`, label: tNav('services') },
        { href: `/${locale}/portfolio`, label: tNav('portfolio') },
        { href: `/${locale}/contact`, label: tNav('contact') },
    ];

    if (!mounted) {
        return (
            <footer className="bg-secondary dark:bg-gray-900/80 py-12 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <span className="text-2xl font-bold gradient-bg bg-clip-text text-transparent">Events</span>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-secondary dark:bg-gray-900/80 py-12 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link
                            href={`/${locale}`}
                            className="text-2xl font-bold gradient-bg bg-clip-text text-transparent"
                        >
                            Events
                        </Link>
                        <p className="mt-4 text-muted max-w-sm">
                            {locale === 'ar'
                                ? 'نحول رؤيتك إلى واقع من خلال التخطيط والتنسيق الاستثنائي للفعاليات'
                                : 'We bring your vision to life with exceptional event planning and coordination'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
                        </h3>
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            {locale === 'ar' ? 'تابعنا' : 'Follow Us'}
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                aria-label="Twitter"
                            >
                                <TwitterIcon className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                aria-label="WhatsApp"
                            >
                                <MessageCircleIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted">
                        © {currentYear} Events. {t('rights')}.
                    </p>
                    <div className="flex gap-6 text-sm text-muted">
                        <Link href="#" className="hover:text-primary transition-colors">
                            {t('privacy')}
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            {t('terms')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
