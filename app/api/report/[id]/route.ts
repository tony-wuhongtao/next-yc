import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 修改 params 为 Promise 类型
) {
  try {
    const { id } = await params; // 保持 await 获取 id
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
