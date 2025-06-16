import { LessonProvider } from "@/providers/lesson-provider";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return <LessonProvider lessonId={lessonId}>{children}</LessonProvider>;
}
