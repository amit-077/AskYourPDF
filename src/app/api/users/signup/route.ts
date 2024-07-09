import connectDB from "@/db/connect";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
