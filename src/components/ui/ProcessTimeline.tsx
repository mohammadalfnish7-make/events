'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

interface Step {
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
}

const steps: Step[] = [
    {
        titleEn: '1. Consultation',
        titleAr: '١. الاستشارة',
        descEn: 'We meet to understand your vision, requirements, and budget.',
        descAr: 'نلتقي لفهم رؤيتك ومتطلباتك وميزانيتك.',
    },
    {
        titleEn: '2. Planning',
        titleAr: '٢. التخطيط',
        descEn: 'Our team creates a detailed plan, selecting venues and vendors.',
        descAr: 'يقوم فريقنا بإنشاء خطة مفصلة واختيار الأماكن والموردين.',
    },
    {
        titleEn: '3. Design & Decor',
        titleAr: '٣. التصميم والديكور',
        descEn: 'We craft the visual identity and atmosphere of your event.',
        descAr: 'نصيغ الهوية البصرية وجو فعاليتك.',
    },
    {
        titleEn: '4. Execution',
        titleAr: '٤. التنفيذ',
        descEn: 'On the big day, we manage everything to ensure perfection.',
        descAr: 'في اليوم الكبير، ندير كل شيء لضمان الكمال.',
    },
];

export default function ProcessTimeline() {
    const locale = useLocale();
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const elementHeight = rect.height;

                // Start filling when the top matches the center of the screen
                const startPoint = windowHeight * 0.8;
                const scrollTop = startPoint - rect.top;
                
                let percentage = (scrollTop / elementHeight) * 100;
                percentage = Math.max(0, Math.min(100, percentage));
                
                setProgress(percentage);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} className="relative py-20 max-w-4xl mx-auto">
            {/* Main Line Background */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-secondary -translate-x-1/2" />
            
            {/* Filled Line */}
            <div 
                className="absolute left-4 md:left-1/2 top-0 w-1 bg-primary -translate-x-1/2 transition-all duration-100 ease-out"
                style={{ height: `${progress}%` }}
            />

            <div className="space-y-24">
                {steps.map((step, index) => {
                    const stepThreshold = (index / (steps.length - 1)) * 100;
                    // Activate slightly before the line reaches it
                    const isActive = progress >= (stepThreshold - 5); 

                    return (
                        <div key={index} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            
                            {/* Dot on the line */}
                            <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-background z-10 transition-colors duration-500 shadow-lg
                                ${isActive ? 'bg-primary scale-125' : 'bg-gray-300'}`} 
                            />

                            {/* Content Side */}
                            <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                                <div className={`transition-all duration-700 transform ${isActive ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-10'}`}>
                                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                                        {locale === 'ar' ? step.titleAr : step.titleEn}
                                    </h3>
                                    <p className="text-muted text-lg">
                                        {locale === 'ar' ? step.descAr : step.descEn}
                                    </p>
                                </div>
                            </div>

                            {/* Empty Side for layout balance on desktop */}
                            <div className="hidden md:block md:w-5/12" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
