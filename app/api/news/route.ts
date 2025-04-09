import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

// 创建新闻
export async function POST(request: Request) {
  try {
    const text = await request.text(); // 获取原始文本
    const [key, content] = text.split("||"); // 第一行为 key，第二行开始为内容

    if (key.trim() !== "1234500000") {
      return NextResponse.json(
        { success: false, error: "无效的 key" },
        { status: 401 }
      );
    }

    const news = await prisma.news.create({
      data: {
        content: content.replace(/\\n/g, "\n"), // 确保换行符被正确存储
      },
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("创建新闻失败:", error); // 明确使用 error
    return NextResponse.json(
      { success: false, error: "创建新闻失败" },
      { status: 500 }
    );
  }
}

// 获取新闻列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageStr = searchParams.get("page") || "1"; // 如果 page 为 null，使用默认值 "1"
  const page = parseInt(pageStr); // 转换为数字
  const limit = 4; // 每页显示 4 条新闻

  try {
    const news = await prisma.news.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.news.count();

    return NextResponse.json({
      data: news,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("获取新闻失败:", error); // 明确使用 error
    return NextResponse.json({ error: "获取新闻失败" }, { status: 500 });
  }
}
