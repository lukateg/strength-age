import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function UnknownError({ error }: { error: Error }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">
          {error?.message ?? "An unexpected error occurred"}
        </p>
        <Button asChild>
          <Link href="/app">Go back to the dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
