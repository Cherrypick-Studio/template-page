import { createHmac } from "crypto";

const LS_API_BASE = "https://api.lemonsqueezy.com/v1";

interface CreateCheckoutOptions {
  variantId: string;
  templateId: string;
  redirectUrl: string;
}

/**
 * Creates a Lemon Squeezy hosted checkout session and returns the checkout URL.
 * Docs: https://docs.lemonsqueezy.com/api/checkouts#create-a-checkout
 */
export async function createLSCheckout(options: CreateCheckoutOptions): Promise<string> {
  const { variantId, templateId, redirectUrl } = options;

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    throw new Error("LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID must be set");
  }

  const response = await fetch(`${LS_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            redirect_url: redirectUrl,
          },
          checkout_data: {
            // custom data is passed back to your webhook as meta.custom_data
            custom: {
              template_id: templateId,
            },
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: storeId },
          },
          variant: {
            data: { type: "variants", id: variantId },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = (body as { errors?: { detail: string }[] })?.errors?.[0]?.detail;
    throw new Error(detail ?? `Lemon Squeezy API error: ${response.status}`);
  }

  const json = await response.json();
  return json.data.attributes.url as string;
}

/**
 * Verifies the HMAC-SHA256 signature sent by Lemon Squeezy on every webhook request.
 * The signature is in the X-Signature header.
 */
export function verifyLSWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  return digest === signature;
}
