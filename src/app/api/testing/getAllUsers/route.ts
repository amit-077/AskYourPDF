import connectDB from "@/db/connect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export const GET = async (request: NextRequest) => {
  try {
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
