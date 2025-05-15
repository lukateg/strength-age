import { ClassesProvider } from "@/providers/classes-provider";
import { Suspense } from "react";

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClassesProvider>
      <Suspense>{children}</Suspense>
    </ClassesProvider>
  );
}
