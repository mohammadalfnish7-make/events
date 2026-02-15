import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all services
export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json({ services });
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json({ services: [] });
    }
}

// POST create new service
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const service = await prisma.service.create({
            data: {
                titleEn: body.titleEn,
                titleAr: body.titleAr,
                descriptionEn: body.descriptionEn,
                descriptionAr: body.descriptionAr,
                price: body.price || null,
                image: body.image || null,
                isActive: body.isActive ?? true,
            },
        });

        return NextResponse.json({ service }, { status: 201 });
    } catch (error) {
        console.error('Failed to create service:', error);
        return NextResponse.json(
            { error: 'Failed to create service' },
            { status: 500 }
        );
    }
}
