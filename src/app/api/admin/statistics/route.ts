import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = session.user as JwtPayload;

        if (token.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('timeRange') || 'day';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let dateFilter = {};
        const now = new Date();

        switch (timeRange) {
            case 'day':
                dateFilter = {
                    createdAt: {
                        gte: new Date(now.setHours(0, 0, 0, 0)),
                    },
                };
                break;
            case 'week':
                dateFilter = {
                    createdAt: {
                        gte: new Date(now.setDate(now.getDate() - 7)),
                    },
                };
                break;
            case 'month':
                dateFilter = {
                    createdAt: {
                        gte: new Date(now.setDate(1)),
                    },
                };
                break;
            case 'year':
                dateFilter = {
                    createdAt: {
                        gte: new Date(now.setMonth(0, 1)),
                    },
                };
                break;
            case 'custom':
                if (startDate && endDate) {
                    dateFilter = {
                        createdAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    };
                }
                break;
        }

        // Get total users
        const totalUsers = await prisma.user.count();

        // Get total visits (from analytics table)
        const totalVisits = await prisma.analytics.count({
            where: dateFilter,
        });

        // Get total transactions
        const totalTransactions = await prisma.transaction.count({
            where: dateFilter,
        });

        // Get visits by country
        const visitsByCountry = await prisma.analytics.groupBy({
            by: ['country'],
            where: dateFilter,
            _count: {
                country: true,
            },
        });

        const countries = visitsByCountry.map(visit => ({
            country: visit.country,
            count: visit._count.country,
        }));

        const statistics = {
            totalUsers,
            totalVisits,
            totalTransactions,
            countries,
        };

        return NextResponse.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 