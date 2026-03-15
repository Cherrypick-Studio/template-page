import { NextRequest, NextResponse } from "next/server";
import { createLSCheckout } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.variantId || !body?.templateId) {
    return NextResponse.json(
      { error: "variantId and templateId are required" },
      { status: 400 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const checkoutUrl = await createLSCheckout({
      variantId: String(body.variantId),
      templateId: String(body.templateId),
      redirectUrl: `${siteUrl}/order-success`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create checkout" },
      { status: 500 }
    );
  }
}
