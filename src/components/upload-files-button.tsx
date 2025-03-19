import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Cloud } from "lucide-react";

export default function UploadFilesButton({
  startUpload,
  uploadedMaterials,
  isUploading,
}: {
  startUpload: (uploadedMaterials: File[]) => void;
  uploadedMaterials: File[];
  isUploading: boolean;
}) {
  return (
    <Button
      className="w-full"
      onClick={() => startUpload(uploadedMaterials)}
      disabled={uploadedMaterials.length === 0 || isUploading}
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Cloud className="mr-2 h-4 w-4" />
          Upload {uploadedMaterials.length} file
          {uploadedMaterials.length !== 1 ? "s" : ""}
        </>
      )}
    </Button>
  );
}
