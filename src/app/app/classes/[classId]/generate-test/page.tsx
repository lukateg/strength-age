import GenerateTestForm from "@/components/generate-test-form/generate-test-form";

export default async function GenerateTestPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  return <GenerateTestForm classId={classId} />;
}
