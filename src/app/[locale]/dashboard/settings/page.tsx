'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

// Inline Icons
function SaveIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}

interface SettingsProps {
    params: Promise<{ locale: string }>;
}

export default function SettingsPage({ params: paramsPromise }: SettingsProps) {
    const { locale } = use(paramsPromise);
    const t = useTranslations('admin.settings');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [settings, setSettings] = useState({
        siteName: '',
        contactEmail: '',
        phoneNumber: '',
        address: '',
        currency: 'AED', // Default currency
        socialMedia: {
            instagram: '',
            twitter: '',
            whatsapp: ''
        }
    });

    useEffect(() => {
        // Fetch settings on mount
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    
                    // Parse social media if stored as string, or separate keys
                    // Assuming flat structure from API based on route implementation:
                    // key: value
                    
                    setSettings(prev => ({
                        ...prev,
                        siteName: data.siteName || prev.siteName,
                        contactEmail: data.contactEmail || prev.contactEmail,
                        phoneNumber: data.phoneNumber || prev.phoneNumber,
                        address: data.address || prev.address,
                        currency: data.currency || prev.currency,
                        socialMedia: {
                            instagram: data.instagram || prev.socialMedia.instagram,
                            twitter: data.twitter || prev.socialMedia.twitter,
                            whatsapp: data.whatsapp || prev.socialMedia.whatsapp,
                        }
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Flatten settings for API
            const payload = {
                siteName: settings.siteName,
                contactEmail: settings.contactEmail,
                phoneNumber: settings.phoneNumber,
                address: settings.address,
                currency: settings.currency,
                instagram: settings.socialMedia.instagram,
                twitter: settings.socialMedia.twitter,
                whatsapp: settings.socialMedia.whatsapp,
            };

            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save settings');
            
            router.refresh();
            // Could add toast here
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted">Manage your website configuration, currency, and contact information.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Currency (e.g., AED, USD)</label>
                            <input
                                type="text"
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                                placeholder="AED"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Contact Email</label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <input
                                type="text"
                                value={settings.phoneNumber}
                                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <input
                                type="text"
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Instagram</label>
                            <input
                                type="text"
                                value={settings.socialMedia.instagram}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                                })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Twitter</label>
                            <input
                                type="text"
                                value={settings.socialMedia.twitter}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                                })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">WhatsApp</label>
                            <input
                                type="text"
                                value={settings.socialMedia.whatsapp}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialMedia: { ...settings.socialMedia, whatsapp: e.target.value }
                                })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <SaveIcon className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
