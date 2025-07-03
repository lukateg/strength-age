const STATS = [
  {
    number: "500+",
    label: "Tests Generated",
    description: "AI-powered assessments created by our users",
  },
  {
    number: "15+",
    label: "User feedbacks",
    description: "We are listening to you and improving the platform",
  },
  {
    number: "1.2K+",
    label: "Active Users",
    description: "Students and educators using our platform",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2 text-primary">
                {stat.number}
              </div>
              <div className="text-lg font-medium mb-2">{stat.label}</div>
              <div className="text-muted-foreground text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
