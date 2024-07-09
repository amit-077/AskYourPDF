import connectDB from "@/db/connect";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export const GET = async (request: NextRequest) => {
  try {
    const chats = await Chat.find();
    return NextResponse.json({ chats }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
