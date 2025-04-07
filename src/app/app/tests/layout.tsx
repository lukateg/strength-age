import { TestsProvider } from "@/providers/tests-provider";

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TestsProvider>{children}</TestsProvider>;
}
