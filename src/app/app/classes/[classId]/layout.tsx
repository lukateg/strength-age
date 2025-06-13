import { ClassProvider } from "@/providers/class-context-provider";

interface ClassLayoutProps {
  children: React.ReactNode;
  params: Promise<{ classId: string }>;
}

export default async function ClassLayout({
  children,
  params,
}: ClassLayoutProps) {
  const { classId } = await params;
  return (
    <ClassProvider classId={classId}>
      <div className="mx-auto container p-6 space-y-10">{children}</div>
    </ClassProvider>
  );
}
