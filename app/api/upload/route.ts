import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Max 5MB.' },
                { status: 400 }
            );
        }

        // Read file as buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate clean filename
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${Date.now()}-${cleanName}`;

        // Store in MySQL
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO images (filename, mime_type, data) VALUES (?, ?, ?)',
            [fileName, file.type, buffer]
        );

        const imageId = result.insertId;
        const publicUrl = `/api/images/${imageId}`;

        return NextResponse.json({ url: publicUrl, success: true });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
