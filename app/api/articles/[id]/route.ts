import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/articles/[id]
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM articles WHERE id = ?',
            [params.id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/articles/[id]
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const id = params.id;

        const {
            title, slug, category, status, summary, content, coverImage, date,
            title_cn, summary_cn, content_cn,
            is_hot, hot_priority,
            is_hot_cn, hot_priority_cn,
        } = body;

        // Clear conflicting hot priorities (EN)
        if (is_hot && hot_priority) {
            await pool.query(
                'UPDATE articles SET is_hot = 0, hot_priority = NULL WHERE hot_priority = ? AND id != ?',
                [hot_priority, id]
            );
        }

        // Clear conflicting hot priorities (CN)
        if (is_hot_cn && hot_priority_cn) {
            await pool.query(
                'UPDATE articles SET is_hot_cn = 0, hot_priority_cn = NULL WHERE hot_priority_cn = ? AND id != ?',
                [hot_priority_cn, id]
            );
        }

        await pool.query(
            `UPDATE articles SET
        title = ?, slug = ?, category = ?, status = ?, summary = ?, content = ?, coverImage = ?, date = ?,
        title_cn = ?, summary_cn = ?, content_cn = ?,
        is_hot = ?, hot_priority = ?, is_hot_cn = ?, hot_priority_cn = ?
       WHERE id = ?`,
            [
                title, slug, category, status, summary, content, coverImage, date,
                title_cn || null, summary_cn || null, content_cn || null,
                is_hot ? 1 : 0, is_hot ? hot_priority : null,
                is_hot_cn ? 1 : 0, is_hot_cn ? hot_priority_cn : null,
                id,
            ]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/articles/[id]
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await pool.query('DELETE FROM articles WHERE id = ?', [params.id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
