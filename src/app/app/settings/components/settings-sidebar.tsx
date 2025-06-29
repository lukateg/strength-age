"use client";

import { cn } from "@/lib/utils";
import { CreditCard, Settings, TestTube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const settingsNavigation = [
  {
    name: "Subscriptions",
    href: "/app/settings/subscriptions",
    icon: CreditCard,
  },
  { name: "Tests", href: "/app/settings/tests", icon: TestTube },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-background border-r border-border h-full w-44">
      <div className="">
        <div className="text-muted-foreground flex items-center gap-2 p-6">
          <Settings className="w-6 h-6" />
          <div className="">Settings</div>
        </div>
        <Separator />

        <nav className="flex flex-col gap-3 p-2">
          <ul className="flex h-full grow flex-col gap-3 overflow-hidden py-2">
            {settingsNavigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-2 w-full text-sm font-medium rounded-md  overflow-hidden",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center justify-start gap-3 py-2 overflow-hidden">
                      <div className="flex h-6 w-6 items-center align-middle">
                        <item.icon className="w-6 h-6 " />
                      </div>
                      <span className="overflow-hidden whitespace-nowrap text-sm">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
