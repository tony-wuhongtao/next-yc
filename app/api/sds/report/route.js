import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(request) {
  try {
    const { name, R, I, A, S, E, C, q, content } = await request.json();

    const report = await prisma.sdsreport.create({
      data: {
        name,
        R: String(R),
        I: String(I),
        A: String(A),
        S: String(S),
        E: String(E),
        C: String(C),
        q: String(q),
        content,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: report.id,
      },
    });
  } catch (error) {
    // 明确指定error类型为any
    console.error("保存报告失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: "保存报告失败: " + (error.message || "未知错误"),
      },
      { status: 500 }
    );
  }
}

// 获取报告列表
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  try {
    const reports = await prisma.sdsreport.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.sdsreport.count();

    return NextResponse.json({
      data: reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("获取报告失败:", error); // 添加错误日志
    return NextResponse.json({ error: "获取报告失败" }, { status: 500 });
  }
}
