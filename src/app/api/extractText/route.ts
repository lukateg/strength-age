import { type NextRequest } from "next/server";
import axios from "axios";
import pdfParse from "pdf-parse";
import { api } from "convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { type Id } from "../../../../convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const { lessonId, questionAmount } = (await req.json()) as {
      lessonId?: Id<"lessons">;
      questionAmount?: number;
    };

    if (!lessonId) {
      return Response.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    const pdfs = await fetchQuery(api.lessons.getPDFsByLessonId, {
      lessonId,
    });

    if (!pdfs.length) {
      return Response.json(
        { error: "No PDFs found for this lesson" },
        { status: 404 }
      );
    }

    // Download and extract text from all PDFs

    const extractionPromises = pdfs.map(async (pdf) => {
      try {
        // Download PDF as buffer
        const response = await axios.get(pdf.fileUrl, {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf", // Explicitly ask for PDF
          },
        });

        const buffer = Buffer.from(new Uint8Array(response.data));
        if (buffer.subarray(0, 4).toString() !== "%PDF") {
          throw new Error("URL did not return a valid PDF");
        }

        // Parse PDF text
        const data = await pdfParse(buffer);
        return data.text;
      } catch (error) {
        console.error(`Error processing PDF ${pdf._id}:`, error);
        return {
          pdfId: pdf._id,
          text: "",
          error: "Failed to process PDF",
        };
      }
    });

    const extractedTexts = await Promise.all(extractionPromises);

    return Response.json(extractedTexts);
  } catch (error) {
    console.error("Error extracting text:", error);
    return Response.json({ error: "Failed to extract text" }, { status: 500 });
  }
}
