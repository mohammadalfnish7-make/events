'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

// Inline Icons to avoid hydration issues
function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function ImageIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function EyeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default function DashboardPage({ params: paramsPromise }: PageProps) {
    const { locale } = use(paramsPromise);
    const [stats, setStats] = useState({ services: 0, media: 0, pageViews: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchStats = () => {
        fetch('/api/dashboard/stats')
            .then((res) => res.json())
            .then((data) => setStats({
                services: data.services ?? 0,
                media: data.media ?? 0,
                pageViews: data.pageViews ?? 0,
            }))
            .catch(() => {});
    };

    useEffect(() => {
        if (!mounted) return;
        fetchStats();
    }, [mounted]);

    // Refetch stats when user returns to the dashboard tab so Views count updates
    useEffect(() => {
        if (!mounted) return;
        const onFocus = () => fetchStats();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div>
            <DashboardHeader locale={locale} />
            <StatsCards stats={stats} locale={locale} />
            <QuickActions locale={locale} />
        </div>
    );
}

function DashboardHeader({ locale }: { locale: string }) {
    const t = useTranslations('admin');

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('dashboard')}</h1>
            <p className="text-muted">
                {t('welcome')}! {locale === 'ar' ? 'إليك نظرة عامة على موقعك.' : "Here's an overview of your site."}
            </p>
        </div>
    );
}

function formatViews(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
}

function StatsCards({ stats, locale }: { stats: { services: number; media: number; pageViews: number }; locale: string }) {
    const t = useTranslations('admin.stats');

    const cards = [
        {
            label: t('services'),
            value: stats.services,
            icon: BriefcaseIcon,
            color: 'from-violet-500 to-purple-500'
        },
        {
            label: t('media'),
            value: stats.media,
            icon: ImageIcon,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            label: t('views'),
            value: formatViews(stats.pageViews),
            icon: EyeIcon,
            color: 'from-amber-500 to-orange-500'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-secondary rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold mb-1">{card.value}</p>
                    <p className="text-sm text-muted">{card.label}</p>
                </div>
            ))}
        </div>
    );
}

function QuickActions({ locale }: { locale: string }) {
    const actions = [
        {
            titleEn: 'Add New Service',
            titleAr: 'إضافة خدمة جديدة',
            descEn: 'Create a new service listing',
            descAr: 'إنشاء قائمة خدمات جديدة',
            href: `/${locale}/dashboard/services/new`,
        },
        {
            titleEn: 'Upload Media',
            titleAr: 'رفع ملفات',
            descEn: 'Add images or videos to your gallery',
            descAr: 'إضافة صور أو فيديوهات إلى معرضك',
            href: `/${locale}/dashboard/media`,
        },
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <a
                        key={index}
                        href={action.href}
                        className="p-6 bg-secondary rounded-2xl hover:bg-primary/10 transition-colors group"
                    >
                        <h3 className="font-semibold mb-1 group-hover:text-primary">
                            {locale === 'ar' ? action.titleAr : action.titleEn}
                        </h3>
                        <p className="text-sm text-muted">
                            {locale === 'ar' ? action.descAr : action.descEn}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
}
