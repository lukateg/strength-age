import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import { Progress } from "../ui/progress";

export default function TotalStorageUsedCard({
  materialsToUpload,
  storageUsed,
  maxStorageLimit,
}: {
  materialsToUpload: File[];
  storageUsed: number;
  maxStorageLimit: number;
}) {
  const uploadedFilesAndFilesToUploadSize =
    (storageUsed ?? 0) +
    materialsToUpload.reduce((acc, file) => acc + file.size, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Storage Used</CardTitle>
        <CardDescription>
          You have used{" "}
          {(uploadedFilesAndFilesToUploadSize / 1024 / 1024).toFixed(2)} MB of{" "}
          {maxStorageLimit / 1024 / 1024} MB
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={(uploadedFilesAndFilesToUploadSize / maxStorageLimit) * 100}
        />
      </CardContent>
    </Card>
  );
}
