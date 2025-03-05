import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClassProvider } from "@/providers/class-context-provider";

interface ClassLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function ClassLayout({ children, params }: ClassLayoutProps) {
  const { id } = await params;
  return (
    <ClassProvider classId={id}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href={`/app/classes/${id}`}>
              <h1 className="text-4xl font-bold">Advanced Mathematics</h1>
            </Link>
            <p className="text-muted-foreground mt-2">Professor: John Doe</p>
          </div>
          <Link href={`/app/classes/${id}/file-upload`}>
            <Button>Upload Material</Button>
          </Link>
        </div>
        {children}
      </div>
    </ClassProvider>
  );
}

export default ClassLayout;
