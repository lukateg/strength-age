"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { useUploadThing } from "@/hooks/use-upload-thing";

import { api } from "convex/_generated/api";

import { Cloud, File, Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "@/hooks/use-toast";

// TODO:
// - fix case when multiple files are added for upload
// - add error handling
// - add max length

// - remove support for TXT, DOCX and others and lower the size limit

export const FileUploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { id } = useParams();
  const session = useSession();

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        void savePdf({
          userId: res[0]?.serverData.uploadedBy,
          classId: id,
          fileUrl: res[0]?.ufsUrl,
        });
        setFiles([]);
        toast({
          title: "Success",
          description: "Uploaded successfully.",
          variant: "default",
        });
      }
    },
    onUploadError: () => {
      toast({
        title: "Error",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
  });

  const savePdf = useMutation(api.classes.savePdf);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

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

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  if (!session.isSignedIn) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              You need to be logged in to upload files
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className=" m-4">
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>
          Drag and drop your files here or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>

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
    </Card>
  );
};

export default FileUploadPage;
