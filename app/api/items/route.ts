import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
    try {
        const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(items);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content } = body;
        if (!title || typeof title !== 'string') {
            return NextResponse.json({ error: 'Missing title' }, { status: 400 });
        }
        const item = await prisma.item.create({ data: { title, content } });
        return NextResponse.json(item, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
