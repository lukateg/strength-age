export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 overflow-y-auto">{children}</main>;
}
