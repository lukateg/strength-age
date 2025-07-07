import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join other students and educators who are already using our
            AI-powered platform.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 bg-primary hover:bg-primary/90"
          >
            <Link href="/app" className="flex items-center">
              Start Your Free Trial
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
