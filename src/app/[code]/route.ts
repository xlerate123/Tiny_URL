import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        // Find the link
        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            return new NextResponse('Not Found', { status: 404 });
        }

        // Increment click count and update lastClickedAt
        await prisma.link.update({
            where: { shortCode: code },
            data: {
                clicks: link.clicks + 1,
                lastClickedAt: new Date(),
            },
        });

        // Perform 302 redirect
        return NextResponse.redirect(link.originalUrl, { status: 302 });
    } catch (error) {
        console.error('Error redirecting:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
