"use client";

// import { UserNav } from "./user-nav";
import { ModeToggle } from "./mode-toggle";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import MobileSidebar from "./mobile-sidebar";
import Logo from "./logo";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="fixed w-full top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/80">
      <div className="flex h-16 items-center px-4">
        <SignedIn>
          <MobileSidebar />
        </SignedIn>

        <Logo />

        <div className="ml-auto flex items-center space-x-4">
          {/* Saved for dev purposes  */}

          <ModeToggle />

          <SignedOut>
            <Button variant="default" asChild>
              <SignInButton />
            </Button>
            {/* <Button variant="outline" asChild>
              <SignUpButton />
            </Button> */}
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
