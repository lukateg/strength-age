import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, strengthAge } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    // Here you would integrate with Resend or your email service
    // For now, we'll just log the data and return success
    console.log("Email report request:", { email, strengthAge });

    // TODO: Integrate with Resend API
    // - Generate HTML email template
    // - Send report with personalized results
    // - Include 20% discount code

    return NextResponse.json({
      success: true,
      message: "Report sent successfully",
    });
  } catch (error) {
    console.error("Error sending report:", error);
    return NextResponse.json(
      { error: "Failed to send report" },
      { status: 500 }
    );
  }
}
