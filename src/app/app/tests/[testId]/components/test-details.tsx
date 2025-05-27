"use client";

import { useAuthenticatedQueryWithStatus } from "@/hooks/use-authenticated-query";
import { api } from "../../../../../../convex/_generated/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CheckSquare, AlignJustify, ToggleLeft } from "lucide-react";

import { type Lesson } from "@/components/generate-test-form/components/lesson-select-view/lesson-select-table";

type QuestionType = "multiple_choice" | "true_false" | "short_answer";

interface TestDetailsProps {
  questionCount: number;
  questionTypes: QuestionType[];
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
  difficulty?: number;
  lessons: Lesson[];
  classId: string;
}

export function TestDetails({
  questionCount,
  questionTypes,
  timeLimit,
  passingScore,
  difficulty = 50,
  lessons,
  classId,
}: TestDetailsProps) {
  const classData = useAuthenticatedQueryWithStatus(api.classes.getClassById, {
    id: classId,
  });

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case "multiple_choice":
        return <CheckSquare className="h-4 w-4 text-primary" />;
      case "true_false":
        return <ToggleLeft className="h-4 w-4 text-primary" />;
      case "short_answer":
        return <AlignJustify className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Test Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-lg font-medium">{questionCount}</p>
          </div>
          {timeLimit && (
            <div>
              <p className="text-sm text-muted-foreground">Time Limit</p>
              <p className="text-lg font-medium">{timeLimit} minutes</p>
            </div>
          )}
          {passingScore && (
            <div>
              <p className="text-sm text-muted-foreground">Passing Score</p>
              <p className="text-lg font-medium">{passingScore}%</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="text-lg font-medium">{difficulty}%</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">Question Types</p>
          <div className="flex flex-wrap gap-2">
            {questionTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-md text-sm"
              >
                {getQuestionTypeIcon(type)}
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Class:</p>
            <p className="text-sm font-medium">{classData.data?.title}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Lessons</p>
            <div className="flex text-sm flex-wrap gap-2">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-md text-sm"
                >
                  {lesson.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
