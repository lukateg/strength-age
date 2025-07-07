import {
  BookOpen,
  Brain,
  Home,
  MessageCircle,
  Settings,
  Sparkles,
} from "lucide-react";

export const NAVIGATION = [
  { name: "Dashboard", href: "/app", icon: Home },
  { name: "My Classes", href: "/app/classes", icon: BookOpen },
  { name: "Test Generator", href: "/app/tests", icon: Brain },
  { name: "Settings", href: "/app/settings", icon: Settings },
  { name: "Quick Guide", href: "/app/quick-guide", icon: Sparkles },
];
