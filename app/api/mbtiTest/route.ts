import { NextResponse } from "next/server";
import test70 from "@/data/test70.json";
import test93 from "@/data/test93.json";
import test48 from "@/data/test48.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "93") {
    return NextResponse.json(test93);
  }
  else if (type === "48") {
    return NextResponse.json(test48); 
  }else{
        return NextResponse.json(test70);
  }

}