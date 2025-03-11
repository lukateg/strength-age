import { ClassesProvider } from "@/providers/classes-provider";

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClassesProvider>{children}</ClassesProvider>;
}
