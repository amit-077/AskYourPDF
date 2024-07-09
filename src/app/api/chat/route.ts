import Chat from "@/models/Chat";
import { NextResponse, NextRequest } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/db/connect";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "embedding-001" });
const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT!, {
  namespace: process.env.ASTRA_DB_NAMESPACE,
});

connectDB();

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    let { chatId, message, databaseName } = data;

    let docContext = "";
    console.log(message);
    const result = await model.embedContent(message);
    const collection = db.collection(databaseName);

    const cursor = collection.find(
      {},
      {
        sort: {
          $vector: result.embedding.values,
        },
        limit: 5,
      }
    );

    const documents = await cursor.toArray();

    docContext = `
    START CONTEXT
    ${documents?.map((doc) => doc.description).join("\n")}
    END CONTEXT
    `;

    const outputResult = await model1.generateContent(`
      Act as a AI bot that will give answers based on the context provided to you. Make sure that you only answer the questions
      that are related to the context. If any question is asked out of the context, then simply respond as "I am sorry, I don't know the answer".
      You are allowed to elaborate or simplify the data of the context, but not change its meaning. Below is the given context.
      ${docContext}
      If the user asks you to explain or summarize, you can do that, but if it is out of context, simply respond as "I am sorry, I don't know the answer".
      And don't mention about the context in the answer. Only use the context data to answer the questions. The context will contain many data, but you have to just
      answer according to the question and appropriately, and not reply with the entire context data. Try to answer relevant according to the question. Do not use any kind
      of markdown syntax while answering.
      Now let's start. Below is the first question.
      ${message}
    `);
    let modelMessage = outputResult.response.text();

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        $push: {
          chat: [
            {
              role: "user",
              message: message,
            },
            {
              role: "model",
              message: outputResult.response.text(),
            },
          ],
        },
      },
      { new: true }
    );

    console.log(updatedChat);

    return NextResponse.json({ message: modelMessage }, { status: 200 });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ message: e?.message }, { status: 500 });
  }
};
