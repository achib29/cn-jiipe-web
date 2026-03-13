import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

// GET /api/site-content?section=hero
// Returns all fields for a section as { field_key: { en, cn } }
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const section = searchParams.get('section');

        let rows: RowDataPacket[];
        if (section) {
            [rows] = await pool.query<RowDataPacket[]>(
                'SELECT section, field_key, value_en, value_cn FROM site_content WHERE section = ?',
                [section]
            );
        } else {
            [rows] = await pool.query<RowDataPacket[]>(
                'SELECT section, field_key, value_en, value_cn FROM site_content ORDER BY section, field_key'
            );
        }

        // Convert to { field_key: { en, cn } } map for easy access
        const result: Record<string, { en: string | null; cn: string | null }> = {};
        for (const row of rows) {
            result[row.field_key] = {
                en: row.value_en,
                cn: row.value_cn,
            };
        }

        return NextResponse.json({ section, data: result });
    } catch (error) {
        console.error('site-content GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

// POST /api/site-content
// Body: { section, field_key, value_en?, value_cn? }
// Upserts a single field
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { section, field_key, value_en, value_cn } = body;

        if (!section || !field_key) {
            return NextResponse.json({ error: 'section and field_key are required' }, { status: 400 });
        }

        await pool.query<ResultSetHeader>(
            `INSERT INTO site_content (section, field_key, value_en, value_cn)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               value_en = IF(? IS NOT NULL, ?, value_en),
               value_cn = IF(? IS NOT NULL, ?, value_cn)`,
            [section, field_key, value_en ?? null, value_cn ?? null,
             value_en, value_en, value_cn, value_cn]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('site-content POST error:', error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
