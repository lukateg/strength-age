import { type Doc } from "convex/_generated/dataModel";
import { MoreVertical, Share2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface TestReviewListItemProps {
  testReview: Doc<"testReviews">;
  onDelete: () => void;
  onShare: (
    testReviewId: Doc<"testReviews">["_id"],
    testId: Doc<"testReviews">["testId"]
  ) => void;
}

const getProgressColor = (percentage: number): string => {
  if (percentage < 20) return "bg-red-500";
  if (percentage < 40) return "bg-orange-500";
  if (percentage < 60) return "bg-yellow-500";
  if (percentage < 80) return "bg-lime-500";
  return "bg-green-500";
};

export function TestReviewListItem({
  testReview,
  onDelete,
  onShare,
}: TestReviewListItemProps) {
  const totalQuestions = testReview.questions.length;

  const score = testReview.questions.filter(
    (question) => question.isCorrect
  ).length;
  const total = testReview.questions.length;
  const scorePercentage = (score / total) * 100;

  const formattedDate = new Date(
    Number(testReview._creationTime)
  ).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div>
      <Link href={`/app/tests/${testReview.testId}/review/${testReview._id}`}>
        <div className="flex flex-col gap-2 rounded-lg hover:bg-accent p-4 border transition duration-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-medium text-sm">{testReview.title}</h3>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {score}/{totalQuestions}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(testReview._id, testReview.testId);
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Progress
            value={scorePercentage}
            className={`h-2 w-full ${getProgressColor(scorePercentage)}`}
          />
        </div>
      </Link>
    </div>
  );
}
