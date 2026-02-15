import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        
        // Convert array of key-value pairs to an object
        const settingsObject = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(settingsObject);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        // Use a transaction to update multiple settings
        await prisma.$transaction(
            Object.entries(body).map(([key, value]) => 
                prisma.setting.upsert({
                    where: { key },
                    update: { value: String(value) },
                    create: { key, value: String(value) },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
