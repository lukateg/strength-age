import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Target } from "lucide-react";
import MiniPieChart from "./mini-pie-chart";

type MostActiveClass = {
  title: string;
  lessonsCount: number;
  pdfsCount: number;
  testReviewsCount: number;
  highestScore: number;
} | null;

export default function MostActiveClass({
  mostActiveClass,
}: {
  mostActiveClass: MostActiveClass;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Active Class</CardTitle>
        <p className="text-sm text-muted-foreground pt-2">
          {mostActiveClass?.title}
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold">
            {mostActiveClass?.lessonsCount}
          </span>{" "}
          <p className="text-muted-foreground">Lessons Created</p>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold">{mostActiveClass?.pdfsCount}</span>
          <p className="text-muted-foreground"> PDFs Uploaded</p>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold">
            {mostActiveClass?.testReviewsCount}
          </span>{" "}
          <p className="text-muted-foreground">Total Attempts</p>
        </div>
        <div className="flex items-center space-x-2">
          <MiniPieChart
            isColored={true}
            order="ascending"
            percentage={mostActiveClass?.highestScore ?? 0}
          />
          <span className="font-bold">{mostActiveClass?.highestScore}%</span>{" "}
          <p className="text-muted-foreground">Highest Score</p>
        </div>
      </CardContent>
    </Card>
  );
}
