import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { originalUrl, shortCode } = body;

        // Validate input
        if (!originalUrl) {
            return NextResponse.json(
                { error: 'originalUrl is required' },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(originalUrl);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Validate shortCode format if provided
        if (shortCode) {
            if (!/^[A-Za-z0-9]{6,8}$/.test(shortCode)) {
                return NextResponse.json(
                    { error: 'Short code must be 6-8 alphanumeric characters' },
                    { status: 400 }
                );
            }

            // Check if shortCode already exists
            const existing = await prisma.link.findUnique({
                where: { shortCode },
            });

            if (existing) {
                return NextResponse.json(
                    { error: 'Short code already exists' },
                    { status: 409 }
                );
            }
        }

        // Generate random shortCode if not provided
        let finalShortCode = shortCode;
        if (!finalShortCode) {
            let attempts = 0;
            while (attempts < 10) {
                finalShortCode = generateRandomCode();
                const existing = await prisma.link.findUnique({
                    where: { shortCode: finalShortCode },
                });
                if (!existing) break;
                attempts++;
            }
        }

        // Create the link
        const link = await prisma.link.create({
            data: {
                originalUrl,
                shortCode: finalShortCode!,
            },
        });

        return NextResponse.json(link, { status: 201 });
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/links - Get all links
export async function GET() {
    try {
        const links = await prisma.link.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(links);
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function to generate random code
function generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
