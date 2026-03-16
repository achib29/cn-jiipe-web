import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

// Auto-create images table if it doesn't exist
async function ensureImagesTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            data LONGBLOB NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
}

export async function POST(request: Request) {
    try {
        await ensureImagesTable();

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

        // Validate file size (max 8MB)
        if (file.size > 8 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Max 8MB.' },
                { status: 400 }
            );
        }

        // Read file as buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate clean filename
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${cleanName}`;

        // Store in MySQL
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO images (filename, mime_type, data) VALUES (?, ?, ?)',
            [fileName, file.type, buffer]
        );

        const imageId = result.insertId;

        // Return relative URL — works on all domains
        const publicUrl = `/api/images/${imageId}`;

        return NextResponse.json({ url: publicUrl, id: imageId, success: true });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
