import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

import { Loader2 } from "lucide-react";
import { Cloud } from "lucide-react";

export default function UploadFilesButton({
  startUpload,
  materialsToUpload,
  isUploading,
  className,
}: {
  startUpload: () => Promise<void>;
  materialsToUpload: File[];
  isUploading: boolean;
  className?: string;
}) {
  return (
    <Button
      className={cn(className, {
        "opacity-50": materialsToUpload.length === 0 || isUploading,
      })}
      onClick={startUpload}
      disabled={materialsToUpload.length === 0 || isUploading}
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Cloud className="mr-2 h-4 w-4" />
          Upload {materialsToUpload.length} file
          {materialsToUpload.length !== 1 ? "s" : ""}
        </>
      )}
    </Button>
  );
}
