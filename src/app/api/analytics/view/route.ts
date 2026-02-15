import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        if (typeof prisma.pageView?.create !== 'function') {
            return NextResponse.json({ ok: true }); // no-op if client has no PageView (e.g. stale generate)
        }
        const body = await request.json().catch(() => ({}));
        const path = typeof body.path === 'string' ? body.path : null;

        await prisma.pageView.create({
            data: { path: path ?? undefined },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Analytics view error:', error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
