import { NextRequest, NextResponse } from "next/server"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"

export const runtime = "nodejs"   // IMPORTANT for Buffer support

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      )
    }

    // Optional: Limit file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File too large (Max 5MB)" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let extractedText = ""

    // 🔹 TEXT FILE
    if (file.type === "text/plain") {
      extractedText = await file.text()
    }

    // 🔹 PDF FILE
    else if (file.type === "application/pdf") {
      const data = await pdfParse(buffer)
      extractedText = data.text
    }

    // 🔹 DOCX FILE
    else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    }

    else {
      return NextResponse.json(
        { message: "Unsupported file type" },
        { status: 400 }
      )
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { message: "No readable content found in file" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      text: extractedText,
    })

  } catch (error) {
    console.error("File processing error:", error)

    return NextResponse.json(
      { message: "Error processing file" },
      { status: 500 }
    )
  }
}