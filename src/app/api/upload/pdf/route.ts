import { NextRequest, NextResponse } from "next/server";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, let multer handle it
  },
};

export const POST = async (request: NextRequest) => {
  try {
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
