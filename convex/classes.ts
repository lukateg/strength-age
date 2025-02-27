import { mutation } from "./_generated/server";

export const savePdf = mutation(
  async ({ db }, { userId, classId, fileUrl }) => {
    await db.insert("pdfs", {
      userId,
      classId,
      fileUrl,
      uploadedAt: Date.now(),
    });
  }
);
