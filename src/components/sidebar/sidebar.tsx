"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Layout, MessageCircle } from "lucide-react";
import { NAVIGATION } from "./constants";
import FeedbackModal from "@/components/feedback-modal";
// import { useLoadingContext } from "@/providers/loading-context";

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const { setLoading } = useLoadingContext();

  return (
    <aside
      className={cn("h-screen border-r pt-16 overflow-hidden flex flex-col")}
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
          {NAVIGATION.map((item) => {
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

      <div className="p-4 mt-auto">
        <FeedbackModal
          trigger={
            <Button
              className="w-full"
              size={isCollapsed ? "icon" : "default"}
              variant="outline"
            >
              <MessageCircle className="h-4 w-4" />
              {!isCollapsed && "Leave feedback"}
            </Button>
          }
        />
      </div>
    </aside>
  );
};

export default Sidebar;
