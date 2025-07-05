import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const VERSION_PROGRESS = [
  {
    version: "0.1",
    title: "Beta Launch",
    description:
      "Initial beta release with core PDF upload and basic test generation features",
    completed: true,
  },
  {
    version: "0.2",
    title: "Fixing Bugs",
    description:
      "Fixing bugs and improving the overall user experience, by checking the feedback from the users",
    completed: false,
  },
  {
    version: "0.3",
    title: "Enhanced UX",
    description:
      "Checking the feedback from the users and analitics, and improving the overall user experience",
    completed: false,
  },
  {
    // version: "0.4",
    // title: "Coming Soon",
    // description: "To be announced",
    completed: false,
    current: false,
  },
  {
    // version: "0.5",
    // title: "Coming Soon",
    // description:
    //   "We are working on some new features, that will be available in the future",
    completed: false,
  },
  {
    // version: "0.6",
    // title: "Coming Soon",
    // description:
    //   "We are working on some new features, that will be available in the future",
    completed: false,
  },
  {
    version: "1.0",
    title: "Full Launch",
    description:
      "Complete feature set with advanced AI capabilities and enterprise features",
    completed: false,
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="pt-20 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Development Roadmap
          </h2>
          <div className="relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>

            {/* Main Progress Line */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-border via-border to-border transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-3/5 h-1 bg-gradient-to-r from-primary via-primary to-primary/60 transform -translate-y-1/2 shadow-lg shadow-primary/20"></div>

              {/* Animated Energy Flow */}
              <div className="absolute top-1/2 left-0 w-3/5 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-y-1/2 animate-pulse"></div>
            </div>

            {/* Version Milestones */}
            <div className="flex justify-between relative py-8 px-4">
              {VERSION_PROGRESS.map((version, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col items-center"
                >
                  {/* Milestone Marker */}
                  <div className="relative">
                    {/* Outer Hexagon */}
                    <div
                      className={`relative w-6 h-6 md:w-12 md:h-12 transition-all duration-300 cursor-pointer group-hover:scale-110 ${
                        version.completed
                          ? "filter drop-shadow-lg drop-shadow-primary/50"
                          : version.current
                            ? "filter drop-shadow-lg drop-shadow-primary/30"
                            : ""
                      }`}
                      style={{
                        transform: "rotate(45deg)",
                      }}
                    >
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          version.completed
                            ? "bg-gradient-to-br from-primary to-primary/80"
                            : version.current
                              ? "bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary"
                              : "bg-gradient-to-br from-card to-card/60 border border-border"
                        }`}
                      >
                        {/* Inner Content */}
                        <div
                          className="text-center"
                          style={{
                            transform: "rotate(-45deg)",
                          }}
                        >
                          {version.completed ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <span
                              className={`text-xs font-bold ${
                                version.current
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {version.version}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Outer Ring for Current Version */}

                    {/* Completion Glow */}
                    {version.completed && (
                      <div className="absolute inset-0 w-16 h-16 bg-primary/10 blur-xl cursor-pointer"></div>
                    )}
                  </div>

                  {/* Enhanced Tooltip */}
                  {version.description && (
                    <div
                      className={`absolute top-16 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 ${
                        index === 0
                          ? "left-0"
                          : index === VERSION_PROGRESS.length - 1
                            ? "right-0"
                            : "left-1/2 transform -translate-x-1/2"
                      }`}
                    >
                      <div className="bg-card/95 backdrop-blur-sm border border-primary/20 rounded-lg p-5 shadow-2xl shadow-primary/10 min-w-[280px]">
                        <div className="text-left">
                          <h4 className="text-base font-bold text-primary mb-3">
                            {version.title}
                          </h4>
                          {/* <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {version.description}
                          </p> */}
                          {/* Feature highlights for each version */}
                          <div className="space-y-1">
                            {version.version === "0.1" && (
                              <>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Basic PDF upload functionality
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  True/false questions
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Multiple choice questions
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  True/false questions
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Result sharing
                                </div>
                              </>
                            )}
                            {version.version === "0.2" && (
                              <>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Fixing bugs
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Improving the overall user experience
                                </div>
                              </>
                            )}
                            {version.version === "0.3" && (
                              <>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Multiple choice questions
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Result sharing system
                                </div>
                              </>
                            )}
                            {version.version === "0.4" && (
                              <>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  To be announced...
                                </div>
                              </>
                            )}
                            {version.version === "0.5" && (
                              <>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  To be announced...
                                </div>
                              </>
                            )}
                            {version.version === "0.6" && (
                              <>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  To be announced...
                                </div>
                              </>
                            )}
                            {version.version === "1.0" && (
                              <>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Test sharing system
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Colaborative learning
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Group leaderboard
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                  Voice generatted learning
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Tooltip Arrow */}
                        <div
                          className={`absolute top-full border-4 border-transparent border-t-card/95 ${
                            index === 0
                              ? "left-8"
                              : index === VERSION_PROGRESS.length - 1
                                ? "right-8"
                                : "left-1/2 transform -translate-x-1/2"
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Version Label */}
                  <div className="mt-6 text-center absolute top-4 md:top-10">
                    <div
                      className={`text-xs md:text-sm font-bold mb-1 ${
                        version.completed
                          ? "text-primary"
                          : version.current
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    >
                      {version.version === "" ? "" : version.version}
                    </div>
                    <div
                      className={`text-xs hidden md:block ${
                        version.completed
                          ? "text-foreground"
                          : version.current
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {version.title}
                    </div>
                    {version.current && (
                      <Badge
                        variant="outline"
                        className="mt-2 text-xs border-primary text-primary"
                      >
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Stats */}
            <div className="text-center py-20">
              <div className="inline-flex items-center space-x-4 bg-card/30 border border-border/40 rounded-full px-6 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">
                    Current: v0.1
                  </span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="text-sm text-muted-foreground">
                  10% Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
