import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('contact');
    const tForm = await getTranslations('contact.form');
    const tInfo = await getTranslations('contact.info');

    return (
        <main className="pt-24 pb-16">
            <div className="container mx-auto px-4">
                <PageHeader locale={locale} t={t} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ContactForm locale={locale} t={tForm} />
                    <ContactInfo locale={locale} t={tInfo} />
                </div>
            </div>
        </main>
    );
}

function PageHeader({ locale, t }: { locale: string; t: any }) {

    return (
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {locale === 'ar' ? 'تواصل معنا' : 'Get In Touch'}
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

function ContactForm({ locale, t }: { locale: string; t: any }) {

    return (
        <div className="bg-secondary rounded-2xl p-8">
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        {t('name')}
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        placeholder={locale === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        {t('email')}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        {t('phone')}
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        placeholder={locale === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                        {t('message')}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-current/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                        placeholder={locale === 'ar' ? 'اكتب رسالتك هنا' : 'Write your message here'}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                    {t('submit')}
                    <Send className={`w-5 h-5 ${locale === 'ar' ? 'flip-rtl' : ''}`} />
                </button>
            </form>
        </div>
    );
}

function ContactInfo({ locale, t }: { locale: string; t: any }) {

    const contactItems = [
        {
            icon: MapPin,
            label: t('address'),
            value: locale === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, United Arab Emirates',
        },
        {
            icon: Phone,
            label: t('phone'),
            value: '+971 50 123 4567',
        },
        {
            icon: Mail,
            label: t('email'),
            value: 'info@events.ae',
        },
        {
            icon: Clock,
            label: t('hours'),
            value: locale === 'ar' ? 'الإثنين - الجمعة: 9 ص - 6 م' : 'Mon - Fri: 9 AM - 6 PM',
        },
    ];

    return (
        <div className="space-y-6">
            {contactItems.map((item, index) => (
                <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-secondary rounded-2xl"
                >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-muted mb-1">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                    </div>
                </div>
            ))}

            {/* Map placeholder */}
            <div className="aspect-video rounded-2xl bg-secondary flex items-center justify-center">
                <p className="text-muted">
                    {locale === 'ar' ? 'خريطة الموقع' : 'Location Map'}
                </p>
            </div>
        </div>
    );
}
