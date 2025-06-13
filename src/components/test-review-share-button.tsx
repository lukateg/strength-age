"use client";

import { toast } from "sonner";
import { api } from "../../convex/_generated/api";

import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

import { type Id } from "convex/_generated/dataModel";

interface TestReviewShareButtonProps {
  testReviewId: Id<"testReviews">;
  testId: Id<"tests">;
}

export default function TestReviewShareButton({
  testReviewId,
  testId,
}: TestReviewShareButtonProps) {
  // const { can } = useUserContext();
  const createShareLink = useMutation(api.tests.createTestReviewShareLink);

  const handleShare = async () => {
    try {
      const shareToken = await createShareLink({
        testReviewId,
        expiresInDays: 7, // Link expires in 7 days
      });

      const shareUrl = `${window.location.origin}/app/tests/${testId}/review/${testReviewId}?token=${shareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to create share link");
    }
  };

  //   const canShare = can("testReviews", "share");

  //   if (!canShare) {
  //     return null;
  //   }

  return (
    <Button
      onClick={handleShare}
      className="text-xs md:text-base"
      variant="outline"
    >
      <Send className="h-4 w-4 mr-2" />
      Share Results
    </Button>
  );
}
