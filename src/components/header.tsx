// import { UserNav } from "./user-nav";
import { ModeToggle } from "./mode-toggle";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import MobileSidebar from "./mobile-sidebar";
import Logo from "./logo";

export function Header() {
  return (
    <header className="fixed w-full top-0 z-50 border-b border-border/40 backdrop-blur-sm bg-background/80">
      <div className="flex h-16 items-center px-4">
        {/* <MobileSidebar /> */}

        <Logo />

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
