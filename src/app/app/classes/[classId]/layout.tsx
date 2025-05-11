import { ClassProvider } from "@/providers/class-context-provider";
import { type Id } from "convex/_generated/dataModel";

interface ClassLayoutProps {
  children: React.ReactNode;
  params: { classId: Id<"classes"> };
}

export default function ClassLayout({ children, params }: ClassLayoutProps) {
  return <ClassProvider classId={params.classId}>{children}</ClassProvider>;
}
