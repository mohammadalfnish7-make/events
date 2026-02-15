import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const [servicesCount, mediaCount] = await Promise.all([
            prisma.service.count(),
            prisma.media.count(),
        ]);

        // PageView may be missing if Prisma client was not regenerated after adding the model (e.g. stale Docker volume)
        let pageViewsCount = 0;
        if (typeof prisma.pageView?.count === 'function') {
            pageViewsCount = await prisma.pageView.count();
        }

        return NextResponse.json({
            services: servicesCount,
            media: mediaCount,
            pageViews: pageViewsCount,
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { services: 0, media: 0, pageViews: 0 },
            { status: 500 }
        );
    }
}
