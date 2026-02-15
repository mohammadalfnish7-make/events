import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter, Cairo } from 'next/font/google';
import AuthProvider from '@/components/providers/AuthProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import '../globals.css'; // Import global styles here

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
    title: 'Events - Event Planning',
    description: 'Professional event planning services in Saudi Arabia',
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = await params;
    
    // Ensure the incoming locale is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Load messages
    const messages = await getMessages();
    const isRTL = locale === 'ar';

    return (
        <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
            <body
                className={`${inter.variable} ${cairo.variable} ${isRTL ? 'font-arabic' : 'font-sans'} antialiased`}
                suppressHydrationWarning
            >
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider>
<AuthProvider>
                        <PageViewTracker />
                        <Header />
                            {children}
                        <Footer />
                        </AuthProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
