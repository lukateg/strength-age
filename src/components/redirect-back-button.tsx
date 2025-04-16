"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function RedirectBackButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
