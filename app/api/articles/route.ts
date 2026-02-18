import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

// GET /api/articles — list articles, optional ?status=Published filter
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = searchParams.get('limit');
        const exclude = searchParams.get('exclude');

        let query = 'SELECT * FROM articles';
        const params: any[] = [];
        const conditions: string[] = [];

        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }

        if (exclude) {
            conditions.push('id != ?');
            params.push(Number(exclude));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY id DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(Number(limit));
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error('GET /api/articles error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/articles — create article
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            title, slug, category, status, summary, content, coverImage, date,
            title_cn, summary_cn, content_cn,
            is_hot, hot_priority,
            is_hot_cn, hot_priority_cn,
        } = body;

        // Clear conflicting hot priorities (EN)
        if (is_hot && hot_priority) {
            await pool.query(
                'UPDATE articles SET is_hot = 0, hot_priority = NULL WHERE hot_priority = ?',
                [hot_priority]
            );
        }

        // Clear conflicting hot priorities (CN)
        if (is_hot_cn && hot_priority_cn) {
            await pool.query(
                'UPDATE articles SET is_hot_cn = 0, hot_priority_cn = NULL WHERE hot_priority_cn = ?',
                [hot_priority_cn]
            );
        }

        const [result] = await pool.query(
            `INSERT INTO articles 
        (title, slug, category, status, summary, content, coverImage, date,
         title_cn, summary_cn, content_cn,
         is_hot, hot_priority, is_hot_cn, hot_priority_cn)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, slug, category, status, summary, content, coverImage, date,
                title_cn || null, summary_cn || null, content_cn || null,
                is_hot ? 1 : 0, is_hot ? hot_priority : null,
                is_hot_cn ? 1 : 0, is_hot_cn ? hot_priority_cn : null,
            ]
        );

        return NextResponse.json({ success: true, id: (result as any).insertId });
    } catch (error: any) {
        console.error('POST /api/articles error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
