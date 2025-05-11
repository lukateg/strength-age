import { ClassProvider } from "@/providers/class-context-provider";
import { type Id } from "convex/_generated/dataModel";

interface ClassLayoutProps {
  children: React.ReactNode;
  params: Promise<{ classId: Id<"classes"> }>;
}

export default async function ClassLayout({
  children,
  params,
}: ClassLayoutProps) {
  const { classId } = await params;
  return <ClassProvider classId={classId}>{children}</ClassProvider>;
}
