import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { getQuestionTypeLabel } from "@/lib/utils";
import { getPercentageColor } from "@/components/progress-components/get-percentage-color";

export default function TestReviewDetails({
  perQuestionTypeAccuracy,
}: {
  perQuestionTypeAccuracy: Record<string, { correct: number; total: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5 text-primary" />
          Test Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Class</p>
            <p className="text-lg font-medium">Class 1</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-lg font-medium">10</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Per Question Type Accuracy
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(perQuestionTypeAccuracy).map(
              ([type, { correct, total }], index) => (
                <div key={index} className="flex items-center w-full gap-10">
                  <span className="rounded-md text-sm">
                    {getQuestionTypeLabel(type)}
                  </span>
                  <Progress
                    value={(correct / total) * 100}
                    className={`w-full h-2 bg-${getPercentageColor(
                      (correct / total) * 100,
                      "ascending"
                    )}`}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
