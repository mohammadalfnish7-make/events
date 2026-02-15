'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ParallaxImageProps {
    src: string;
    alt: string;
    speed?: number; // Speed multiplier (e.g., 0.5 for half speed)
    className?: string;
    width?: number;
    height?: number;
}

export default function ParallaxImage({
    src,
    alt,
    speed = 0.5,
    className = '',
    width = 200,
    height = 200,
}: ParallaxImageProps) {
    const [offset, setOffset] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // Only animate if element is somewhat in view (plus buffer)
                if (rect.top < windowHeight && rect.bottom > 0) {
                    // Calculate relative scroll position
                    const relativeScroll = scrollY * speed;
                    setOffset(relativeScroll);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial calculation
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div
            ref={ref}
            className={`absolute ${className}`}
            style={{
                transform: `translateY(${offset}px)`,
                transition: 'transform 0.1s linear', // Smooth out the movement slightly
                willChange: 'transform',
            }}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="object-contain"
            />
        </div>
    );
}
