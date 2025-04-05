import Link from "next/link";

import { Brain } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center space-x-2 md:flex-none flex-1"
    >
      <Brain className="h-8 w-8 text-primary" />
      <span className="text-xl font-bold">Teach.me</span>
    </Link>
  );
}
