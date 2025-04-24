"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { BookOpen, Brain, Home, Menu, Plus, Settings } from "lucide-react";

const MobileSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home },
    { name: "My Classes", href: "/app/classes", icon: BookOpen },
    { name: "Test Generator", href: "/app/tests", icon: Brain },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <div className="flex flex-col h-full bg-background pt-16">
          <div className="p-4 border-b">
            <SheetTitle className="text-xl font-bold">Teach-me</SheetTitle>
          </div>

          <div className="flex-1 px-3 py-2">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Class
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
