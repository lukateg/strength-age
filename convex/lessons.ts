import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLessonWithMaterials = mutation({
  args: v.object({
    userId: v.string(),
    classId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    materialId: v.optional(v.string()), // Allow optional materials
    // materialIds: v.optional(v.array(v.string())), // Allow optional materials
  }),
  handler: async (
    { db },
    { userId, classId, title, description, materialId }
  ) => {
    // 1️⃣ Create the lesson
    const lessonId = await db.insert("lessons", {
      userId,
      classId,
      title,
      description: description ?? "",
      createdAt: Date.now(),
    });

    // 2️⃣ If materials were selected, link them to the lesson
    if (materialId) {
      await db.insert("lessonMaterials", { lessonId, materialId });
      //   await Promise.all(
      //     materialIds.map((materialId) =>
      //       db.insert("lessonMaterials", { lessonId, materialId })
      //     )
      //   );
    }

    return lessonId;
  },
});
