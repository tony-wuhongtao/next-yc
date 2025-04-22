import { NextResponse } from "next/server";
import hld120 from "@/data/hld120.json";
import hld60 from "@/data/hld60.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "60") {
    return NextResponse.json(hld60);
  } else {
    return NextResponse.json(hld120);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { R, I, A, S, E, C, q } = body;

    const response = await fetch(
      "http://n8n.xiaotuxp.com/webhook/b1d39723-0e92-4a9d-ba69-52f935cfefbd",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          R,
          I,
          A,
          S,
          E,
          C,
          q,
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("请求处理失败:", error); // 添加错误日志
    return NextResponse.json({ error: "请求处理失败" }, { status: 500 });
  }
}
