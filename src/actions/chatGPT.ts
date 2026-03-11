"use server";

import client from "@/lib/prisma";
import { ContentItem, ReturnProps, Slide } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { generateAIResponse } from "./openAI";
 

export const generateCreativePrompt = async (
  userPrompt: string
): Promise<ReturnProps> => {
  const finalPrompt = `
You MUST respond with strictly valid JSON.

Create a coherent and relevant outline for:
${userPrompt}

The outline must contain more than 5 single-sentence points.

Return format:
{
  "outlines": [
    "Point 1",
    "Point 2",
    "Point 3"
  ]
}

No markdown.
yes explanation.
yes extra text.
`;
// const finalPrompt = `
// You MUST respond with strictly valid JSON.

// Create a detailed outline for:
// ${userPrompt}

// Each outline point must be rich and descriptive (2-3 lines long).

// The outline must contain 5-9 strong points.

// Return format:
// {
//   "outlines": [
//     "Point 1",
//     "Point 2",
//     "Point 3"
//   ]
// }

// No markdown.
// No explanation.
// No extra text.
// `;

  try {
    const text = await generateAIResponse(finalPrompt);

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON returned from AI");

    const jsonResponse = JSON.parse(match[0]);

    return { status: 200, data: jsonResponse };
  } catch (error) {
    console.error("Outline Error:", error);
    return {
      status: 500,
      error: "Failed to generate outline " + error,
    };
  }
};

 

const findImageComponents = (contentObject: ContentItem): ContentItem[] => {
  const images: ContentItem[] = [];

  if (contentObject.type === "image") {
    images.push(contentObject);
  }

  if (Array.isArray(contentObject.content)) {
    contentObject.content.forEach((child) => {
      images.push(...findImageComponents(child as ContentItem));
    });
  } else if (
    contentObject.content &&
    typeof contentObject.content === "object"
  ) {
    images.push(...findImageComponents(contentObject.content));
  }

  return images;
};
 
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

 
export const generateImageURL = async (
  prompt: string
): Promise<string> => {
  try {
    const apiKey = process.env.POLLINATIONS_API_KEY;
//     const improvedPrompt = `
// Create a highly realistic, professional image based on the following description.

// Description: ${prompt}

// Requirements:
// - Photorealistic style
// - Professional presentation quality
// - Realistic lighting and natural shadows
// - High dynamic range (HDR)
// - Sharp focus with fine details
// - High resolution (4K quality)
// - Balanced composition
// - Clean and visually appealing background
// - Proper depth of field
// - Cinematic lighting
// - Natural skin tones (if people are present)
// - Modern and realistic environment
// - Corporate or formal aesthetic (if applicable)
// - No cartoon, illustration, painting, or abstract styles
// - No distortion or unrealistic proportions
// - No watermarks or logos
// - English text only (if any visible text appears)
// `;
  const improvedPrompt = `Ultra high-resolution 4K professional corporate presentation image.${prompt}Shot with DSLR camera, 85mm lens, cinematic lighting, ultra sharp, realistic textures, volumetric lighting, high contrast, global illumination, professional stock photography style.`;
    const encodedPrompt = encodeURIComponent(improvedPrompt.trim()); 
   //return  `https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
  return `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=512&height=512&key=${apiKey}`;
  } catch (error) {
    console.error("Image Generation Error:", error); 
    return `https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
  }
};
 
const replaceImagesWithPlaceholders = async (
  layout: Slide
): Promise<void> => {
  const imageComponents = findImageComponents(layout.content);

  for (const component of imageComponents) {
    console.log("Generated Image URL:", component.content);
    // 🔥 Only generate if empty
    if (!component.content || component.content === "") {
      component.content = await generateImageURL(
        component.alt || "presentation image"
      );
    }
  }
};
 

export const generateLayoutsJSON = async (
  outlines: string[]
): Promise<ReturnProps> => {
//   const prompt = `
// You are a highly creative AI that generates JSON-based layouts for presentations.

// AVAILABLE LAYOUT TYPES:
// "accentLeft", "accentRight", "imageAndText", "textAndImage",
 

// AVAILABLE CONTENT TYPES:
// "title", "heading1", "heading2", "heading3",
// "paragraph", "bulletList", "numberedList",
// "image", "column", "resizable-column"

// Use these outlines:
// ${JSON.stringify(outlines)}

// CRITICAL RULES:

// 1. Return ONLY strictly valid JSON array.
// 2. No markdown.
// 3. No explanations.
// 4. No extra text.
// 5. Every slide must include at least:
//    - 1 text element
//    - 1 image element  
// 6. Image format:
//    {
//      "id": "unique-id",
//      "type": "image",
//      "name": "Image",
//      "content": "",
//      "alt": "professional image description"
//    }

// TOP LEVEL FORMAT:

// [
//   {
//     "id": "unique-id",
//     "slideName": "Slide Name",
//     "type": "layoutType",
//     "className": "optional",
//     "content": {
//       "id": "unique-id",
//       "type": "column",
//       "name": "Column",
//       "content": []
//     }
//   }
// ]

// Ensure structure matches exactly, must and should use and structure matches exactly above AVAILABLE LAYOUT TYPES.
// `;
// const prompt = `
// You are a highly creative AI that generates detailed JSON-based presentation slides.

// AVAILABLE LAYOUT TYPES:
// "accentLeft", "accentRight", "imageAndText", "textAndImage"

// AVAILABLE CONTENT TYPES:
// "title", "heading1", "heading2", "heading3",
// "paragraph", "bulletList", "numberedList",
// "image", "column", "resizable-column"

// Use these outlines:
// ${JSON.stringify(outlines)}

// CRITICAL RULES:

// 1. Return ONLY strictly valid JSON array.
// 2. No markdown.
// 3. No explanations.
// 4. No extra text.
// 5. Every slide MUST include:
//    - 1 title or heading
//    - 3–5 lines of meaningful text content
//    - At least 1 image element
// 6. Text content must be detailed, informative, and professional.
// 7. Do NOT generate single-line paragraphs.
// 8. Use bulletList or numberedList when appropriate to expand content.
// 9. Each slide must be content-rich and presentation-ready.
// 10. Content array must contain multiple structured elements (not a single paragraph).

// Image format MUST be:

// {
//   "id": "unique-id",
//   "type": "image",
//   "name": "Image",
//   "content": "",
//   "alt": "professional image description"
// }

// TOP LEVEL FORMAT:

// [
//   {
//     "id": "unique-id",
//     "slideName": "Slide Name",
//     "type": "layoutType",
//     "className": "optional",
//     "content": {
//       "id": "unique-id",
//       "type": "column",
//       "name": "Column",
//       "content": []
//     }
//   }
// ]

// Ensure structure matches EXACTLY.
// Every slide must contain 3–5 meaningful content lines.
// Do NOT generate short slides.
// `;
const prompt = `
You are an expert presentation designer AI that generates professional, structured, and visually balanced slide layouts in strictly valid JSON format.

AVAILABLE LAYOUT TYPES:
"accentLeft", "accentRight", "imageAndText", "textAndImage"

AVAILABLE CONTENT TYPES:
"title", "heading1", "heading2", "heading3",
"paragraph", "bulletList", "numberedList",
"image", "column", "resizable-column"

Use these outlines:
${JSON.stringify(outlines)}

STRICT RULES:

1. Return ONLY strictly valid JSON array.
2. Do NOT return markdown.
3. Do NOT include explanations.
4. Do NOT include extra text.
5. Follow the exact structure provided below.
6. Content must be professional, presentation-ready, and structured.
7. Each slide must contain:
   - One strong title or heading
   - 6-8 lines of meaningful content
8. Use bulletList or numberedList where appropriate.
9. Avoid single-line paragraphs.
10. Alternate layouts for visual balance.

IMAGE RULE:

- Generate ONLY 1 image for every 2 slides.
- Slides 1, 3, 5, 7... MUST include an image.
- Slides 2, 4, 6, 8... MUST NOT include an image.
- When included, image must follow this format:

{
  "id": "unique-id",
  "type": "image",
  "name": "Image",
  "content": "",
  "alt": "professional relevant image description"
}

TOP LEVEL STRUCTURE:

[
  {
    "id": "unique-id",
    "slideName": "Slide Name",
    "type": "layoutType",
    "className": "",
    "content": {
      "id": "unique-id",
      "type": "column",
      "name": "Column",
      "content": []
    }
  }
]

Ensure:
- Structure matches EXACTLY.
- Layout types must strictly match AVAILABLE LAYOUT TYPES.
- Maintain professional logical flow between slides.
- Ensure balanced content density.
`;

  try {
    const text = await generateAIResponse(prompt);

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Invalid JSON array returned from AI");

    const JSONResponse = JSON.parse(match[0]);

    if (!Array.isArray(JSONResponse)) {
      throw new Error("AI did not return an array");
    }

    await Promise.all(JSONResponse.map(replaceImagesWithPlaceholders));
 console.log("After replace:", JSON.stringify(JSONResponse, null, 2));
    return {
      status: 200,
      data: JSONResponse,
    };
  } catch (error) {
    console.error("Layout Error:", error);
    return {
      status: 500,
      error: "Failed to generate layouts " + error,
    };
  }
};
 

export const generateLayout = async (
  projectId: string,
  theme: string
): Promise<ReturnProps> => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }

    const user = await currentUser();

    if (!user) {
      return { status: 403, error: "User not authenticated" };
    }

    const userExists = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userExists || !userExists.subscription) {
      return {
        status: 403,
        error: "User does not have an active subscription",
      };
    }

    const project = await client.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });

    if (!project || !project.outlines?.length) {
      return {
        status: 400,
        error: "Project does not have outlines",
      };
    }

    const layouts = await generateLayoutsJSON(project.outlines);

    if (layouts.status !== 200) return layouts;

    await client.project.update({
      where: { id: projectId },
      data: {
        slides: layouts.data as Prisma.InputJsonValue,
        themeName: theme,
      },
    });

    return { status: 200, data: layouts.data };
  } catch (error) {
    console.error("Save Layout Error:", error);
    return {
      status: 500,
      error: "Internal Server Error " + error,
    };
  }
};
 


export async function generateSingleHeading(fullText: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }) 

    const prompt = `
You are an AI that extracts the core topic of a document.

From the following content, generate ONLY ONE short, clear, professional presentation title.

Rules:
- Maximum 12 words
- No explanation
- No quotes
- Only return the heading text

Document:
${fullText.slice(0, 10000)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return {
      status: 200,
      heading: text,
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      status: 500,
      error: "Failed to generate heading",
    };
  }
}

export async function generateSummaryAndLinks(fullText: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

//     const prompt = `
// You are an AI assistant.

// From the following document:

// 1. Write a clear bullet-point summary of important points.
// 2. Provide 5 relevant YouTube search links about this topic.

// Return response in this format:

// SUMMARY:
// - point 1
// - point 2

// YOUTUBE:
// https://www.youtube.com/results?search_query=topic1
// https://www.youtube.com/results?search_query=topic2

// Document:
// ${fullText.slice(0, 10000)}
// `;

const prompt = `
You are an expert AI study assistant and content analyzer.

Your job is to deeply analyze the following document and extract the most valuable learning information.

From the document, generate the following sections:

1. TITLE
Create a short and meaningful title that represents the main topic of the document.

2. KEY CONCEPTS
Identify the most important concepts, ideas, or terms explained in the document.

3. DETAILED SUMMARY
Write a clear and structured explanation of the main ideas in bullet points. Focus on the most important knowledge someone should remember.

4. IMPORTANT POINTS
Extract the most critical facts, definitions, or insights.

5. LEARNING INSIGHTS
Explain why this topic is important and how it is used in real-world applications.

6. RELATED YOUTUBE VIDEOS
Provide 5 useful YouTube search links where someone can learn more about this topic.

Return the response STRICTLY in the following format:

TITLE:
<short title>

KEY CONCEPTS:
- concept 1
- concept 2
- concept 3

SUMMARY:
- main idea 1
- main idea 2
- main idea 3

IMPORTANT POINTS:
- important fact 1
- important fact 2
- important fact 3

LEARNING INSIGHTS:
- insight 1
- insight 2

YOUTUBE:
https://www.youtube.com/results?search_query=topic+learning
https://www.youtube.com/results?search_query=topic+tutorial
https://www.youtube.com/results?search_query=topic+explained
https://www.youtube.com/results?search_query=topic+beginner
https://www.youtube.com/results?search_query=topic+course

Analyze the following document carefully and extract the most meaningful information.

DOCUMENT:
${fullText.slice(0, 12000)}
`;    
// Retry logic (important for preview model)
    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err: any) {
        if (err?.status === 503 && attempt < 2) {
          await new Promise((res) => setTimeout(res, 2000));
        } else {
          throw err;
        }
      }
    }

    if (!result) {
      throw new Error("Model failed after retries");
    }

    const response = await result.response;
    const text = response.text();

    const summaryMatch = text
      .split("YOUTUBE:")[0]
      .replace("SUMMARY:", "")
      .trim();

    const youtubeLinks =
      text.match(/https:\/\/www\.youtube\.com\/[^\s]+/g) || [];

    const headingResponse = await generateSingleHeading(fullText);

    return {
      status: 200,
      heading: headingResponse.heading,
      summary: summaryMatch,
      youtubeLinks,
    };
  } catch (error) {
    console.error("Gemini 3 Flash Error:", error);

    return {
      status: 500,
      error: "Failed to generate content",
    };
  }
}
