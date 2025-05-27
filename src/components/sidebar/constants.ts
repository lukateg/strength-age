import { BookOpen, Brain, CreditCard, Home, Settings } from "lucide-react";

export const NAVIGATION = [
  { name: "Dashboard", href: "/app", icon: Home },
  { name: "My Classes", href: "/app/classes", icon: BookOpen },
  { name: "Test Generator", href: "/app/tests", icon: Brain },
  { name: "Pricing", href: "/app/pricing", icon: CreditCard },
  { name: "Settings", href: "/app/settings", icon: Settings },
];
