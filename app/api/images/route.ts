import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/images?list=1  → returns list of uploaded images (id, filename, url)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        if (searchParams.get('list') !== '1') {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, filename, mime_type FROM images ORDER BY id DESC LIMIT 100'
        );

        const images = rows.map((r) => ({
            id: r.id,
            filename: r.filename,
            url: `/api/images/${r.id}`,
        }));

        return NextResponse.json({ images });
    } catch (error: any) {
        console.error('Images list error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
