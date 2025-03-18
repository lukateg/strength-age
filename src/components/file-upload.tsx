import { useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

type FileUploadProps = {
  onDrop?: (files: File[]) => void;
};

// TODO:
// - add error handling
// - add max length
// - make component really reusable

export default function FileUploadComponent(props: FileUploadProps) {
  //   const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      props.onDrop?.(acceptedFiles);
    },
    [props]
  );

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
    <div>
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
    </div>
  );
}
