"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Home, Layout, Settings } from "lucide-react";
// import { useLoadingContext } from "@/providers/loading-context";

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const { setLoading } = useLoadingContext();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "My Classes", href: "/app/classes", icon: BookOpen },
    { name: "Test Generator", href: "/app/tests", icon: Brain },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn("h-screen border-r bg-background pt-16 overflow-hidden")}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Layout className="h-6 w-6" />
        </Button>
      </div>

      <nav
        className={cn(
          "flex flex-col justify-between px-4 transition-[width] duration-200 ease-in-out",
          isCollapsed ? "w-[75px]" : "w-[220px]"
        )}
      >
        <ul className="flex h-full grow flex-col gap-3 overflow-hidden py-2">
          {navigation.map((item) => {
            // console.log(pathname === item.href, "[pathname === item.href]");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-2 w-full text-sm font-medium rounded-md  overflow-hidden",
                    pathname === item.href
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

      {/* <div className="p-4">
        <Button
          className="w-full"
          size={isCollapsed ? "icon" : "default"}
          onClick={() => {
            setLoading(true, "Generating test...");
          }}
        >
          <Plus className={cn("h-4 w-4")} />
          {!isCollapsed && "Simulate Loader"}
        </Button>
      </div> */}
    </aside>
  );
};

export default Sidebar;
