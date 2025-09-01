// Centralized blog articles data
// Uncomment articles when they have full content and are ready to publish
// Keep commented articles for future reference

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  category: string;
  featured?: boolean;
  keywords: string[];
  metaDescription: string;
}

// Published articles (uncommented = live)
export const publishedArticles: BlogArticle[] = [
  {
    slug: "chair-stand-test-seniors",
    title: "Chair Stand Test for Seniors: Complete Guide & Scoring",
    excerpt:
      "Learn how to perform the chair stand test, understand your scores, and improve your lower body strength with this validated senior fitness assessment.",
    content: `
      <h2>What is the Chair Stand Test?</h2>
      <p>The chair stand test is a validated assessment of lower body strength and functional fitness for adults over 55. It measures how many times you can stand up and sit down from a chair in 30 seconds without using your arms.</p>
      
      <h2>How to Perform the Chair Stand Test</h2>
      <h3>Equipment Needed:</h3>
      <ul>
        <li>A sturdy chair with a straight back (seat height 15-17 inches)</li>
        <li>A stopwatch or timer</li>
        <li>Clear space around the chair</li>
      </ul>
      
      <h3>Step-by-Step Instructions:</h3>
      <ol>
        <li>Sit in the middle of the chair seat with your back straight</li>
        <li>Place your feet flat on the floor, shoulder-width apart</li>
        <li>Cross your arms over your chest</li>
        <li>On "go," stand up completely, then sit back down</li>
        <li>Repeat as many times as possible in 30 seconds</li>
        <li>Count only complete sit-to-stand movements</li>
      </ol>
      
      <h2>Understanding Your Score</h2>
      <h3>Age-Based Norms for Chair Stand Test:</h3>
      <h4>Ages 60-64:</h4>
      <ul>
        <li>Excellent: 17+ (men), 16+ (women)</li>
        <li>Good: 14-16 (men), 14-15 (women)</li>
        <li>Average: 12-13 (men), 12-13 (women)</li>
        <li>Below Average: 10-11 (men), 11 (women)</li>
        <li>Poor: <10 (men), <11 (women)</li>
      </ul>
      
      <h4>Ages 65-69:</h4>
      <ul>
        <li>Excellent: 16+ (men), 15+ (women)</li>
        <li>Good: 13-15 (men), 13-14 (women)</li>
        <li>Average: 11-12 (men), 11-12 (women)</li>
        <li>Below Average: 9-10 (men), 9-10 (women)</li>
        <li>Poor: <9 (men), <9 (women)</li>
      </ul>
      
      <h2>Tips to Improve Your Chair Stand Score</h2>
      <h3>Exercises to Build Lower Body Strength:</h3>
      <ul>
        <li><strong>Wall Squats:</strong> Stand with back against wall, slide down and up</li>
        <li><strong>Heel Raises:</strong> Rise up on toes, hold, lower slowly</li>
        <li><strong>Leg Extensions:</strong> Sit in chair, extend one leg straight, hold</li>
        <li><strong>Step-Ups:</strong> Step up onto a sturdy platform, step down</li>
      </ul>
      
      <h3>Practice Tips:</h3>
      <ul>
        <li>Start slowly and focus on proper form</li>
        <li>Practice the movement daily without timing</li>
        <li>Gradually increase speed while maintaining control</li>
        <li>Ensure full hip extension when standing</li>
      </ul>
      
      <h2>Why This Test Matters</h2>
      <p>Lower body strength is crucial for:</p>
      <ul>
        <li>Getting up from chairs, toilets, and beds independently</li>
        <li>Climbing stairs safely</li>
        <li>Preventing falls and injuries</li>
        <li>Maintaining mobility and independence</li>
      </ul>
      
      <h2>When to Consult a Professional</h2>
      <p>Consider speaking with a healthcare provider or fitness professional if:</p>
      <ul>
        <li>You cannot complete 8-10 chair stands in 30 seconds</li>
        <li>You experience pain during the test</li>
        <li>You have balance issues or feel unsteady</li>
        <li>You want a personalized exercise program</li>
      </ul>
      
      <p><strong>Ready to test your overall strength age?</strong> Take our comprehensive <a href="/test">Strength Age Assessment</a> that includes the chair stand test plus other validated measurements.</p>
    `,
    publishedAt: "2025-01-15",
    readTime: "8 min",
    category: "Fitness Tests",
    featured: true,
    keywords: [
      "chair stand test",
      "chair stand test seniors",
      "senior strength test",
      "lower body strength",
      "functional fitness",
    ],
    metaDescription:
      "Complete guide to the chair stand test for seniors. Learn proper technique, scoring, and exercises to improve your lower body strength and functional fitness.",
  },
];

// Unpublished articles (commented out for future reference)
export const unpublishedArticles: BlogArticle[] = [
  // {
  //   slug: "one-leg-balance-test-seniors",
  //   title: "One-Leg Balance Test for Seniors: Improve Stability & Prevent Falls",
  //   excerpt: "Master the one-leg balance test to assess and improve your stability. Essential for fall prevention and maintaining independence as you age.",
  //   content: "", // To be written
  //   publishedAt: "2025-01-22",
  //   readTime: "7 min",
  //   category: "Balance & Stability",
  //   keywords: ["balance test seniors", "one leg balance", "fall prevention", "stability test"],
  //   metaDescription: "Learn the one-leg balance test for seniors. Assess your stability, prevent falls, and improve balance with expert tips and exercises."
  // },
  // {
  //   slug: "resting-heart-rate-seniors",
  //   title: "Resting Heart Rate Guide for Seniors: What's Normal & How to Improve",
  //   excerpt: "Understand what constitutes a healthy resting heart rate for seniors and learn strategies to improve your cardiovascular fitness.",
  //   content: "", // To be written
  //   publishedAt: "2025-01-29",
  //   readTime: "6 min",
  //   category: "Cardiovascular Health",
  //   keywords: ["resting heart rate seniors", "normal heart rate", "cardiovascular health", "heart rate zones"],
  //   metaDescription: "Complete guide to resting heart rate for seniors. Learn normal ranges, how to measure, and ways to improve cardiovascular health."
  // },
  // {
  //   slug: "senior-fitness-test-at-home",
  //   title: "Senior Fitness Tests You Can Do at Home: Complete Assessment Guide",
  //   excerpt: "Comprehensive guide to at-home fitness tests for seniors. Assess your strength, balance, flexibility, and endurance without equipment.",
  //   content: "", // To be written
  //   publishedAt: "2025-02-05",
  //   readTime: "12 min",
  //   category: "Fitness Assessment",
  //   keywords: ["senior fitness test at home", "at home strength test seniors", "senior fitness assessment", "home fitness evaluation"],
  //   metaDescription: "Complete guide to senior fitness tests you can do at home. Assess strength, balance, and endurance with validated at-home assessments."
  // },
  // {
  //   slug: "improve-chair-stand-score",
  //   title: "How to Improve Your Chair Stand Test Score: Exercises & Training Plan",
  //   excerpt: "Proven exercises and training strategies to boost your chair stand test performance and build functional lower body strength.",
  //   content: "", // To be written
  //   publishedAt: "2025-02-12",
  //   readTime: "10 min",
  //   category: "Exercise & Training",
  //   keywords: ["improve chair stand", "chair stand exercises", "lower body strength", "functional training seniors"],
  //   metaDescription: "Learn how to improve your chair stand test score with targeted exercises and training plans designed for seniors."
  // },
  // {
  //   slug: "waist-to-height-ratio-seniors",
  //   title: "Waist-to-Height Ratio for Seniors: Better Than BMI for Health Assessment",
  //   excerpt: "Discover why waist-to-height ratio is a more accurate health indicator than BMI for seniors and how to calculate yours.",
  //   content: "", // To be written
  //   publishedAt: "2025-02-19",
  //   readTime: "8 min",
  //   category: "Health Metrics",
  //   keywords: ["waist to height ratio", "waist height ratio seniors", "BMI alternative", "body composition seniors"],
  //   metaDescription: "Learn about waist-to-height ratio for seniors. More accurate than BMI for assessing health risks and body composition."
  // },
  // {
  //   slug: "senior-strength-training-benefits",
  //   title: "Strength Training for Seniors: Benefits, Safety Tips & Getting Started",
  //   excerpt: "Essential guide to strength training for seniors. Learn the benefits, safety considerations, and how to start building muscle after 55.",
  //   content: "", // To be written
  //   publishedAt: "2025-02-26",
  //   readTime: "11 min",
  //   category: "Strength Training",
  //   keywords: ["strength training seniors", "senior weight training", "muscle building seniors", "resistance training older adults"],
  //   metaDescription: "Complete guide to strength training for seniors. Learn benefits, safety tips, and how to start building muscle safely after 55."
  // }
];

// Combined function to get all published articles
export function getAllPublishedArticles(): BlogArticle[] {
  return publishedArticles;
}

// Function to get article by slug
export function getArticleBySlug(slug: string): BlogArticle | null {
  return publishedArticles.find((article) => article.slug === slug) || null;
}

// Function to get featured articles
export function getFeaturedArticles(): BlogArticle[] {
  return publishedArticles.filter((article) => article.featured);
}

// Function to get recent articles (for footer links)
export function getPopularArticles(limit: number = 5): BlogArticle[] {
  return publishedArticles
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

// Function to get related articles based on category and keywords
export function getRelatedArticles(
  currentSlug: string,
  limit: number = 2
): BlogArticle[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const otherArticles = publishedArticles.filter(
    (article) => article.slug !== currentSlug
  );

  // Score articles based on relatedness
  const scoredArticles = otherArticles.map((article) => {
    let score = 0;

    // Same category gets high score
    if (article.category === currentArticle.category) {
      score += 10;
    }

    // Shared keywords get points
    const sharedKeywords = article.keywords.filter((keyword) =>
      currentArticle.keywords.includes(keyword)
    );
    score += sharedKeywords.length * 3;

    // Featured articles get slight boost
    if (article.featured) {
      score += 1;
    }

    return { article, score };
  });

  // Sort by score (highest first) and return top articles
  return scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}
