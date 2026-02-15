'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    value: string; // The full string e.g. "500+", "99.9%"
    duration?: number;
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Parse the value to get the number and suffix
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');
    const isFloat = value.includes('.');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    useEffect(() => {
        if (!hasAnimated) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeOut = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
            
            const currentCount = numericValue * easeOut(percentage);
            
            setCount(currentCount);

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(numericValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [hasAnimated, numericValue, duration]);

    return (
        <span ref={elementRef}>
            {isFloat ? count.toFixed(1) : Math.floor(count)}
            {suffix}
        </span>
    );
}
