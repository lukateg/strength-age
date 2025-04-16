import { TestsProvider } from "@/providers/tests-provider";

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TestsProvider>
      <div className="mx-auto container p-6 space-y-10">{children}</div>
    </TestsProvider>
  );
}
