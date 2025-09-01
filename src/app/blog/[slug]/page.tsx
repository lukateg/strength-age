import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  getArticleBySlug,
  getAllPublishedArticles,
  getRelatedArticles,
  type BlogArticle,
} from "@/data/blogArticles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Get article data from centralized source
function getArticleContent(slug: string): BlogArticle | null {
  return getArticleBySlug(slug);
}

// Fallback data for articles that don't have full content yet
const placeholderArticles: { [key: string]: any } = {
  "senior-fitness-test-at-home": {
    title: "Senior Fitness Tests You Can Do at Home",
    description:
      "Complete guide to testing your fitness at home with simple, evidence-based assessments designed for seniors.",
    category: "Pillar Article",
    readTime: "8 min read",
    publishDate: "2025-01-01",
    keywords: [
      "senior fitness test at home",
      "senior fitness assessment",
      "home fitness test for seniors",
    ],
    content: `
      <h1>Senior Fitness Tests You Can Do at Home</h1>
      
      <p>As we age, staying on top of our physical fitness becomes more crucial than ever. Regular fitness testing helps seniors monitor their functional capacity, identify areas for improvement, and track progress over time. The good news? You don't need a gym or expensive equipment to assess your fitness level.</p>
      
      <h2>Why Test Your Fitness at Home?</h2>
      
      <p>Home fitness testing offers several advantages for seniors:</p>
      
      <ul>
        <li><strong>Convenience:</strong> No need to travel to a clinic or gym</li>
        <li><strong>Comfort:</strong> Test in familiar surroundings at your own pace</li>
        <li><strong>Cost-effective:</strong> Free assessments using household items</li>
        <li><strong>Regular monitoring:</strong> Easy to repeat tests to track progress</li>
        <li><strong>Safety:</strong> Controlled environment with support available</li>
      </ul>
      
      <h2>Chair Stand Test</h2>
      
      <p>The 30-second chair stand test is one of the most validated measures of lower body strength in seniors. This test predicts your ability to perform daily activities like getting up from chairs, climbing stairs, and maintaining independence.</p>
      
      <h3>How to Perform:</h3>
      <ol>
        <li>Sit in a sturdy chair with your back straight</li>
        <li>Cross your arms over your chest</li>
        <li>On "go," stand up completely, then sit back down</li>
        <li>Count how many complete stand-ups you can do in 30 seconds</li>
        <li>Stop immediately if you feel pain or dizziness</li>
      </ol>
      
      <h3>Normal Ranges:</h3>
      <p>Men 60-69: 14-19 repetitions | Women 60-69: 12-17 repetitions</p>
      
      <h2>One-Leg Balance Test</h2>
      
      <p>Balance is crucial for fall prevention. The single-leg stance test helps assess your stability and fall risk.</p>
      
      <h3>How to Perform:</h3>
      <ol>
        <li>Stand near a wall or sturdy chair for safety</li>
        <li>Lift one foot off the ground</li>
        <li>Time how long you can hold the position</li>
        <li>Stop at 30 seconds maximum</li>
        <li>Test both legs</li>
      </ol>
      
      <h3>Safety Tips:</h3>
      <ul>
        <li>Always have support within arm's reach</li>
        <li>Test on a non-slip surface</li>
        <li>Don't attempt if you have severe balance issues</li>
      </ul>
      
      <h2>Resting Heart Rate</h2>
      
      <p>Your resting heart rate is a simple indicator of cardiovascular fitness. Lower rates generally suggest better fitness levels.</p>
      
      <h3>How to Measure:</h3>
      <ol>
        <li>Rest quietly for 5 minutes</li>
        <li>Find your pulse at your wrist or neck</li>
        <li>Count beats for 15 seconds, multiply by 4</li>
        <li>Take measurement at the same time each day</li>
      </ol>
      
      <h2>Waist-to-Height Ratio</h2>
      
      <p>This simple measurement is a better predictor of health risks than BMI, especially for seniors.</p>
      
      <h3>How to Calculate:</h3>
      <ol>
        <li>Measure your waist at the narrowest point</li>
        <li>Measure your height</li>
        <li>Divide waist by height (both in same units)</li>
        <li>Aim for a ratio below 0.5</li>
      </ol>
      
      <h2>2-Minute Step Test</h2>
      
      <p>This test assesses cardiovascular endurance without needing space for walking.</p>
      
      <h3>How to Perform:</h3>
      <ol>
        <li>Stand facing a wall with good posture</li>
        <li>Step in place, bringing knees to hip level</li>
        <li>Count steps for 2 minutes</li>
        <li>Rest if needed, but keep the timer running</li>
      </ol>
      
      <h2>How to Use These Tests Together</h2>
      
      <p>These tests work best when used as a complete assessment battery. Here's how to get started:</p>
      
      <ol>
        <li><strong>Baseline Testing:</strong> Complete all tests to establish your starting point</li>
        <li><strong>Regular Monitoring:</strong> Repeat tests every 3-6 months</li>
        <li><strong>Track Progress:</strong> Keep a simple log of your results</li>
        <li><strong>Set Goals:</strong> Focus on maintaining or improving weak areas</li>
      </ol>
      
      <h2>Safety Considerations</h2>
      
      <ul>
        <li>Consult your doctor before starting any fitness testing</li>
        <li>Stop immediately if you experience pain, dizziness, or shortness of breath</li>
        <li>Have someone nearby when testing, especially for balance tests</li>
        <li>Don't test when you're feeling unwell</li>
        <li>These tests are screening tools, not medical diagnoses</li>
      </ul>
      
      <h2>When to Seek Professional Help</h2>
      
      <p>Consider consulting a healthcare provider or fitness professional if:</p>
      
      <ul>
        <li>Your results are significantly below normal ranges</li>
        <li>You experience a sudden decline in performance</li>
        <li>You have concerns about your balance or mobility</li>
        <li>You want to start an exercise program based on your results</li>
      </ul>
      
      <p>Regular fitness testing empowers seniors to take control of their health and make informed decisions about their wellness journey. Start with these simple tests today and take the first step toward better health awareness.</p>
    `,
  },
  "chair-stand-test-seniors": {
    title: "Chair Stand Test for Seniors: Complete Guide",
    description:
      "Learn how to perform the 30-second chair stand test, understand norms by age, and improve your lower body strength.",
    category: "Exercise Guide",
    readTime: "6 min read",
    publishDate: "2025-01-08",
    keywords: [
      "chair stand test seniors",
      "30 second sit to stand norms",
      "sit to stand test instructions",
    ],
    content: `
      <h1>Chair Stand Test for Seniors</h1>
      
      <p>The 30-second chair stand test is one of the most important fitness assessments for seniors. This simple test measures lower body strength and predicts your ability to perform essential daily activities independently.</p>
      
      <h2>What is the Chair Stand Test?</h2>
      
      <p>The chair stand test, also known as the sit-to-stand test, measures how many times you can stand up from a seated position in 30 seconds. It's part of the validated Rikli & Jones Senior Fitness Test battery and is widely used by healthcare professionals to assess functional fitness in older adults.</p>
      
      <h2>Why This Test Matters</h2>
      
      <p>Lower body strength is crucial for:</p>
      <ul>
        <li>Getting up from chairs, beds, and toilets</li>
        <li>Climbing stairs safely</li>
        <li>Walking with confidence</li>
        <li>Maintaining balance and preventing falls</li>
        <li>Staying independent in daily activities</li>
      </ul>
      
      <h2>Step-by-Step Instructions</h2>
      
      <h3>Equipment Needed:</h3>
      <ul>
        <li>Sturdy chair without arms (seat height 16-17 inches)</li>
        <li>Timer or stopwatch</li>
        <li>Non-slip surface</li>
      </ul>
      
      <h3>Test Procedure:</h3>
      <ol>
        <li><strong>Setup:</strong> Place the chair against a wall for stability</li>
        <li><strong>Starting Position:</strong> Sit in the middle of the chair with feet flat on the floor, shoulder-width apart</li>
        <li><strong>Arm Position:</strong> Cross your arms over your chest, hands on opposite shoulders</li>
        <li><strong>Posture:</strong> Sit with your back straight, not touching the chair back</li>
        <li><strong>The Test:</strong> On "go," stand up completely until legs are straight, then sit back down with control</li>
        <li><strong>Counting:</strong> Count each complete stand-up (sitting back down completes one repetition)</li>
        <li><strong>Duration:</strong> Continue for exactly 30 seconds</li>
      </ol>
      
      <h2>Age and Sex Norms</h2>
      
      <h3>Men:</h3>
      <ul>
        <li>Ages 60-64: 14-19 repetitions (below 11 = below average, above 19 = above average)</li>
        <li>Ages 65-69: 12-18 repetitions</li>
        <li>Ages 70-74: 12-17 repetitions</li>
        <li>Ages 75-79: 11-17 repetitions</li>
        <li>Ages 80-84: 10-15 repetitions</li>
        <li>Ages 85-89: 8-14 repetitions</li>
      </ul>
      
      <h3>Women:</h3>
      <ul>
        <li>Ages 60-64: 12-17 repetitions (below 8 = below average, above 17 = above average)</li>
        <li>Ages 65-69: 11-16 repetitions</li>
        <li>Ages 70-74: 10-15 repetitions</li>
        <li>Ages 75-79: 10-15 repetitions</li>
        <li>Ages 80-84: 9-14 repetitions</li>
        <li>Ages 85-89: 8-13 repetitions</li>
      </ul>
      
      <h2>Common Mistakes to Avoid</h2>
      
      <ul>
        <li><strong>Not standing fully:</strong> Ensure you reach complete hip and knee extension</li>
        <li><strong>Using momentum:</strong> Rise with control, don't bounce off the chair</li>
        <li><strong>Wrong chair height:</strong> Seat should be 16-17 inches high</li>
        <li><strong>Rushing:</strong> Quality over speed - full stands count, partial ones don't</li>
        <li><strong>Wrong arm position:</strong> Keep arms crossed throughout the test</li>
        <li><strong>Leaning forward excessively:</strong> Some forward lean is normal, but avoid extreme positioning</li>
      </ul>
      
      <h2>Safety Considerations</h2>
      
      <ul>
        <li>Stop immediately if you experience pain, dizziness, or shortness of breath</li>
        <li>Have someone nearby during the test</li>
        <li>Ensure the chair is stable and won't slide</li>
        <li>Don't perform this test if you have recent injuries or severe balance problems</li>
        <li>Consult your healthcare provider before testing if you have concerns</li>
      </ul>
      
      <h2>Improving Your Score</h2>
      
      <p>If your score is below the normal range, here are some exercises to help:</p>
      
      <h3>Chair Squats:</h3>
      <p>Practice the same movement without time pressure. Start with 5-10 repetitions, gradually increasing.</p>
      
      <h3>Wall Squats:</h3>
      <p>Stand with your back against a wall, slide down to a comfortable squat position, and push back up.</p>
      
      <h3>Step-Ups:</h3>
      <p>Use a sturdy step or low platform to practice stepping up and down with control.</p>
      
      <h3>Leg Strengthening:</h3>
      <ul>
        <li>Seated leg extensions</li>
        <li>Standing marching in place</li>
        <li>Calf raises</li>
        <li>Mini squats with support</li>
      </ul>
      
      <h2>When to Retest</h2>
      
      <p>Retest every 3-6 months to monitor progress. If you're following an exercise program, you may see improvements in 6-8 weeks of consistent training.</p>
      
      <h2>What Your Score Means</h2>
      
      <ul>
        <li><strong>Above Average:</strong> Excellent functional strength for your age</li>
        <li><strong>Average:</strong> Good strength, maintain with regular activity</li>
        <li><strong>Below Average:</strong> Consider strength training to improve functional capacity</li>
        <li><strong>Significantly Below:</strong> Consult a healthcare provider or physical therapist</li>
      </ul>
      
      <p>Remember, this test is one component of overall fitness. Use it as a tool to guide your health and fitness decisions, but always consider it alongside other health factors and professional medical advice.</p>
    `,
  },
  // Additional articles would be added here...
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogArticle({ params }: PageProps) {
  // First try to get from published articles
  let article = getArticleContent(params.slug);

  // If not found in published articles, check placeholders
  if (!article) {
    const placeholderData = placeholderArticles[params.slug];
    if (!placeholderData) {
      notFound();
    }
    // Convert placeholder to BlogArticle format
    article = {
      slug: params.slug,
      title: placeholderData.title,
      excerpt: placeholderData.description,
      content: placeholderData.content,
      publishedAt: placeholderData.publishDate,
      readTime: placeholderData.readTime,
      category: placeholderData.category,
      keywords: placeholderData.keywords,
      metaDescription: placeholderData.description,
    };
  }

  // Get smart related articles based on category and keywords
  const allPublishedArticles = getAllPublishedArticles();
  const relatedArticles = getRelatedArticles(params.slug, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header currentPage="blog" />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline">{article.category}</Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="mr-4">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{article.readTime}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Strength Age with Our Free 2-Minute Test
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Put these insights into practice. Take our validated strength age
              assessment and get personalized results based on the research
              discussed in this article.
            </p>
            <Link href="/test">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Take the Strength Age Test
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Related Articles - Only show if there are other published articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card
                  key={relatedArticle.slug}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {relatedArticle.category}
                    </Badge>
                    <CardTitle className="text-lg">
                      <Link
                        href={`/blog/${relatedArticle.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {relatedArticle.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{relatedArticle.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {relatedArticle.readTime}
                      </div>
                      <Link href={`/blog/${relatedArticle.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show "View All Articles" link if there are more articles than displayed */}
            {allPublishedArticles.length > relatedArticles.length + 1 && (
              <div className="text-center mt-6">
                <Link href="/blog">
                  <Button variant="outline" className="px-6 py-2">
                    View All Articles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}

// Generate static params for all blog posts
export function generateStaticParams() {
  // Get published articles and placeholder articles
  const publishedSlugs = getAllPublishedArticles().map(
    (article) => article.slug
  );
  const placeholderSlugs = Object.keys(placeholderArticles);

  // Combine all slugs
  const allSlugs = [...publishedSlugs, ...placeholderSlugs];

  return allSlugs.map((slug) => ({
    slug,
  }));
}
