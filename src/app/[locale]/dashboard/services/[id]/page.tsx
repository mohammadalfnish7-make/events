'use client';

import { useState, useEffect, use } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ locale: string; id: string }>;
}

export default function EditServicePage({ params }: PageProps) {
    const { locale, id } = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [service, setService] = useState<any>(null);
    const [currency, setCurrency] = useState('AED');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceRes, settingsRes] = await Promise.all([
                    fetch(`/api/services/${id}`),
                    fetch('/api/settings')
                ]);

                if (!serviceRes.ok) throw new Error('Failed to fetch service');
                const serviceData = await serviceRes.json();
                setService(serviceData.service);

                 if (settingsRes.ok) {
                     const settingsData = await settingsRes.json();
                     if (settingsData.currency) setCurrency(settingsData.currency);
                 }
            } catch (err) {
                setError(locale === 'ar' ? 'فشل في تحميل بيانات الخدمة' : 'Failed to load service data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, locale]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            titleEn: formData.get('titleEn'),
            titleAr: formData.get('titleAr'),
            descriptionEn: formData.get('descriptionEn'),
            descriptionAr: formData.get('descriptionAr'),
            price: formData.get('price') ? Number(formData.get('price')) : null,
            isActive: formData.get('isActive') === 'on',
        };

        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update service');
            }

            router.push(`/${locale}/dashboard/services`);
            router.refresh();
        } catch (err) {
            setError(locale === 'ar' ? 'فشل في تحديث الخدمة' : 'Failed to update service');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
            </div>
        );
    }

    if (!service && !isLoading) {
        return (
            <div className="text-center py-20 bg-secondary rounded-2xl">
                <p className="text-muted text-lg mb-4">
                    {locale === 'ar' ? 'الخدمة غير موجودة' : 'Service not found'}
                </p>
                <Link
                    href={`/${locale}/dashboard/services`}
                    className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium"
                >
                    <ArrowLeft className={`w-5 h-5 ${locale === 'ar' ? 'flip-rtl' : ''}`} />
                    {locale === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/${locale}/dashboard/services`}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                    <ArrowLeft className={`w-6 h-6 ${locale === 'ar' ? 'flip-rtl' : ''}`} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">
                        {locale === 'ar' ? 'تعديل الخدمة' : 'Edit Service'}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-secondary rounded-2xl p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/20 text-red-500 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* English Title */}
                    <div>
                        <label htmlFor="titleEn" className="block text-sm font-medium mb-2">
                            Title (English) *
                        </label>
                        <input
                            type="text"
                            id="titleEn"
                            name="titleEn"
                            required
                            defaultValue={service.titleEn}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                    </div>

                    {/* Arabic Title */}
                    <div>
                        <label htmlFor="titleAr" className="block text-sm font-medium mb-2">
                            العنوان (عربي) *
                        </label>
                        <input
                            type="text"
                            id="titleAr"
                            name="titleAr"
                            required
                            dir="rtl"
                            defaultValue={service.titleAr}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                    </div>

                    {/* English Description */}
                    <div>
                        <label htmlFor="descriptionEn" className="block text-sm font-medium mb-2">
                            Description (English) *
                        </label>
                        <textarea
                            id="descriptionEn"
                            name="descriptionEn"
                            required
                            rows={4}
                            defaultValue={service.descriptionEn}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Arabic Description */}
                    <div>
                        <label htmlFor="descriptionAr" className="block text-sm font-medium mb-2">
                            الوصف (عربي) *
                        </label>
                        <textarea
                            id="descriptionAr"
                            name="descriptionAr"
                            required
                            rows={4}
                            dir="rtl"
                            defaultValue={service.descriptionAr}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-2">
                            {locale === 'ar' ? `السعر (${currency})` : `Price (${currency})`}
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            defaultValue={service.price || ''}
                            className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            defaultChecked={service.isActive}
                            className="w-5 h-5 rounded border-current/10 text-primary focus:ring-primary"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium">
                            {locale === 'ar' ? 'نشط (مرئي على الموقع)' : 'Active (visible on site)'}
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-8 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {isSubmitting
                            ? (locale === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                            : (locale === 'ar' ? 'تحديث الخدمة' : 'Update Service')}
                    </button>
                </div>
            </form>
        </div>
    );
}
