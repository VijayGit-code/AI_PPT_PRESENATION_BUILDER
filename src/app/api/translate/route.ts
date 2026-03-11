import { NextResponse } from "next/server";
import { translate } from "@vitalets/google-translate-api";

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json(
        { message: "Text is required" },
        { status: 400 }
      );
    }

    const result = await translate(text, { to: lang });

    return NextResponse.json({
      translatedText: result.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Translation failed" },
      { status: 500 }
    );
  }
}