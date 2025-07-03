import { api } from "convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

function formatStatNumber(num: number): string {
  if (num < 10) {
    // Numbers less than 10: show exact number without "+"
    return `${num}`;
  } else if (num >= 1000) {
    // 1000+: Show as K notation
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    if (remainder === 0) {
      return `${thousands}K`;
    } else {
      return `${thousands}.${Math.floor(remainder / 100)}K+`;
    }
  } else if (num >= 100) {
    // 100-999: Round down to nearest 100
    const hundreds = Math.floor(num / 100) * 100;
    return `${hundreds}+`;
  } else {
    // 10-99: Round down to nearest 10
    const tens = Math.floor(num / 10) * 10;
    return `${tens}+`;
  }
}

export default async function StatsSection() {
  const data = await fetchQuery(api.pages.landingPage.getLandingPageData);

  const STATS = [
    {
      number: formatStatNumber(data.testsGenerated),
      label: "Tests Generated",
      description: "AI-powered assessments created by our users",
    },
    {
      number: formatStatNumber(data.userFeedback),
      label: "User feedbacks",
      description: "We are listening to you and improving the platform",
    },
    {
      number: formatStatNumber(data.activeUsers),
      label: "Active Users",
      description: "Students and educators using our platform",
    },
  ];

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
