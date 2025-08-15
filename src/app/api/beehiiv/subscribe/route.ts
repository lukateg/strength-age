import { type NextRequest, NextResponse } from "next/server";
import { beehiivApiSchema } from "@/lib/validations/newsletter";

interface BeehiivError {
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = (await request.json()) as unknown;

    // Validate the request body with Zod
    const validationResult = beehiivApiSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const body = validationResult.data;
    const {
      email,
      utmSource = "website",
      utmCampaign = "waitlist",
      utmMedium = "form",
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error("Missing Beehiiv API credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Beehiiv API endpoint
    const beehiivEndpoint = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;

    // Prepare subscriber data
    const subscriberData = {
      email: email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: utmSource,
      utm_campaign: utmCampaign,
      utm_medium: utmMedium,
      referring_site:
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://quickaudit.com",
    };

    // Make API call to Beehiiv
    const response = await fetch(beehiivEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(subscriberData),
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as BeehiivError;
      console.error("Beehiiv API error:", response.status, errorData);

      // Handle specific Beehiiv error cases
      if (
        response.status === 400 &&
        errorData.message?.includes("already exists")
      ) {
        return NextResponse.json(
          { message: "Email already subscribed" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "Failed to subscribe to newsletter" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as Record<string, unknown>;

    return NextResponse.json(
      { message: "Successfully subscribed to newsletter", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
