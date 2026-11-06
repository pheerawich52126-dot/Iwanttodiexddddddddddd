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
// 1. GET By ID (/src/app/api/users/[id]/route.js)
// หน้าที่: ดึงข้อมูลผู้ใช้เฉพาะคนตาม ID
// URL: GET /api/users/[id]
//================================================================================
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const user = users.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: `ไม่พบผู้ใช้ ID: ${id}`,
        },
        { status: 404 }
      );
    }

    console.log({ success: true, message: `ดึงข้อมูลผู้ใช้ ID: ${id} สำเร็จ`, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: `ดึงข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
        data: user,
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
// 2. PUT By ID (/src/app/api/users/[id]/route.js)
// หน้าที่: แก้ไขข้อมูลผู้ใช้เฉพาะคนตาม ID
// URL: PUT /api/users/[id]
//================================================================================
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณาระบุข้อมูลที่ต้องการแก้ไขใน Body",
        },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: `ไม่พบผู้ใช้ ID: ${id} ที่ต้องการแก้ไข`,
        },
        { status: 404 }
      );
    }

    // อัปเดตข้อมูล
    users[userIndex] = {
      ...users[userIndex],
      ...body,
      id: id,
    };

    console.log({ success: true, message: `แก้ไขข้อมูลผู้ใช้ ID: ${id} สำเร็จ`, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: `แก้ไขข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
        data: users[userIndex],
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
// 3. DELETE By ID (/src/app/api/users/[id]/route.js)
// หน้าที่: ลบผู้ใช้เฉพาะคนตาม ID
// URL: DELETE /api/users/[id]
//================================================================================
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: `ไม่พบผู้ใช้ ID: ${id} ที่ต้องการลบ`,
        },
        { status: 404 }
      );
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    console.log({ success: true, message: `ลบข้อมูลผู้ใช้ ID: ${id} สำเร็จ`, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: `ลบข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
        data: deletedUser,
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
