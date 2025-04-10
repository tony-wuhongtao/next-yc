import { NextResponse } from "next/server";
import test70 from "@/data/test70.json";
import test95 from "@/data/test95.json";
import test48 from "@/data/test48.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "95") {
    return NextResponse.json(test95);
  } else if (type === "48") {
    return NextResponse.json(test48);
  } else {
    return NextResponse.json(test70);
  }
}
