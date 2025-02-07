// import { UserNav } from "./user-nav";
import { ModeToggle } from "./mode-toggle";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { Brain } from "lucide-react";

export function Header() {
  return (
    <header className="fixed w-full top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/80">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Teach.me</span>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {/* Saved for dev purposes  */}

          <ModeToggle />
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* <ModeToggle />
          <UserNav /> */}
        </div>
      </div>
    </header>
  );
}
