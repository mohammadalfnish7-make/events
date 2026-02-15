import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single service
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const service = await prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ service });
    } catch (error) {
        console.error('Failed to fetch service:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service' },
            { status: 500 }
        );
    }
}

// PATCH update service
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const service = await prisma.service.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ service });
    } catch (error) {
        console.error('Failed to update service:', error);
        return NextResponse.json(
            { error: 'Failed to update service' },
            { status: 500 }
        );
    }
}

// DELETE service
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        await prisma.service.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete service:', error);
        return NextResponse.json(
            { error: 'Failed to delete service' },
            { status: 500 }
        );
    }
}
