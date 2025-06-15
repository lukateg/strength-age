import { toast } from "sonner";
import { useTestMutations } from "@/hooks/use-test-mutations";

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
  const { createTestReviewShareLink } = useTestMutations();

  const handleShare = async () => {
    try {
      const shareToken = await createTestReviewShareLink(testReviewId);

      const shareUrl = `${window.location.origin}/app/tests/${testId}/review/${testReviewId}?token=${shareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to create share link");
    }
  };

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
