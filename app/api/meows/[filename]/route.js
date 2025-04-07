import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request,
  { params } 
) {
  try {
    const { filename } = params; // 使用 params
    console.log("Requested filename:", filename);
    const filePath = path.join(process.cwd(), "data/meows", filename);
    console.log("Resolved file path:", filePath);

    // 验证文件扩展名
    if (path.extname(filename).toLowerCase() !== ".mp3") {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // 检查文件是否存在
    try {
      await fs.promises.access(filePath);
    } catch (err) {
      console.error("File access error:", err);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 创建可读流
    const fileStream = fs.createReadStream(filePath);

    // 处理中文字符编码
    const encodedFilename = encodeURIComponent(filename);

    return new Response(fileStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename="${encodedFilename}"`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
