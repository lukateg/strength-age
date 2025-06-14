import axios from "axios";
import pdfParse from "pdf-parse";

import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

import { createQuizPrompt } from "./utils";
import { generatedTestSchema } from "./schemas";
import { ConvexError } from "convex/values";

import { type Id } from "convex/_generated/dataModel";
import { type GenerativeModel } from "@google/generative-ai";

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
      throw new ConvexError({ message: "Invalid PDF format" });
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
  return Promise.all(
    lessonIds.map(async (lessonId) => {
      const pdfsForLesson = await fetchQuery(
        api.lessons.getPdfsByLessonQuery,
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
  questionCount: number,
  testName: string,
  description: string,
  additionalInstructions?: string
) {
  const combinedText = lessonTexts.join("\n\n");
  const prompt = createQuizPrompt(
    combinedText,
    questionTypes,
    difficulty,
    questionCount,
    testName,
    description,
    additionalInstructions
  );

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText) as Record<string, unknown>;
    return generatedTestSchema.parse(parsedData);
  } catch (error) {
    console.error("Error generating quiz for lesson:", error);
    throw error;
  }
}
