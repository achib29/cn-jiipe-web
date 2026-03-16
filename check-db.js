const mysql = require('mysql2/promise');
const fs = require('fs');
const envLines = fs.readFileSync('d:/WEBSITE/11.20.25/cn-jiipe-web/.env.local', 'utf8').split('\n');
const env = {};
for (const line of envLines) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i < 0) continue;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}
async function run() {
  const pool = await mysql.createPool({
    host: env.DB_HOST || 'localhost',
    port: Number(env.DB_PORT || 3306),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  });
  const c = await pool.getConnection();
  const [rows] = await c.query(
    "SELECT CHAR_LENGTH(content) AS len, LOCATE('<img', content) AS img_pos FROM articles WHERE slug = 'investing-in-indonesia'"
  );
  console.log('Content length:', rows[0].len, '| img tag at position:', rows[0].img_pos);
  c.release();
  await pool.end();
}
run().catch(console.error);
