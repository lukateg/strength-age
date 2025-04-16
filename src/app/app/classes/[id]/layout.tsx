import { ClassProvider } from "@/providers/class-context-provider";

import ClassHeader from "./components/class-header";

import { type Id } from "convex/_generated/dataModel";

interface ClassLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: Id<"classes"> }>;
}

export default async function ClassLayout({
  children,
  params,
}: ClassLayoutProps) {
  const { id } = await params;

  return (
    <ClassProvider classId={id}>
      <div className="mx-auto container p-6 space-y-10">
        <ClassHeader id={id} />
        {children}
      </div>
    </ClassProvider>
  );
}
