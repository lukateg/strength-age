import { query } from "../_generated/server";

export const getLandingPageData = query({
  args: {},
  handler: async (ctx) => {
    // const landingPageData = await ctx.db.query("landingPageData").collect();
    // const testimonials = await ctx.db.query("testimonials").collect();
    // const faqs = await ctx.db.query("faqs").collect();

    return {
      landingPageData: "",
      testimonials: [""],
      faqs: [""],
    };
  },
});
