import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT data, mime_type, filename FROM images WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const image = rows[0];
        const buffer = image.data as Buffer;
        const uint8 = new Uint8Array(buffer);

        return new NextResponse(uint8, {
            status: 200,
            headers: {
                'Content-Type': image.mime_type,
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Disposition': `inline; filename="${image.filename}"`,
            },
        });
    } catch (error: any) {
        console.error('Image serve error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
