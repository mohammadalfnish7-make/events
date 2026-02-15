'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    offset?: number; // Distance in pixels to translate
}

export default function ScrollReveal({
    children,
    className = '',
    direction = 'up',
    delay = 0,
    duration = 800,
    offset = 50,
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before full view
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const getTransform = () => {
        if (isVisible) return 'translate(0, 0)';
        switch (direction) {
            case 'up':
                return `translateY(${offset}px)`;
            case 'down':
                return `translateY(-${offset}px)`;
            case 'left':
                return `translateX(${offset}px)`;
            case 'right':
                return `translateX(-${offset}px)`;
            default:
                return `translateY(${offset}px)`;
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}
