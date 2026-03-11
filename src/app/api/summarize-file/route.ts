 import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import * as yauzl from "yauzl";

import { generateSummaryAndLinks } from "@/actions/chatGPT";

export const runtime = "nodejs";

// -------- PPTX TEXT EXTRACTION --------
function extractPPTXText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let text = "";

    yauzl.fromBuffer(buffer, { lazyEntries: true }, (err: Error | null, zipfile?: any) => {
      if (err || !zipfile) return reject(err);

      zipfile.readEntry();

      zipfile.on("entry", (entry: any) => {
        if (
          entry.fileName.startsWith("ppt/slides/") &&
          entry.fileName.endsWith(".xml")
        ) {
          zipfile.openReadStream(entry, (err: Error | null, stream?: NodeJS.ReadableStream) => {
            if (err || !stream) return reject(err);

            let content = "";

            stream.on("data", (chunk: Buffer) => {
              content += chunk.toString();
            });

            stream.on("end", () => {
              const matches = content.match(/<a:t>(.*?)<\/a:t>/g);

              if (matches) {
                matches.forEach((m: string) => {
                  text += m.replace(/<\/?a:t>/g, "") + " ";
                });
              }

              zipfile.readEntry();
            });
          });
        } else {
          zipfile.readEntry();
        }
      });

      zipfile.on("end", () => resolve(text));
    });
  });
}

// -------- API ROUTE --------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File too large (Max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    // TEXT / CSV
    if (file.type.startsWith("text/")) {
      extractedText = buffer.toString("utf-8");
    }

    // JSON
    else if (file.type === "application/json") {
      extractedText = buffer.toString("utf-8");
    }

    // PDF
    else if (file.type === "application/pdf") {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    }

    // DOCX
    else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    // PPTX
    else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      extractedText = await extractPPTXText(buffer);
    }

    else {
      return NextResponse.json(
        { message: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Prevent empty extraction
    if (!extractedText.trim()) {
      return NextResponse.json(
        { message: "Could not extract text from file" },
        { status: 400 }
      );
    }

    // -------- SEND TO AI --------
    const aiResponse = await generateSummaryAndLinks(extractedText);

    if (aiResponse.status !== 200) {
      throw new Error("AI generation failed");
    }

    return NextResponse.json({
      heading: aiResponse.heading,
      summary: aiResponse.summary,
      youtubeLinks: aiResponse.youtubeLinks,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      { message: "Extraction or AI generation failed" },
      { status: 500 }
    );
  }
}