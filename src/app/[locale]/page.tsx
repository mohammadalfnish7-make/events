import Link from 'next/link';
import Image from 'next/image';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ParallaxImage from '@/components/ui/ParallaxImage';
import ProcessTimeline from '@/components/ui/ProcessTimeline';
import { getTranslations } from 'next-intl/server';

// Server Component (no 'use client')
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // In Server Components we can use the hook if configured, or just pass translations
    const t = await getTranslations('home');
    const tServices = await getTranslations('home.services');
    const tCta = await getTranslations('home.cta');
    const isRTL = locale === 'ar';

    return (
        <>
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero-luxury.png"
                        alt="Hero Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Decorative Flowers - Parallax */}
                <ParallaxImage 
                    src="/images/flower1.png" 
                    alt="Decorative Flower" 
                    speed={0.2} 
                    className="top-20 left-10 z-10 opacity-80 hidden md:block w-32 h-32 md:w-48 md:h-48" 
                />
                <ParallaxImage 
                    src="/images/flower2.png" 
                    alt="Decorative Flower" 
                    speed={0.3} 
                    className="bottom-20 right-10 z-10 opacity-80 hidden md:block w-40 h-40 md:w-56 md:h-56" 
                />

                <div className="container mx-auto px-4 text-center relative z-20">
                    <ScrollReveal direction="up" duration={1000}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 mb-6">
                            <SparklesIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">
                                {isRTL ? 'مرحباً بك في عالم الفعاليات' : 'Welcome to Event Planning'}
                            </span>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={200} duration={1000}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg">
                            {t('hero.title')}
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={400} duration={1000}>
                        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10 drop-shadow-md">
                            {t('hero.subtitle')}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={600} duration={1000}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={`/${locale}/services`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                {t('hero.cta')}
                                <ArrowRightIcon className={`w-5 h-5 ${isRTL ? 'flip-rtl' : ''}`} />
                            </Link>
                            <Link
                                href={`/${locale}/contact`}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                {isRTL ? 'تواصل معنا' : 'Contact Us'}
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Services Preview */}
            <ServicesSection locale={locale} t={tServices} />

            {/* Process Timeline Section - NEW */}
            <section className="w-full py-20 bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 gradient-bg bg-clip-text text-transparent">
                                {locale === 'ar' ? 'كيف نعمل' : 'How It Works'}
                            </h2>
                            <p className="text-muted text-lg max-w-2xl mx-auto">
                                {locale === 'ar' 
                                    ? 'عملية سلسة وممتعة لتحويل حلمك إلى حقيقة' 
                                    : 'A seamless and enjoyable process to turn your dream into reality'}
                            </p>
                        </div>
                    </ScrollReveal>

                    <ProcessTimeline />
                </div>
            </section>

            {/* Stats Section */}
            <StatsSection locale={locale} />

            {/* CTA Section */}
            {/* CTA Section */}
            <CTASection locale={locale} t={tCta} />
        </>
    );
}

function ServicesSection({ locale, t }: { locale: string; t: any }) {
    
    // Static data for services to avoid complex DB fetching in this simple view
    const services = [
        {
            icon: CalendarIcon,
            image: '/images/services3.jpg',
            titleEn: 'Wedding Planning',
            titleAr: 'تخطيط الأعراس',
            descEn: 'Create your dream wedding with our expert planners',
            descAr: 'اصنع حفل زفاف أحلامك مع مخططينا الخبراء',
        },
        {
            icon: UsersIcon,
            image: '/images/services2.jpg',
            titleEn: 'Corporate Events',
            titleAr: 'فعاليات الشركات',
            descEn: 'Professional events that leave lasting impressions',
            descAr: 'فعاليات احترافية تترك انطباعات دائمة',
        },
        {
            icon: StarIcon,
            image: '/images/services1.jpg',
            titleEn: 'Private Parties',
            titleAr: 'الحفلات الخاصة',
            descEn: 'Celebrate special moments in style',
            descAr: 'احتفل باللحظات الخاصة بأسلوب مميز',
        },
    ];

    return (
        <section className="w-full py-24 bg-secondary relative">
            <ParallaxImage 
                src="/images/flower3.png" 
                alt="Decoration" 
                speed={0.1} 
                className="top-10 right-0 opacity-10 w-64 h-64 md:w-96 md:h-96 pointer-events-none" 
            />

            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-bg bg-clip-text text-transparent">
                            {t('title')}
                        </h2>
                        <p className="text-muted text-lg max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>
                </ScrollReveal>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ScrollReveal key={index} delay={index * 100}>
                            <div className="group bg-background rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-current/5 hover:border-primary/20">
                                <div className="relative h-48 w-full overflow-hidden">
                                     <Image 
                                        src={service.image} 
                                        alt={locale === 'ar' ? service.titleAr : service.titleEn}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                     />
                                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                </div>
                                
                                <div className="p-8 relative">
                                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform -mt-14 relative z-10 shadow-lg border-2 border-background">
                                        <service.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {locale === 'ar' ? service.titleAr : service.titleEn}
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        {locale === 'ar' ? service.descAr : service.descEn}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatsSection({ locale }: { locale: string }) {
    const stats = [
        { value: '500+', labelEn: 'Events Completed', labelAr: 'فعالية منجزة' },
        { value: '99.9%', labelEn: 'Happy Clients', labelAr: 'عملاء سعداء' },
        { value: '5+', labelEn: 'Years Experience', labelAr: 'سنوات خبرة' },
        { value: '10+', labelEn: 'Team Members', labelAr: 'عضو في الفريق' },
    ];

    return (
        <section className="w-full py-20 bg-background relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
             <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <ScrollReveal key={index} delay={index * 100} direction="up">
                            <div className="text-center p-6 rounded-2xl bg-secondary/50 border border-primary/5 hover:border-primary/20 transition-all hover:transform hover:-translate-y-1 relative">
                                 {/* Decorative dot */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/20" />
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                    <AnimatedCounter value={stat.value} />
                                </div>
                                <div className="text-muted">
                                    {locale === 'ar' ? stat.labelAr : stat.labelEn}
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection({ locale, t }: { locale: string; t: any }) {
    const isRTL = locale === 'ar';

    return (
        <section className="w-full py-20 bg-secondary relative overflow-hidden">
            <ParallaxImage 
                src="/images/flower1.png" 
                alt="Decorative" 
                speed={-0.1} 
                className="top-0 left-0 opacity-10 w-64 h-64 rotate-180 pointer-events-none" 
            />
            
            <div className="container mx-auto px-4 text-center relative z-10">
                <ScrollReveal>
                    <h2 className="text-4xl font-bold mb-6">
                        {t('title')}
                    </h2>
                    <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                    <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center justify-center px-8 py-4 gradient-primary text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-xl shadow-primary/25"
                    >
                        {t('button')}
                        <ArrowRightIcon className={`w-5 h-5 ml-2 ${isRTL ? 'flip-rtl' : ''}`} />
                    </Link>
                </ScrollReveal>
            </div>
        </section>
    );
}

// Inline Icons to avoid hydration issues and 
// ensure consistent rendering between server and client
function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 3v4" />
            <path d="M3 7h4" />
            <path d="M3 3h4" />
        </svg>
    );
}

function CalendarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function StarIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
