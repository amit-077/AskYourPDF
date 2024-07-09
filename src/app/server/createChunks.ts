"use server";
import PDFParser from "pdf-parse";

export const createChunks = async (file: any) => {
  console.log(file);
  const pdfText = await PDFParser(file);
  console.log("Below is the text");
  console.log(pdfText);
  let cleanedText = pdfText.text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/[^\x00-\x7F]+/g, "")
    .trim();

  const chunkSize = 1000;
  const words = cleanedText.split(" ");
  let chunks = [];
  let currentChunk = "";
  let id = 1;

  for (let word of words) {
    if ((currentChunk + word + " ").length <= chunkSize) {
      currentChunk += word + " ";
    } else {
      chunks.push({
        id: id++,
        data: currentChunk.trim(),
      });
      currentChunk = word + " ";
    }
  }

  if (currentChunk.trim() !== "") {
    chunks.push({
      id: id++,
      data: currentChunk.trim(),
    });
  }

  console.log("Chunks created ...");
  console.log("Creating Collection");
  console.log(chunks);
};
