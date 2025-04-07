import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(request: Request) {
  try {
    const { ip, url, client } = await request.json();

    // 记录到数据库
    await prisma.log.create({
      data: {
        ip,
        url,
        client,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("记录日志失败:", error);
    return NextResponse.json(
      { success: false, error: "记录日志失败" },
      { status: 500 }
    );
  }
}
