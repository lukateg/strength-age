import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Brain, School } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";

import { type UseFormSetValue } from "react-hook-form";
import { type TestFormValues } from "../page";

export default function TestScopeView({
  scope,
  setValue,
}: {
  scope: "single" | "multiple" | "whole";
  setValue: UseFormSetValue<TestFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Scope</CardTitle>
        <CardDescription>
          Select what content to include in the test
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={scope}
          onValueChange={(value) =>
            setValue("scope", value as "single" | "multiple" | "whole")
          }
          className="grid gap-4"
        >
          <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Single Lesson
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Multiple Lessons
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="whole" id="whole" />
            <Label htmlFor="whole" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Whole Class
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
