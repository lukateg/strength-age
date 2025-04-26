import axios from "axios";
import pdfParse from "pdf-parse";

import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

import { type Id } from "convex/_generated/dataModel";
import { type GenerativeModel } from "@google/generative-ai";
import { createQuizPrompt } from "./utils";
import { testSchema } from "./schemas";

type LessonPdf = {
  fileUrl: string;
  _id: string;
};

// Extract PDF processing logic
export async function convertPDFToText(pdf: { fileUrl: string; _id: string }) {
  try {
    const response = await axios.get(pdf.fileUrl, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });

    const buffer = Buffer.from(new Uint8Array(response.data));
    if (buffer.toString("ascii", 0, 4) !== "%PDF") {
      throw new Error("Invalid PDF format");
    }

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
}

// Extracted function to process PDFs
export async function convertPdfsToText(lessonPdfs: LessonPdf[][]) {
  return Promise.all(
    lessonPdfs.map(async (lessonPdfArray) => {
      const lessonTexts = await Promise.all(
        lessonPdfArray.map(async (pdf) => convertPDFToText(pdf))
      );
      return lessonTexts;
    })
  );
}

// Extracted function to fetch PDFs
export async function fetchLessonPdfs(
  lessonIds: Id<"lessons">[],
  token: string
) {
  console.log("Fetching lesson PDFs", lessonIds, token);
  return Promise.all(
    lessonIds.map(async (lessonId) => {
      const pdfsForLesson = await fetchQuery(
        api.lessons.getPDFsByLessonId,
        { lessonId },
        { token }
      );
      console.log("PDFs for lesson", pdfsForLesson);
      return pdfsForLesson;
    })
  );
}

export async function generateQuizForLesson(
  model: GenerativeModel,
  lessonTexts: string[],
  questionTypes: string[],
  difficulty: number,
  questionCount: number
) {
  const combinedText = lessonTexts.join("\n\n");
  const prompt = createQuizPrompt(
    combinedText,
    questionTypes,
    difficulty,
    questionCount
  );

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText) as Record<string, unknown>;
    return testSchema.parse(parsedData);
  } catch (error) {
    console.error("Error generating quiz for lesson:", error);
    throw error;
  }
}
