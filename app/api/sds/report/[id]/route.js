import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET(
  request,
  { params }
) {
  try {
    const report = await prisma.sdsreport.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return NextResponse.json({ error: "报告未找到" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("获取报告失败:", error);
    return NextResponse.json({ error: "获取报告失败" }, { status: 500 });
  }
}
