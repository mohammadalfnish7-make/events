import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

// GET all media
export async function GET() {
    try {
        const media = await prisma.media.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ media });
    } catch (error) {
        console.error('Failed to fetch media:', error);
        return NextResponse.json({ media: [] });
    }
}

// POST upload media
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const allowedVideoTypes = ['video/mp4', 'video/webm'];
        const isImage = allowedImageTypes.includes(file.type);
        const isVideo = allowedVideoTypes.includes(file.type);

        if (!isImage && !isVideo) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, MP4, WebM' },
                { status: 400 }
            );
        }

        // Max file size: 50MB
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 50MB' },
                { status: 400 }
            );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const ext = path.extname(file.name);
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filename = `${timestamp}-${randomStr}${ext}`;
        const filepath = path.join(uploadsDir, filename);

        // Write file to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Save to database
        const media = await prisma.media.create({
            data: {
                filename: file.name,
                path: `/uploads/${filename}`,
                type: isImage ? 'IMAGE' : 'VIDEO',
                size: file.size,
            },
        });

        return NextResponse.json({ media }, { status: 201 });
    } catch (error) {
        console.error('Failed to upload media:', error);
        return NextResponse.json(
            { error: 'Failed to upload media' },
            { status: 500 }
        );
    }
}
