import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const audioDir = path.join(process.cwd(), "data/meows");
    const files = await fs.readdir(audioDir);

    // 过滤并格式化MP3文件
    const audioFiles = files
      .filter((file) => path.extname(file).toLowerCase() === ".mp3")
      .map((file) => ({
        filename: file,
        url: `/api/meows/${encodeURIComponent(file)}`,
      }));

    return NextResponse.json({ data: audioFiles });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read audio directory" + error },
      { status: 500 }
    );
  }
}
