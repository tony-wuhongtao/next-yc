import { NextResponse } from "next/server";
import test70 from "@/data/test70.json";

export async function GET() {
  return NextResponse.json(test70);
}