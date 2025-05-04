import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

// TODO: - move this to the upload thing hook

import { type ClientUploadedFileData } from "uploadthing/types";
import { type Id } from "convex/_generated/dataModel";

// interface UseFileUploadProps {
//   onUploadComplete: (
//     files: ClientUploadedFileData<{ uploadedBy: string }>[]
//   ) => void;
// }

export type StartUploadType = (
  files: File[],
  input: {
    classId: string & {
      __tableName: "classes";
    };
    lessonId?: Id<"lessons"> | undefined;
  }
) => Promise<ClientUploadedFileData<null>[] | undefined>;

// export const useFileUpload = ({ onUploadComplete }: UseFileUploadProps) => {
//   const { startUpload, isUploading } = useUploadThing("pdfUploader", {
//     onClientUploadComplete: (res) => {
//       if (res && res.length > 0 && res[0]?.serverData.uploadedBy) {
//         onUploadComplete(res);
//       }
//     },
//     onUploadError: () => {
//       toast({
//         title: "Error",
//         description: "Something went wrong when uploading, please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   return {
//     startUpload,
//     isUploading,
//   };
// };
