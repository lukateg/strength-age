"use client";

import { File, Cloud, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";

interface FileUploadViewProps {
  isUploading: boolean;
  startUpload: (files: File[]) => void;
}

export const FileUploadView = ({
  isUploading,
  startUpload,
}: FileUploadViewProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 20971520, // 20MB
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`
      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
      transition-colors duration-200 ease-in-out
      ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary"
      }
    `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <UploadCloud
            className={`h-12 w-12 ${
              isDragActive ? "text-primary" : "text-muted-foreground"
            }`}
          />
          {isDragActive ? (
            <p className="text-lg font-medium">Drop the files here...</p>
          ) : (
            <p className="text-muted-foreground">
              Drag & drop files here, or click to select files
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Supported files: PDF, DOC, DOCX, TXT (Max 20MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-4">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(file)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => startUpload(files)}
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Cloud className="mr-2 h-4 w-4" />
              Upload {files.length} file{files.length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      </CardFooter>
    </>
  );
};
