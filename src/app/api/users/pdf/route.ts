import connectDB from "@/db/connect";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const { userId, pdfURL, databaseName } = await request.json();
    console.log(userId, pdfURL, databaseName);

    const data = await Chat.create({
      pdfURL,
      chatUser: userId,
      collectionName: databaseName,
    });

    return NextResponse.json({ message: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
