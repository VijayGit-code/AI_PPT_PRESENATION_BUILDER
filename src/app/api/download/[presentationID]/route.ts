/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";   
import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { Document, ImageRun, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Record<string, string> }
) {
  try { 
    const { presentationID } =  params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return new Response("File type required", { status: 400 });
    }

    const body = await req.json();
    const slides = body.slides || [];
    const theme = body.theme || {};
    console.log(JSON.stringify(slides[0], null, 2));
    if (!slides.length) {
      return new Response("No slides found", { status: 400 });
    }

    // 🔥 Universal element renderer (PPT)
    const renderElementsToPPT = (slide: any, items: any[]) => {
      items.forEach((item) => {
        // Handle nested structures
        if (Array.isArray(item.elements)) {
          renderElementsToPPT(slide, item.elements);
        }
        if (Array.isArray(item.content)) {
          renderElementsToPPT(slide, item.content);
          return;
        }

        let text = "";
        let fontSize = 18;
        let color =
          theme.textColor?.replace("#", "") ||
          theme.accentColor?.replace("#", "") ||
          "FFFFFF";

        // Handle string content
        if (typeof item.content === "string") {
          text = item.content;
        }

        // Handle object content
        if (typeof item.content === "object" && item.content !== null) {
          text = item.content.text || "";
          fontSize =
            item.content.fontSize ||
            item.fontSize ||
            fontSize;
          color =
            item.content.color?.replace("#", "") ||
            item.color?.replace("#", "") ||
            color;
        }

        // Render text-based types
        if (
          item.type?.includes("heading") ||
          item.type === "title" ||
          item.type === "paragraph" ||
          item.type === "blockquote"
        ) {
          slide.addText(text, {
            x: item.x ?? 1,
            y: item.y ?? 1.5,
            fontSize,
            bold: item.type.includes("heading"),
            color,
          });
        }

        // Bullet list
        if (item.type === "bulletList" && Array.isArray(item.content)) {
          const bullets = item.content.map((b: any) =>
            typeof b === "object" ? b.text : String(b)
          );

          slide.addText(bullets.join("\n"), {
            x: item.x ?? 1,
            y: item.y ?? 2,
            fontSize,
            bullet: true,
            color,
          });
        }

        // Images
        if (item.type === "image" && item.content) {
          slide.addImage({
            path:
              typeof item.content === "string"
                ? item.content
                : item.content.src,
            x: item.x ?? 4,
            y: item.y ?? 2,
            w: item.width ?? 3,
            h: item.height ?? 3,
          });
        }
      });
    };
 
function addTextBlock(slide: any, textItems: any[], position: any, theme: any) {
  const textContent: any[] = [];

  textItems.forEach((item: any) => {
    if (item.type === "title") {
      textContent.push({
        text: item.content + "\n",
        options: {
          fontSize: 28,
          bold: true,
          color: theme.accentColor?.replace("#", "") || "000000",
        },
      });
    }

    if (item.type === "heading1") {
      textContent.push({
        text: item.content + "\n",
        options: {
          fontSize: 22,
          bold: true,
          color: theme.accentColor?.replace("#", "") || "000000",
        },
      });
    }

    if (item.type === "paragraph") {
      textContent.push({
        text: item.content + "\n",
        options: {
          fontSize: 16,
          color: theme.textColor?.replace("#", "") || "000000",
        },
      });
    }

    if (item.type === "bulletList" && Array.isArray(item.content)) {
      item.content.forEach((bullet: string) => {
        textContent.push({
          text: bullet,
          options: {
            bullet: true,
            fontSize: 14,
            color: theme.textColor?.replace("#", "") || "000000",
          },
        });
      });
    }
  });

  slide.addText(textContent, {
    x: position.x,
    y: position.y,
    w: position.w,
    h: 5.5, // fixed text container height
    valign: "top",
  });
}
function drawWrappedText(page: PDFPage, text: string, x: number, y: number, size: number, maxWidth: number) {
  const words = text.split(" ");
  let line = "";
  const lineHeight = size + 6;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = testLine.length * (size * 0.5);

    if (testWidth > maxWidth) {
      page.drawText(line, { x, y, size });
      y -= lineHeight;
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line, { x, y, size });
    y -= lineHeight;
  }

  return y;
}

    // ================= PPT =================
 
if (type === "ppt") {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();

  slides.forEach((slideData: any) => {
    const slide = pptx.addSlide();

    // Apply background
    if (theme.backgroundColor) {
      slide.background = {
        fill: theme.backgroundColor.replace("#", ""),
      };
    }

    const elements = slideData.content?.content || [];

    const imageItem = elements.find((el: any) => el.type === "image");
    const textItems = elements.filter(
      (el: any) => el.type !== "image"
    );

    const layoutType = slideData.type;

    /* ===============================
       IMAGE + TEXT LAYOUT
    =============================== */

    // if (imageItem && layoutType === "imageAndText") {
    //   // Image LEFT
    //   slide.addImage({
    //     path: imageItem.content,
    //     x: 0.3,
    //     y: 0.5,
    //     w: 4.5,
    //     h: 6.5,
    //   });

    //   // Text RIGHT
    //   addTextBlock(slide, textItems, {
    //     x: 5.2,
    //     y: 0.8,
    //     w: 4.5,
    //   }, theme);
    // }

    // else if (imageItem && layoutType === "textAndImage") {
    //   // Text LEFT
    //   addTextBlock(slide, textItems, {
    //     x: 0.5,
    //     y: 0.8,
    //     w: 4.5,
    //   }, theme);

    //   // Image RIGHT
    //   slide.addImage({
    //     path: imageItem.content,
    //     x: 5.2,
    //     y: 0.5,
    //     w: 4.5,
    //     h: 6.5,
    //   });
    // }

    // /* ===============================
    //    TEXT ONLY SLIDE
    // =============================== */

    // else {
    //   addTextBlock(slide, textItems, {
    //     x: 1,
    //     y: 1,
    //     w: 8,
    //   }, theme);
    // } 
    /* ===============================
   TITLE TOP CENTER + 35/65 SPLIT
================================ */

if (imageItem) {

  // 1️⃣ TITLE (Top Center)
  const titleItem = textItems.find((el: any) => el.type === "title");

  if (titleItem) {
    slide.addText(titleItem.content, {
      x: 0,
      y: 0.3,
      w: 10,
      align: "center",
      fontSize: 28,
      bold: true,
      color: theme.accentColor?.replace("#", "") || "000000",
    });
  }

  // Remaining text (exclude title)
  const bodyText = textItems.filter((el: any) => el.type !== "title");

  // 2️⃣ IMAGE (35%)
  slide.addImage({
    path: imageItem.content,
    x: 0.5,
    y: 1.3,
    w: 3.3,        // ~35%
    h: 4.0,
    sizing: {
      type: "cover",
      w: 0,
      h: 0
    }
  });

  // 3️⃣ TEXT (65%)
  addTextBlock(slide, bodyText, {
    x: 4.2,
    y: 1.3,
    w: 5.3,        // ~65%
  }, theme);

}


/* ===============================
   TEXT ONLY SLIDE
================================ */

else {
  addTextBlock(slide, textItems, {
    x: 1,
    y: 1,
    w: 8,
  }, theme);
}
  });

  const buffer = await pptx.write({ outputType: "arraybuffer" });

  return new Response(new Uint8Array(buffer as ArrayBuffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename=${presentationID}.pptx`,
    },
  });
}

    // ================= PDF =================
if (type === "pdf") {
  const pdfDoc = await PDFDocument.create();

  for (const slideData of slides) {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    /* ================= BACKGROUND ================= */
    if (theme.backgroundColor) {
      const hex = theme.backgroundColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(r, g, b),
      });
    }

    const elements = slideData.content?.content || [];

    // Separate content types
    const titleItem = elements.find((e: any) => e.type === "title");
    const paragraphItem = elements.find((e: any) => e.type === "paragraph");
    const imageItem = elements.find((e: any) => e.type === "image");
    const bulletItem = elements.find((e: any) => e.type === "bulletList");

    let y = height - 60;
    const maxWidth = width - 80;

    /* ================= TITLE ================= */
    if (titleItem?.content && typeof titleItem.content === "string") {
      y = drawWrappedText(page, titleItem.content, 40, y, 28, maxWidth);
      y -= 25;
    }

    /* ================= PARAGRAPH ================= */
    if (paragraphItem?.content && typeof paragraphItem.content === "string") {
      y = drawWrappedText(page, paragraphItem.content, 40, y, 16, maxWidth);
      y -= 30;
    }

    /* ================= IMAGE CENTERED ================= */
    if (imageItem?.content) {
      try {
        const imageBytes = await fetch(imageItem.content).then(res =>
          res.arrayBuffer()
        );

        let image;

        if (imageItem.content.toLowerCase().includes(".png")) {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }

        // 65% slide width
        const imgWidth = width * 0.65;
        const aspectRatio = image.height / image.width;
        const imgHeight = imgWidth * aspectRatio;

        const imgX = (width - imgWidth) / 2;
        const imgY = y - imgHeight;

        page.drawImage(image, {
          x: imgX,
          y: imgY,
          width: imgWidth,
          height: imgHeight,
        });

        y = imgY - 30;

      } catch (error) {
        console.log("Image error:", error);
      }
    }

    /* ================= BULLETS ================= */
    if (bulletItem?.content && Array.isArray(bulletItem.content)) {
      for (const bullet of bulletItem.content) {
        y = drawWrappedText(
          page,
          `• ${bullet}`,
          60,
          y,
          16,
          maxWidth - 20
        );
        y -= 10;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();

  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${presentationID}.pdf`,
    },
  });
}

    // ================= DOCX =================
//     if (type === "doc") {
//   const children: any[] = [];

//   slides.forEach((slide: any) => {
//     const elements = slide.content?.content || [];

//     elements.forEach((item: any) => {
//       if (!item.content) return;

//       const isTitle = item.type === "title";

//       children.push(
//         new Paragraph({
//           alignment: isTitle ? "center" : "left",
//           children: [
//             new TextRun({
//               text: item.content,
//               bold: isTitle,
//               size: (isTitle ? 28 : 18) * 2,
//               color:
//                 theme.accentColor?.replace("#", "") ||
//                 "000000",
//             }),
//           ],
//         })
//       );

//       children.push(new Paragraph({ text: "" }));
//     });
//   });

//   const doc = new Document({
//     sections: [{ children }],
//   });

//   const buffer = await Packer.toBuffer(doc);

//   return new Response(new Uint8Array(buffer), {
//     headers: {
//       "Content-Type":
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "Content-Disposition": `attachment; filename=${presentationID}.docx`,
//     },
//   });
// }
if (type === "doc") {
  const children: any[] = [];

  for (const slide of slides) {
    const elements = slide.content?.content || [];

    const titleItem = elements.find((e: any) => e.type === "title");
    const paragraphItem = elements.find((e: any) => e.type === "paragraph");
    const imageItem = elements.find((e: any) => e.type === "image");
    const bulletItem = elements.find((e: any) => e.type === "bulletList");

    /* ================= TITLE ================= */
    if (titleItem?.content) {
      children.push(
        new Paragraph({
          alignment: "center",
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: titleItem.content,
              bold: true,
              size: 28 * 2,
              color:
                theme.accentColor?.replace("#", "") || "000000",
            }),
          ],
        })
      );
    }

    /* ================= PARAGRAPH ================= */
    if (paragraphItem?.content) {
      children.push(
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: paragraphItem.content,
              size: 16 * 2,
            }),
          ],
        })
      );
    }

    /* ================= IMAGE CENTERED ================= */
     /* ================= IMAGE CENTERED ================= */
if (imageItem?.content) {
  try {
    const imageUrl =
      imageItem.content.startsWith("http")
        ? imageItem.content
        : `http://localhost:3000${imageItem.content}`;

    console.log("Fetching DOC image:", imageUrl);

    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();

    const imageBuffer = Buffer.from(arrayBuffer);

    children.push(
      new Paragraph({
        alignment: "center",
        spacing: { before: 300, after: 300 },
        children: [
          new ImageRun({
            data: imageBuffer,
            transformation: {
              width: 500,   // Bigger width
              height: 320,  // Adjust ratio manually if needed
            },
             type: "jpg",
          }),
        ],
      })
    );
  } catch (err) {
    console.log("DOC image error:", err);
  }
}

    /* ================= BULLETS ================= */
    if (bulletItem?.content && Array.isArray(bulletItem.content)) {
      for (const bullet of bulletItem.content) {
        children.push(
          new Paragraph({
            bullet: {
              level: 0,
            },
            children: [
              new TextRun({
                text: bullet,
                size: 16 * 2,
              }),
            ],
          })
        );
      }
    }

    // Page break after each slide
    children.push(
      new Paragraph({
        children: [],
        pageBreakBefore: true,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${presentationID}.docx`,
    },
  });
}
    return new Response("Invalid type", { status: 400 });
  } catch (error) {
    console.error("Download error:", error);
    return new Response("Server error", { status: 500 });
  }
}
