import { NextResponse } from "next/server";

// Mock Data ข้อมูลผู้ใช้จำลอง (แชร์ก้อนข้อมูลร่วมกันในเซิร์ฟเวอร์)
if (!globalThis.users) {
  globalThis.users = [
    { id: "1", name: "สมชาย สายลม", email: "somchai@example.com", role: "admin" },
    { id: "2", name: "สมศรี มณีโชติ", email: "somsri@example.com", role: "user" },
    { id: "3", name: "สมศักดิ์ รักดี", email: "somsak@example.com", role: "user" },
  ];
}
let users = globalThis.users;

// Helper สำหรับดึงข้อมูล Body
async function parseBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }
  const text = await request.text();
  return text ? JSON.parse(text) : {};
}

//================================================================================
// 1. GET Function (/src/app/api/users/route.js)
// หน้าที่: ดึงข้อมูลผู้ใช้ทั้งหมดในระบบ (Get All Users)
// URL: GET /api/users
//================================================================================
export async function GET() {
  try {
    console.log({ success: true, message: "ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ", total: users.length, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: "ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ",
        total: users.length,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

//================================================================================
// 2. POST Function (/src/app/api/users/route.js)
// หน้าที่: เพิ่มผู้ใช้คนใหม่เข้าสู่ระบบ (Create User)
// URL: POST /api/users
//================================================================================
export async function POST(request) {
  try {
    let body = {};
    try {
      body = await parseBody(request);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "รูปแบบข้อมูล Body ไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    const nextId = String(users.length > 0 ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1 : 1);

    const newUser = {
      id: body.id ? String(body.id) : nextId,
      name: body.name || `User ${nextId}`,
      email: body.email || `user${nextId}@example.com`,
      role: body.role || "user",
      ...body,
    };

    users.push(newUser);

    console.log({ success: true, message: "เพิ่มผู้ใช้ใหม่สำเร็จ", data: newUser, status: 201 });

    return NextResponse.json(
      {
        success: true,
        message: "เพิ่มข้อมูลสำเร็จ",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
