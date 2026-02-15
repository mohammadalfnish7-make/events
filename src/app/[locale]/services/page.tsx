import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import prisma from '@/lib/prisma';
import { Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function ServicesPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('services');

    // Fetch services and currency from database
    let services: any[] = [];
    let currency = 'AED';

    try {
        const [servicesData, currencySetting] = await Promise.all([
            prisma.service.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' },
            }),
            prisma.setting.findUnique({
                where: { key: 'currency' },
            }),
        ]);
        services = servicesData;
        if (currencySetting?.value) {
            currency = currencySetting.value;
        }
    } catch {
        // Database might not be ready yet
        services = [];
    }

    return (
        <main className="pt-24 pb-16">
            <div className="container mx-auto px-4">
                <PageHeader locale={locale} t={t} />
                <ServicesList services={services} locale={locale} t={t} currency={currency} />
            </div>
        </main>
    );
}

function PageHeader({ locale, t }: { locale: string; t: any }) {

    return (
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {locale === 'ar' ? 'ما نقدمه' : 'What We Offer'}
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

function ServicesList({ services, locale, t, currency }: { services: any[]; locale: string; t: any; currency: string }) {

    if (services.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted text-lg">
                    {locale === 'ar' ? 'لا توجد خدمات متاحة حالياً' : 'No services available yet'}
                </p>
                <p className="text-sm text-muted mt-2">
                    {locale === 'ar' ? 'تحقق مرة أخرى قريباً!' : 'Check back soon!'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="bg-secondary rounded-2xl overflow-hidden card-hover"
                >
                    {service.image && (
                        <div className="aspect-video bg-muted/20 relative">
                            <img
                                src={service.image}
                                alt={locale === 'ar' ? service.titleAr : service.titleEn}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-3">
                            {locale === 'ar' ? service.titleAr : service.titleEn}
                        </h3>
                        <p className="text-muted mb-4 line-clamp-3">
                            {locale === 'ar' ? service.descriptionAr : service.descriptionEn}
                        </p>
                        {service.price && (
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <span className="text-sm text-muted">{t('priceFrom')}</span>
                                <span>{formatPrice(service.price, locale, currency)}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
