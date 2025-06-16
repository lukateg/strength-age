"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

import { UploadCloud, AlertCircle } from "lucide-react";

type FileUploadProps = {
  onDrop?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  existingFiles: File[];
  storageUsed: number;
  storageLimit: number;
};

export default function FileUploadComponent({
  onDrop,
  maxFiles = 10,
  existingFiles,
  storageUsed,
  storageLimit,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const maxRoundUploadSize = 20971520; // 20MB

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const message =
          rejectedFiles[0]?.errors[0]?.message ?? "An unknown error occurred";
        setError(message);
        toast.error(message);
        return;
      }

      onDrop?.(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "application/pdf": [".pdf"],
      // "application/msword": [".doc"],
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      //   [".docx"],
      // "text/plain": [".txt"],
    },
    maxSize: maxRoundUploadSize,
    maxFiles,
    validator: (file) => {
      if (
        existingFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        )
      ) {
        return {
          code: "duplicate-file",
          message: `File "${file.name}" has already been uploaded`,
        };
      }

      if (existingFiles.length >= maxFiles) {
        return {
          code: "too-many-files",
          message: `You can only upload up to ${maxFiles} files in total`,
        };
      }

      if (file.size > maxRoundUploadSize) {
        return {
          code: "file-size-too-large",
          message: `File size must be less than ${maxRoundUploadSize / 1048576}MB`,
        };
      }

      const currentRoundSize = existingFiles.reduce(
        (acc, file) => acc + file.size,
        0
      );
      if (currentRoundSize + file.size > maxRoundUploadSize) {
        return {
          code: "round-size-too-large",
          message: `Total upload size cannot exceed ${maxRoundUploadSize / 1048576}MB per round`,
        };
      }

      const totalSize = (storageUsed ?? 0) + currentRoundSize + file.size;

      if (totalSize > storageLimit) {
        return {
          code: "storage-limit-exceeded",
          message: "Adding this file would exceed your storage limit",
        };
      }

      return null;
    },
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
          "transition-colors duration-200 ease-in-out",
          isDragActive && "border-primary bg-primary/5",
          error && "border-destructive bg-destructive/5",
          !isDragActive &&
            !error &&
            "border-muted-foreground/25 hover:border-primary"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <UploadCloud
            className={cn(
              "h-12 w-12",
              isDragActive && "text-primary",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          />
          {isDragActive ? (
            <p className="text-lg font-medium">Drop the files here...</p>
          ) : (
            <p className="text-muted-foreground">
              Drag & drop files here, or click to select files
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Supported files: PDF (Max 20MB)
            {/* Supported files: PDF, DOC, DOCX, TXT (Max 20MB) */}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
