"use client";

import { useLoadingContext } from "@/providers/loading-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import Link from "next/link";

import { type ReactNode } from "react";

export default function LinkWithLoader({
  to,
  children,
  className,
  variant,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
}) {
  const { setLoading } = useLoadingContext();
  const router = useRouter();

  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoading(true, "Loading test...");

    try {
      router.push(to);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant={variant} size="sm" asChild className={className}>
      <Link href={to} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}
