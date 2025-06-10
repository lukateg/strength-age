"use client";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { LIMITATIONS } from "@/shared/abac";
import { useUserContext } from "@/providers/user-provider";

export default function TotalStorageUsedCard({
  materialsToUpload,
}: {
  materialsToUpload: File[];
}) {
  const uploadedFilesSize = useAuthenticatedQueryWithStatus(
    api.materials.getTotalSizeOfPdfsByUser
  );
  const { user } = useUserContext();
  const totalStorageBySubscriptionTier =
    LIMITATIONS[user?.subscriptionTier ?? "free"].materials;

  const uploadedFilesAndFilesToUploadSize =
    (uploadedFilesSize.data ?? 0) +
    materialsToUpload.reduce((acc, file) => acc + file.size, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Storage Used</CardTitle>
        <CardDescription>
          You have used{" "}
          {(uploadedFilesAndFilesToUploadSize / 1024 / 1024).toFixed(2)} MB of{" "}
          {totalStorageBySubscriptionTier / 1024 / 1024} MB
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={
            (uploadedFilesAndFilesToUploadSize /
              totalStorageBySubscriptionTier) *
            100
          }
        />
      </CardContent>
    </Card>
  );
}
