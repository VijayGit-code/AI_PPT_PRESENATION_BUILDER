// // import { NextRequest } from "next/server";
// // import PptxGenJS from "pptxgenjs";
// // import { PDFDocument, StandardFonts } from "pdf-lib";
// // import { Document, Packer, Paragraph, TextRun } from "docx";

// // export const runtime = "nodejs";

// // export async function GET(
// //   req: NextRequest,
// //   { params }: { params: { presentationID: string } }
// // ) {
// //   try {
// //     const { presentationID } = params;
// //     const { searchParams } = new URL(req.url);
// //     const type = searchParams.get("type");

// //     if (!type) {
// //       return new Response(JSON.stringify({ error: "File type required" }), {
// //         status: 400,
// //       });
// //     }

// //     const slides = [
// //       {
// //         title: "AI Presentation Builder",
// //         content: "Generated using AI + Next.js",
// //       },
// //       {
// //         title: "Features",
// //         content: "• Auto Slide\n• Theme\n• Export PPT/PDF/DOC",
// //       },
// //     ];

// //     // ================= PPT =================
// //     if (type === "ppt") {
// //       const pptx = new PptxGenJS();

// //       slides.forEach((slideData) => {
// //         const slide = pptx.addSlide();
// //         slide.addText(slideData.title, { x: 1, y: 1, fontSize: 28, bold: true });
// //         slide.addText(slideData.content, { x: 1, y: 2, fontSize: 18 });
// //       });

// //       const result = await pptx.write({
// //         outputType: "arraybuffer",
// //       });

// //       if (typeof result === "string") {
// //         throw new Error("Unexpected PPT output type");
// //       }

// //       const blob = new Blob(
// //         [new Uint8Array(result as ArrayBuffer)],
// //         {
// //           type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
// //         }
// //       );

// //       return new Response(blob, {
// //         headers: {
// //           "Content-Disposition": `attachment; filename=presentation-${presentationID}.pptx`,
// //         },
// //       });
// //     }

// //     // ================= PDF =================
// //     if (type === "pdf") {
// //       const pdfDoc = await PDFDocument.create();
// //       const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

// //       slides.forEach((slideData) => {
// //         const page = pdfDoc.addPage();
// //         const { height } = page.getSize();

// //         page.drawText(slideData.title, {
// //           x: 50,
// //           y: height - 50,
// //           size: 20,
// //           font,
// //         });

// //         page.drawText(slideData.content, {
// //           x: 50,
// //           y: height - 80,
// //           size: 14,
// //           font,
// //         });
// //       });

// //       const pdfBytes = await pdfDoc.save();

// //       const blob = new Blob([new Uint8Array(pdfBytes)], {
// //         type: "application/pdf",
// //       });

// //       return new Response(blob, {
// //         headers: {
// //           "Content-Disposition": `attachment; filename=presentation-${presentationID}.pdf`,
// //         },
// //       });
// //     }

// //     // ================= DOCX =================
// //     if (type === "doc") {
// //       const doc = new Document({
// //         sections: [
// //           {
// //             children: slides.flatMap((slide) => [
// //               new Paragraph({
// //                 children: [
// //                   new TextRun({
// //                     text: slide.title,
// //                     bold: true,
// //                     size: 32,
// //                   }),
// //                 ],
// //               }),
// //               new Paragraph({
// //                 children: [
// //                   new TextRun({
// //                     text: slide.content,
// //                     size: 24,
// //                   }),
// //                 ],
// //               }),
// //               new Paragraph({ text: "" }),
// //             ]),
// //           },
// //         ],
// //       });

// //       const buffer = await Packer.toBuffer(doc);

// //       const blob = new Blob([new Uint8Array(buffer)], {
// //         type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// //       });

// //       return new Response(blob, {
// //         headers: {
// //           "Content-Disposition": `attachment; filename=presentation-${presentationID}.docx`,
// //         },
// //       });
// //     }

// //     return new Response(JSON.stringify({ error: "Invalid type" }), {
// //       status: 400,
// //     });
// //   } catch (error) {
// //     console.error("Download error:", error);
// //     return new Response(JSON.stringify({ error: "Server error" }), {
// //       status: 500,
// //     });
// //   }
// // }


// import { NextRequest } from "next/server";
// import PptxGenJS from "pptxgenjs";
// import { PDFDocument, StandardFonts } from "pdf-lib";
// import { Document, Packer, Paragraph, TextRun } from "docx";

// export const runtime = "nodejs";

// export async function POST(
//   req: NextRequest,
//   context: { params: { presentationID: string } }
// ) {
//   try {
//     console.log("🔥 DOWNLOAD ROUTE HIT");

//     // ✅ FIX 1: Next.js 15 dynamic params
//     const { presentationID } = await context.params;

//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get("type");

//     if (!type) {
//       return new Response("File type is required", { status: 400 });
//     }

//     const body = await req.json();
//     const slides = body.slides || [];
//     const theme = body.theme || {};

//     if (!slides.length) {
//       return new Response("No slides found", { status: 400 });
//     }

//     // ================= PPT =================
//     if (type === "ppt") {
//       const pptx = new PptxGenJS();

//       slides.forEach((slideData: any) => {
//         const slide = pptx.addSlide();

//         // Background
//         if (theme.backgroundColor) {
//           slide.background = {
//             fill: theme.backgroundColor.replace("#", ""),
//           };
//         }

//         // ✅ Safe title conversion
//         const title =
//           typeof slideData.title === "string"
//             ? slideData.title
//             : JSON.stringify(slideData.title || "");

//         slide.addText(title, {
//           x: 1,
//           y: 0.5,
//           fontSize: 28,
//           bold: true,
//           color: theme.accentColor?.replace("#", "") || "000000",
//         });

//         // ✅ Safe content conversion
//         const content =
//           typeof slideData.content === "string"
//             ? slideData.content
//             : Array.isArray(slideData.content)
//             ? slideData.content.join("\n")
//             : JSON.stringify(slideData.content || "");

//         slide.addText(content, {
//           x: 1,
//           y: 1.5,
//           fontSize: 18,
//           color: "333333",
//         });
//       });

//       const buffer = await pptx.write({ outputType: "arraybuffer" });

//       return new Response(new Uint8Array(buffer as ArrayBuffer), {
//         headers: {
//           "Content-Type":
//             "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//           "Content-Disposition": `attachment; filename=presentation-${presentationID}.pptx`,
//         },
//       });
//     }

//     // ================= PDF =================
//     if (type === "pdf") {
//       const pdfDoc = await PDFDocument.create();
//       const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//       slides.forEach((slideData: any) => {
//         const page = pdfDoc.addPage();
//         const { height } = page.getSize();

//         const title =
//           typeof slideData.title === "string"
//             ? slideData.title
//             : JSON.stringify(slideData.title || "");

//         const content =
//           typeof slideData.content === "string"
//             ? slideData.content
//             : Array.isArray(slideData.content)
//             ? slideData.content.join("\n")
//             : JSON.stringify(slideData.content || "");

//         page.drawText(title, {
//           x: 50,
//           y: height - 50,
//           size: 20,
//           font,
//         });

//         page.drawText(content, {
//           x: 50,
//           y: height - 80,
//           size: 14,
//           font,
//         });
//       });

//       const pdfBytes = await pdfDoc.save();

//       return new Response(new Uint8Array(pdfBytes), {
//         headers: {
//           "Content-Type": "application/pdf",
//           "Content-Disposition": `attachment; filename=presentation-${presentationID}.pdf`,
//         },
//       });
//     }

//     // ================= DOCX =================
//     if (type === "doc") {
//       const doc = new Document({
//         sections: [
//           {
//             children: slides.flatMap((slide: any) => {
//               const title =
//                 typeof slide.title === "string"
//                   ? slide.title
//                   : JSON.stringify(slide.title || "");

//               const content =
//                 typeof slide.content === "string"
//                   ? slide.content
//                   : Array.isArray(slide.content)
//                   ? slide.content.join("\n")
//                   : JSON.stringify(slide.content || "");

//               return [
//                 new Paragraph({
//                   children: [
//                     new TextRun({
//                       text: title,
//                       bold: true,
//                       size: 32,
//                     }),
//                   ],
//                 }),
//                 new Paragraph({
//                   children: [
//                     new TextRun({
//                       text: content,
//                       size: 24,
//                     }),
//                   ],
//                 }),
//                 new Paragraph({ text: "" }),
//               ];
//             }),
//           },
//         ],
//       });

//       const buffer = await Packer.toBuffer(doc);

//       return new Response(new Uint8Array(buffer), {
//         headers: {
//           "Content-Type":
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//           "Content-Disposition": `attachment; filename=presentation-${presentationID}.docx`,
//         },
//       });
//     }

//     return new Response("Invalid file type", { status: 400 });
//   } catch (error) {
//     console.error("Download error:", error);
//     return new Response("Server error", { status: 500 });
//   }
// }



import { NextRequest } from "next/server";
import PptxGenJS from "pptxgenjs";
import { PDFDocument, rgb } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: { presentationID: string } }
) {
  try {
    const { presentationID } = await context.params;
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

    // ================= PPT =================
//      if (type === "ppt") {
//   const pptx = new PptxGenJS();

//   slides.forEach((slideData: any) => {
//     const slide = pptx.addSlide();

//     // Background from className
//     if (slideData.className?.includes("bg-white")) {
//       slide.background = { fill: "FFFFFF" };
//     }

//     // 🔥 REAL SOURCE FIX
//     let elements: any[] = [];

//     if (slideData.content?.content) {
//       elements = slideData.content.content;
//     }

//     elements.forEach((item, index) => {
//       // TITLE
//       if (item.type === "title") {
//         slide.addText(item.content, {
//           x: 1,
//           y: 0.5,
//           fontSize: 32,
//           bold: true,
//           color: "000000",
//         });
//       }

//       // PARAGRAPH
//       if (item.type === "paragraph") {
//         slide.addText(item.content, {
//           x: 1,
//           y: 1.5,
//           fontSize: 18,
//           color: "000000",
//         });
//       }

//       // IMAGE
//       if (item.type === "image") {
//         slide.addImage({
//           path: item.content,
//           x: 4,
//           y: 1.5,
//           w: 4,
//           h: 3,
//         });
//       }
//     });
//   });

//   const buffer = await pptx.write({ outputType: "arraybuffer" });

//   return new Response(new Uint8Array(buffer as ArrayBuffer), {
//     headers: {
//       "Content-Type":
//         "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//       "Content-Disposition": `attachment; filename=${presentationID}.pptx`,
//     },
//   });
// }
    
     if (type === "ppt") {
  const pptx = new PptxGenJS();

  slides.forEach((slideData: any) => {
    const slide = pptx.addSlide();

    // Background from theme
    if (theme.backgroundColor) {
      slide.background = {
        fill: theme.backgroundColor.replace("#", ""),
      };
    }

    const elements = slideData.content?.content || [];

    elements.forEach((item: any) => {
      // TITLE
      if (item.type === "title") {
        slide.addText(item.content, {
          x: 0.5,
          y: 0.5,
          w: 9,
          align: "center",
          fontSize: 36,
          bold: true,
          color:
            theme.accentColor?.replace("#", "") || "000000",
        });
      }

      // PARAGRAPH
      if (item.type === "paragraph") {
        slide.addText(item.content, {
          x: 1,
          y: 1.5,
          w: 8,
          align: "left",
          fontSize: 20,
          color:
            theme.textColor?.replace("#", "") ||
            theme.accentColor?.replace("#", "") ||
            "000000",
        });
      }

      // IMAGE
      if (item.type === "image") {
        slide.addImage({
          path: item.content,
          x: 3,
          y: 3,
          w: 4,
          h: 3,
        });
      }
    });
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

  slides.forEach((slideData: any) => {
    const page = pdfDoc.addPage();
    const { height, width } = page.getSize();

    // Background
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

    let y = height - 80;

    elements.forEach((item: any) => {
      let text = item.content;
      if (!text) return;

      const size =
        item.type === "title" ? 28 : 18;

      const alignCenter =
        item.type === "title";

      const textWidth = text.length * (size / 2);

      const x = alignCenter
        ? width / 2 - textWidth / 2
        : 50;

      page.drawText(text, {
        x,
        y,
        size,
      });

      y -= size + 20;
    });
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${presentationID}.pdf`,
    },
  });
}

    // ================= DOCX =================
    if (type === "doc") {
  const children: any[] = [];

  slides.forEach((slide: any) => {
    const elements = slide.content?.content || [];

    elements.forEach((item: any) => {
      if (!item.content) return;

      const isTitle = item.type === "title";

      children.push(
        new Paragraph({
          alignment: isTitle ? "center" : "left",
          children: [
            new TextRun({
              text: item.content,
              bold: isTitle,
              size: (isTitle ? 28 : 18) * 2,
              color:
                theme.accentColor?.replace("#", "") ||
                "000000",
            }),
          ],
        })
      );

      children.push(new Paragraph({ text: "" }));
    });
  });

  const doc = new Document({
    sections: [{ children }],
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