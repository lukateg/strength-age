"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  School,
  BookOpen,
  SplitSquareHorizontal,
  Settings2,
} from "lucide-react";
import { FormField } from "@/components/ui/form";
import { FormControl, FormItem } from "@/components/ui/form";
import ItemsScrollArea from "@/components/items-scroll-area";
import CheckboxListItem from "@/components/checkbox-list-item";
import { useClass } from "@/providers/class-context-provider";
import { type Id } from "convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
type TestFormValues = {
  testName: string;
  description: string;
  scope: "single" | "multiple" | "whole";
  distribution: "equal" | "custom";
  questionAmount: number;
  difficulty: number;
  questionTypes: string[];
  lessonQuestions: Record<string, number>;
  lessons: Id<"lessons">[];
};

export default function CreateTest() {
  //   const lessonsById = useQuery(api.lessons.getPDFsByLessonId, {
  //     lessonId: classId as Id<"lessons">,
  //   });
  const { lessons } = useClass();
  const form = useForm<TestFormValues>({
    defaultValues: {
      scope: "single",
      distribution: "equal",
      questionAmount: 10,
      difficulty: 50,
      questionTypes: [],
      lessonQuestions: {
        "1": 10,
        "2": 10,
        "3": 10,
      },
      lessons: [],
    },
  });

  const { control, watch, setValue, handleSubmit, register } = form;

  const scope = watch("scope");
  const distribution = watch("distribution");
  const questionAmount = watch("questionAmount");
  const difficulty = watch("difficulty");

  // Mock data for multiple lessons (replace with real data)
  const selectedLessons = [
    { id: 1, name: "Lesson 1", questions: 10 },
    { id: 2, name: "Lesson 2", questions: 10 },
    { id: 3, name: "Lesson 3", questions: 10 },
  ];

  const questionTypes = [
    { id: "multiple-choice", label: "Multiple Choice" },
    { id: "true-false", label: "True/False" },
    // { id: "fill-blanks", label: "Fill in the Blanks" },
    { id: "short-answer", label: "Short Answer" },
    // { id: "mixed", label: "Mixed (AI-generated)" },
  ];

  const onSubmit = async (formData: TestFormValues) => {
    const response = await fetch("/api/generateTest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: formData.lessons[0],
        questionAmount: 10,
      }),
    });

    // TODO: add schema type
    const data = (await response.json()) as { response: string };

    console.log("Generated Test:", data);
  };

  const renderQuestionConfiguration = () => {
    if (scope === "multiple") {
      return (
        <>
          <div className="space-y-4 pb-6 border-b">
            <Label className="text-base">
              How do you want to distribute questions?
            </Label>
            <RadioGroup
              value={distribution}
              onValueChange={(value) =>
                setValue("distribution", value as "equal" | "custom")
              }
              className="grid gap-4"
            >
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal" className="flex items-center gap-2">
                  <SplitSquareHorizontal className="h-4 w-4" />
                  Equal per lesson
                  <span className="text-sm text-muted-foreground">
                    (30 questions across 3 lessons → 10 each)
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Custom per lesson
                </Label>
              </div>
            </RadioGroup>
          </div>

          {distribution === "equal" ? (
            <div className="space-y-4">
              <Label>Total Questions: {questionAmount}</Label>
              <Slider
                value={[questionAmount]}
                onValueChange={(value) =>
                  setValue("questionAmount", value[0] ?? 0)
                }
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Each lesson will have{" "}
                {Math.floor(questionAmount / selectedLessons.length)} questions
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Label>Questions per Lesson</Label>
              <div className="space-y-4">
                {selectedLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="grid grid-cols-2 gap-4 items-center"
                  >
                    <Label>{lesson.name}</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      {...register(`lessonQuestions.${lesson.id}`, {
                        valueAsNumber: true,
                      })}
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Total questions:{" "}
                {Object.values(watch("lessonQuestions")).reduce(
                  (a, b) => a + b,
                  0
                )}
              </p>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="space-y-4">
        <Label>Number of Questions: {questionAmount}</Label>
        <Slider
          value={[questionAmount]}
          onValueChange={(value) => setValue("questionAmount", value[0] ?? 0)}
          max={50}
          min={5}
          step={5}
          className="w-full"
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-8">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Set the basic details for your test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-name">Test Name (optional)</Label>
                  <Input
                    id="test-name"
                    placeholder="Enter test name or let AI generate one"
                    {...register("testName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-description">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="test-description"
                    placeholder="Add a description to help organize your tests"
                    className="resize-none"
                    {...register("description")}
                  />
                </div>
              </CardContent>
            </Card>

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
                    <Label
                      htmlFor="multiple"
                      className="flex items-center gap-2"
                    >
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

            {/* LESSONS SELECTION */}

            <Card>
              <CardHeader>
                <CardTitle>Lessons Selection</CardTitle>
                <CardDescription>
                  Select the lessons you want to include in the test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="lessons"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ItemsScrollArea>
                          {lessons?.map((lesson) => (
                            <CheckboxListItem
                              key={lesson._id}
                              checked={field.value.includes(lesson._id)}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked
                                    ? [...field.value, lesson._id]
                                    : field.value.filter(
                                        (id) => id !== lesson._id
                                      )
                                )
                              }
                              //   disabled={shouldDisableItem?.(pdf)}
                            >
                              <div>
                                <p className="font-base">{lesson.title}</p>
                              </div>
                            </CheckboxListItem>
                          ))}
                        </ItemsScrollArea>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Question Configuration</CardTitle>
                <CardDescription>
                  Configure the number and types of questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderQuestionConfiguration()}

                <div className="space-y-4">
                  <Label>Question Types</Label>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {questionTypes.map((type) => (
                        <div
                          key={type.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={type.id}
                            {...register("questionTypes")}
                            value={type.id}
                          />
                          <label
                            htmlFor={type.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-4">
                  <Label>Difficulty Level: {difficulty}%</Label>
                  <Slider
                    value={[difficulty]}
                    onValueChange={(value) =>
                      setValue("difficulty", value[0] ?? 0)
                    }
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Easy</span>
                    <span>Medium</span>
                    <span>Hard</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full">
              Generate Test
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
