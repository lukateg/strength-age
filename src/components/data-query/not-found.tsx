import Link from "next/link";
import { Button } from "../ui/button";

// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="container h-full mx-auto p-6 items-center justify-center flex">
      <div className="text-center">
        <h1 className="text-4xl font-bold">No data found</h1>
        <p className="mt-4 text-lg">
          The data you&apos;re trying to access does not exist, it could be
          deleted or never existed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/app">Go back to the dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
