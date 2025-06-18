import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NotAuthorizedProps {
  message?: string;
}

export default function NotAuthorized({ message }: NotAuthorizedProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <ShieldX className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">
          {message ?? "You don't have permission to access this resource."}
        </p>
        <Button asChild>
          <Link href="/app">Go Back</Link>
        </Button>
      </div>
    </div>
  );
}
