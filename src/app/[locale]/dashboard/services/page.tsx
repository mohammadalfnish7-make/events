'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Service {
    id: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    price: number | null;
    isActive: boolean;
    image: string | null;
}

export default function ServicesManagementPage() {
    const locale = useLocale();
    const t = useTranslations('admin');
    const [services, setServices] = useState<Service[]>([]);
    const [currency, setCurrency] = useState('AED');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch services and settings on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, settingsRes] = await Promise.all([
                    fetch('/api/services'),
                    fetch('/api/settings')
                ]);
                
                const servicesData = await servicesRes.json();
                setServices(servicesData.services || []);

                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    if (settingsData.currency) {
                        setCurrency(settingsData.currency);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(locale === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
            return;
        }

        try {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete service:', error);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/services/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            setServices(services.map(s =>
                s.id === id ? { ...s, isActive: !currentStatus } : s
            ));
        } catch (error) {
            console.error('Failed to toggle service:', error);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{t('services')}</h1>
                    <p className="text-muted">
                        {locale === 'ar' ? 'إدارة خدماتك' : 'Manage your services'}
                    </p>
                </div>
                <Link
                    href={`/${locale}/dashboard/services/new`}
                    className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    {locale === 'ar' ? 'إضافة خدمة' : 'Add Service'}
                </Link>
            </div>

            {/* Services List */}
            {isLoading ? (
                <div className="text-center py-20">
                    <p className="text-muted">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-20 bg-secondary rounded-2xl">
                    <p className="text-muted text-lg mb-4">
                        {locale === 'ar' ? 'لا توجد خدمات بعد' : 'No services yet'}
                    </p>
                    <Link
                        href={`/${locale}/dashboard/services/new`}
                        className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        {locale === 'ar' ? 'إضافة أول خدمة' : 'Add your first service'}
                    </Link>
                </div>
            ) : (
                <div className="bg-secondary rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-current/10">
                                <th className="text-start p-4 font-medium">
                                    {locale === 'ar' ? 'الخدمة' : 'Service'}
                                </th>
                                <th className="text-start p-4 font-medium hidden md:table-cell">
                                    {locale === 'ar' ? 'السعر' : 'Price'}
                                </th>
                                <th className="text-start p-4 font-medium">
                                    {locale === 'ar' ? 'الحالة' : 'Status'}
                                </th>
                                <th className="text-end p-4 font-medium">
                                    {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="border-b border-current/5 last:border-0">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium">
                                                {locale === 'ar' ? service.titleAr : service.titleEn}
                                            </p>
                                            <p className="text-sm text-muted line-clamp-1">
                                                {locale === 'ar' ? service.descriptionAr : service.descriptionEn}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        {service.price ? `${service.price} ${currency}` : '-'}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleActive(service.id, service.isActive)}
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${service.isActive
                                                    ? 'bg-green-500/20 text-green-600'
                                                    : 'bg-gray-500/20 text-gray-500'
                                                }`}
                                        >
                                            {service.isActive ? (
                                                <>
                                                    <ToggleRight className="w-4 h-4" />
                                                    {locale === 'ar' ? 'نشط' : 'Active'}
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft className="w-4 h-4" />
                                                    {locale === 'ar' ? 'معطل' : 'Inactive'}
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/${locale}/dashboard/services/${service.id}`}
                                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
