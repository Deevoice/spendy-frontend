import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function POST(request: Request) {
    try {
        const token = await getToken({ req: request });
        const userId = token?.sub || null;
        const { country, page } = await request.json();

        await prisma.analytics.create({
            data: {
                userId,
                country: country || 'Unknown',
                page,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving analytics:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 