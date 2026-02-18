import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/articles/by-slug/[slug]
export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM articles WHERE slug = ?',
            [params.slug]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
