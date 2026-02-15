import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE media
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Get media record first
        const media = await prisma.media.findUnique({
            where: { id },
        });

        if (!media) {
            return NextResponse.json(
                { error: 'Media not found' },
                { status: 404 }
            );
        }

        // Delete file from disk
        const filepath = path.join(process.cwd(), 'public', media.path);
        try {
            await unlink(filepath);
        } catch (e) {
            // File might not exist, continue anyway
            console.warn('File not found on disk:', filepath);
        }

        // Delete from database
        await prisma.media.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete media:', error);
        return NextResponse.json(
            { error: 'Failed to delete media' },
            { status: 500 }
        );
    }
}
