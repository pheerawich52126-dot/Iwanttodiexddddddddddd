import { NextResponse } from 'next/server';
import db from '../../lib/db';

//================================================================================
// 5. งานสร้างเมธอด GET (ดึงข้อมูลจริงจากตาราง tbl_members ใน MySQL)
// URL: GET /api/users
//================================================================================
export async function GET() {
  try {
    // ดึงข้อมูลผู้ใช้ทั้งหมดจากตาราง tbl_members ในฐานข้อมูล db_shop
    const [rows] = await db.query('SELECT * FROM tbl_members');

    return NextResponse.json({
      status: 'ok',
      total: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('Database query error:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}
