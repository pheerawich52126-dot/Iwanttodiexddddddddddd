import { NextResponse } from "next/server";

// Mock Data สำหรับจำลองฐานข้อมูลผู้ใช้
let users = [
  { id: "1", name: "สมชาย สายลม", email: "somchai@example.com", role: "admin" },
  { id: "2", name: "สมศรี มณีโชติ", email: "somsri@example.com", role: "user" },
  { id: "3", name: "สมศักดิ์ รักดี", email: "somsak@example.com", role: "user" },
];

// Helper สำหรับดึงข้อมูล Body (รองรับทั้ง JSON, Form-encode และป้องกัน Error กรณี Body ว่าง)
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
// 1. GET By ID Function (/src/app/api/users/[id]/route.js)
//================================================================================
/**
 * Route Handler สำหรับ HTTP Method: GET
 * ทำหน้าที่ดึงข้อมูลผู้ใช้ตาม ID ที่ระบุ
 */
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
        message: "ดึงข้อมูลผู้ใช้สำเร็จ",
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
// 2. POST By ID Function (/src/app/api/users/[id]/route.js)
//================================================================================
/**
 * Route Handler สำหรับ HTTP Method: POST
 * ทำหน้าที่เพิ่ม/สร้าง หรืออัปเดตข้อมูลผู้ใช้ตาม ID ที่ระบุ
 */
export async function POST(request, { params }) {
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

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex !== -1) {
      // หากพบผู้ใช้เดิม -> ทำการอัปเดตข้อมูล
      users[userIndex] = {
        ...users[userIndex],
        ...body,
        id: id,
      };

      console.log({ success: true, message: `อัปเดตข้อมูลผู้ใช้ ID: ${id} สำเร็จ`, status: 200 });

      return NextResponse.json(
        {
          success: true,
          message: `อัปเดตข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
          data: users[userIndex],
        },
        { status: 200 }
      );
    } else {
      // หากยังไม่มีผู้ใช้นี้ -> สร้างใหม่ด้วย ID นี้
      const newUser = {
        id: id,
        name: body.name || `User ${id}`,
        email: body.email || `user${id}@example.com`,
        ...body,
      };
      users.push(newUser);

      console.log({ success: true, message: `สร้างข้อมูลผู้ใช้ ID: ${id} สำเร็จ`, status: 201 });

      return NextResponse.json(
        {
          success: true,
          message: `สร้างข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
          data: newUser,
        },
        { status: 201 }
      );
    }
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
// 3. PUT By ID Function (/src/app/api/users/[id]/route.js)
//================================================================================
/**
 * Route Handler สำหรับ HTTP Method: PUT
 * ทำหน้าที่อัปเดตข้อมูลผู้ใช้ตาม ID ที่ระบุ
 */
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
          message: "กรุณาระบุข้อมูลที่ต้องการอัปเดตในส่วน Body",
        },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: `ไม่พบผู้ใช้ ID: ${id} ที่ต้องการอัปเดต`,
        },
        { status: 404 }
      );
    }

    users[userIndex] = {
      ...users[userIndex],
      ...body,
      id: id,
    };

    console.log({ success: true, message: `อัปเดตข้อมูลผู้ใช้ ID: ${id} สำเร็จ`, status: 200 });

    return NextResponse.json(
      {
        success: true,
        message: `อัปเดตข้อมูลผู้ใช้ ID: ${id} สำเร็จ`,
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
// 4. DELETE By ID Function (/src/app/api/users/[id]/route.js)
//================================================================================
/**
 * Route Handler สำหรับ HTTP Method: DELETE
 * ทำหน้าที่ลบข้อมูลผู้ใช้ตาม ID ที่ระบุ
 */
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
