import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale: string = 'en', currency: string = 'AED') {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(price);
}
