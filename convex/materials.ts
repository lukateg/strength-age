import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { AuthenticationRequired, createAppError } from "./utils";
import { hasPermission } from "./models/permissionsModel";

import {
  createManyMaterials,
  createMaterial,
  runDeleteMaterialFromUploadThing,
} from "./models/materialsModel";
import { deleteLessonMaterialsJoinByMaterialId } from "./models/lessonPdfsModel";

const determineFileType = (name: string): "pdf" | "txt" =>
  name.toLowerCase().endsWith(".txt") ? "txt" : "pdf";

export const addMaterialMutation = mutation({
  args: {
    classId: v.string(),
    material: v.object({
      fileUrl: v.string(),
      name: v.string(),
      size: v.number(),
    }),
  },
  handler: async (ctx, { classId, material }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    if (!normalizedClassId) {
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const canAddMaterial = await hasPermission(
      ctx,
      userId,
      "materials",
      "create",
      {
        newFilesSize: material.size,
      }
    );
    if (!canAddMaterial) {
      throw createAppError({
        message: "Not authorized to add PDF",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const fileType = determineFileType(material.name);
    const materialId = await createMaterial(
      ctx,
      { ...material, fileType },
      userId,
      normalizedClassId
    );
    return materialId;
  },
});

export const addManyMaterialsMutation = mutation({
  args: {
    classId: v.string(),
    materialFiles: v.array(
      v.object({
        fileUrl: v.string(),
        name: v.string(),
        size: v.number(),
      })
    ),
  },
  handler: async (ctx, { classId, materialFiles }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedClassId = ctx.db.normalizeId("classes", classId);
    if (!normalizedClassId) {
      throw createAppError({
        message: "Invalid class ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const newFilesSize = materialFiles.reduce((acc, m) => acc + m.size, 0);
    const canAddMaterials = await hasPermission(
      ctx,
      userId,
      "materials",
      "create",
      {
        newFilesSize,
      }
    );
    if (!canAddMaterials) {
      throw createAppError({
        message: "Not authorized to add PDFs",
        statusCode: "PERMISSION_DENIED",
      });
    }

    const materialsWithType = materialFiles.map((m) => ({
      ...m,
      fileType: determineFileType(m.name),
    }));

    await createManyMaterials(
      ctx,
      materialsWithType,
      userId,
      normalizedClassId
    );
  },
});

export const deleteMaterialMutation = mutation({
  args: { materialId: v.string() },
  handler: async (ctx, { materialId }) => {
    const userId = await AuthenticationRequired({ ctx });

    const normalizedMaterialId = ctx.db.normalizeId("materials", materialId);
    if (!normalizedMaterialId) {
      throw createAppError({
        message: "Invalid item ID",
        statusCode: "VALIDATION_ERROR",
      });
    }

    const material = await ctx.db.get(normalizedMaterialId);
    if (!material) {
      throw createAppError({
        message: "PDF you are trying to delete does not exist",
        statusCode: "NOT_FOUND",
      });
    }

    const hasPermissionToDelete = await hasPermission(
      ctx,
      userId,
      "materials",
      "delete",
      material
    );
    if (!hasPermissionToDelete) {
      throw createAppError({
        message: "Not authorized to delete this PDF",
        statusCode: "PERMISSION_DENIED",
      });
    }

    await deleteLessonMaterialsJoinByMaterialId(ctx, normalizedMaterialId);
    await runDeleteMaterialFromUploadThing(ctx, material);

    await ctx.db.delete(normalizedMaterialId);

    return { success: true };
  },
});
