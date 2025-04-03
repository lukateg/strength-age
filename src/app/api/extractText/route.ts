// import { type NextRequest } from "next/server";
// import axios from "axios";
// import pdfParse from "pdf-parse";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   try {
//     const { pdfs } = (await req.json()) as {
//       pdfs: { fileUrl: string; _id: string }[];
//     };

//     const extractedTexts = await Promise.all(
//       pdfs.map(async (pdf: { fileUrl: string; _id: string }) => {
//         try {
//           const response = await axios.get(pdf.fileUrl, {
//             responseType: "arraybuffer",
//             headers: {
//               Accept: "application/pdf",
//             },
//           });

//           const buffer = Buffer.from(new Uint8Array(response.data));
//           if (buffer.toString("ascii", 0, 4) !== "%PDF") {
//             throw new Error("Invalid PDF format");
//           }

//           const data = await pdfParse(buffer);
//           return data.text;
//         } catch (error) {
//           console.error(`Error processing PDF ${pdf._id}:`, error);
//           return null;
//         }
//       })
//     );

//     const successfulTexts = extractedTexts
//       .filter((text): text is string => typeof text === "string")
//       .join("\n\n");

//     return Response.json({ text: successfulTexts });
//   } catch (error) {
//     return Response.json({ error: "Failed to process PDFs" }, { status: 500 });
//   }
// }
