// import OpenAI from "openai";

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const  openai = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY!
// );
 import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview", // safest free-tier model
});

export async function generateAIResponse(
  prompt: string
): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json", // 🔥 forces clean JSON
      },
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}


