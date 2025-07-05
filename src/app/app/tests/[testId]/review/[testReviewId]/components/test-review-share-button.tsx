import { useTestMutations } from "@/hooks/use-test-mutations";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { type Id } from "convex/_generated/dataModel";

interface TestReviewShareButtonProps {
  testReviewId: Id<"testReviews">;
  testId: Id<"tests">;
}

export default function TestReviewShareButton({
  testReviewId,
  testId,
}: TestReviewShareButtonProps) {
  const { copyTestReviewShareLink, isPending } = useTestMutations();

  const handleShare = async () => {
    await copyTestReviewShareLink(testReviewId, testId);
  };

  return (
    <Button
      onClick={handleShare}
      className="text-xs md:text-base"
      variant="outline"
      disabled={isPending}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
