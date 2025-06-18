import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const accountId = params.id;

        // Проверяем, существует ли счет и принадлежит ли он пользователю
        const account = await prisma.account.findFirst({
            where: {
                id: accountId,
                user: {
                    email: session.user.email
                }
            }
        });

        if (!account) {
            return new NextResponse('Account not found', { status: 404 });
        }

        // Удаляем все транзакции, связанные со счетом
        await prisma.transaction.deleteMany({
            where: {
                accountId: accountId
            }
        });

        // Удаляем счет
        await prisma.account.delete({
            where: {
                id: accountId
            }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting account:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 