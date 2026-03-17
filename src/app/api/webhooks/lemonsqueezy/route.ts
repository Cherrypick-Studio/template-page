import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyLSWebhookSignature } from "@/lib/lemonsqueezy";
import type { Database } from "@/lib/supabase/types";

// Use service role key to bypass RLS — this runs server-side only
function getServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature") ?? "";

  if (!verifyLSWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = (event.meta as Record<string, unknown>)?.event_name as string | undefined;
  const data = event.data as Record<string, unknown> | undefined;
  const meta = event.meta as Record<string, unknown> | undefined;

  try {
    const supabase = getServiceClient();

    if (eventName === "order_created") {
      const attributes = data?.attributes as Record<string, unknown> | undefined;
      const customData = meta?.custom_data as Record<string, string> | undefined;

      const lsOrderId = String(data?.id ?? "");
      const templateId = customData?.template_id ?? null;
      const customerEmail = (attributes?.user_email as string | null) ?? null;
      // LS stores amounts in cents
      const totalAmount = typeof attributes?.total === "number" ? attributes.total / 100 : 0;

      // Idempotency: skip if this order was already processed
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("lemon_squeezy_order_id", lsOrderId)
        .maybeSingle();

      if (!existing) {
        const { error: insertError } = await supabase.from("orders").insert({
          template_id: templateId,
          status: "completed",
          total_amount: totalAmount,
          lemon_squeezy_order_id: lsOrderId,
          customer_email: customerEmail,
        });

        if (insertError) {
          console.error("[ls-webhook] order insert error:", insertError);
          return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
        }

        // Increment sales_count on the template using atomic RPC if available,
        // otherwise fall back to read-modify-write
        if (templateId) {
          await supabase.rpc("increment_sales_count", { template_id: templateId }).then(
            async ({ error: rpcError }) => {
              if (rpcError) {
                // Fallback: read-modify-write
                const { data: tmpl } = await supabase
                  .from("templates")
                  .select("sales_count")
                  .eq("id", templateId)
                  .single();
                if (tmpl) {
                  await supabase
                    .from("templates")
                    .update({ sales_count: (tmpl.sales_count ?? 0) + 1 })
                    .eq("id", templateId);
                }
              }
            }
          );
        }
      }
    }

    if (eventName === "order_refunded") {
      const lsOrderId = String(data?.id ?? "");
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("lemon_squeezy_order_id", lsOrderId);

      if (updateError) {
        console.error("[ls-webhook] refund update error:", updateError);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
      }
    }
  } catch (err) {
    console.error("[ls-webhook] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
