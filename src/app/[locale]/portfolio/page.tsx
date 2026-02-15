import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import prisma from '@/lib/prisma';
import { Camera } from 'lucide-react';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('portfolio');

    // Fetch media from database
    let media: any[] = [];
    try {
        media = await prisma.media.findMany({
            where: { type: 'IMAGE' },
            orderBy: { createdAt: 'desc' },
            take: 12,
        });
    } catch {
        // Database might not be ready yet
        media = [];
    }

    return (
        <main className="pt-24 pb-16">
            <div className="container mx-auto px-4">
                <PageHeader locale={locale} t={t} />
                <Gallery media={media} locale={locale} />
            </div>
        </main>
    );
}

function PageHeader({ locale, t }: { locale: string; t: any }) {

    return (
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {locale === 'ar' ? 'أعمالنا' : 'Our Work'}
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-bg bg-clip-text text-transparent">
                {t('title')}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
                {t('description')}
            </p>
        </div>
    );
}

function Gallery({ media, locale }: { media: any[]; locale: string }) {
    if (media.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                    <Camera className="w-10 h-10 text-muted" />
                </div>
                <p className="text-muted text-lg">
                    {locale === 'ar' ? 'لا توجد صور في المعرض بعد' : 'No portfolio images yet'}
                </p>
                <p className="text-sm text-muted mt-2">
                    {locale === 'ar' ? 'تحقق مرة أخرى قريباً!' : 'Check back soon!'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
                <div
                    key={item.id}
                    className="aspect-square rounded-2xl overflow-hidden bg-secondary card-hover group"
                >
                    <img
                        src={item.path}
                        alt={item.alt || 'Portfolio image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ))}
        </div>
    );
}
