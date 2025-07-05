import Link from "next/link";
import { Brain, Sparkles, BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/app"
      className="flex items-center justify-start space-x-3 md:flex-none flex-1 group"
    >
      {/* Logo Icon Container */}
      <div className="relative">
        {/* Main Logo Circle with Gradient */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-purple-600 p-0.5 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
          <div className="w-full h-full rounded-xl bg-card flex items-center justify-center group-hover:bg-card/90 transition-all duration-300">
            <Brain className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>

        {/* Floating Accent Elements */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-accent to-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
        </div>

        {/* Secondary Book Icon */}
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-primary opacity-70 group-hover:opacity-90 transition-opacity duration-300">
          <BookOpen className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 w-10 h-10 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        {/* Main Brand Name */}
        <div className="flex items-center space-x-1">
          <span className="text-xl font-bold bg-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-purple-600 transition-all duration-300">
            Teach
          </span>
          <span className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
            .me
          </span>
        </div>

        {/* Subtle Tagline */}
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-0.5">
          AI Learning
        </span>
      </div>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-20"></div>
    </Link>
  );
}
