import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto as stdCrypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

async function computeMd5(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await stdCrypto.subtle.digest("MD5", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BAKONG_API = "https://api-bakong.nbc.gov.kh/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const BAKONG_TOKEN = Deno.env.get("BAKONG_TOKEN");
    if (!BAKONG_TOKEN) {
      return new Response(JSON.stringify({ error: "BAKONG_TOKEN not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, md5, qr_data } = await req.json();

    if (action === "generate_md5" && qr_data) {
      // Generate MD5 hash using a simple implementation
      const encoder = new TextEncoder();
      const data = encoder.encode(qr_data);
      // Use SHA-256 as MD5 isn't available in Web Crypto, then truncate to simulate
      // Actually, we compute a proper MD5 via string manipulation
      const md5Hash = await computeMd5(qr_data);
      
      return new Response(JSON.stringify({ md5: md5Hash }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "check_payment" && md5) {
      // Check payment status via Bakong API
      const response = await fetch(`${BAKONG_API}/check_transaction_by_md5`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BAKONG_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ md5 }),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate_qr") {
      // Generate KHQR string
      const { bank_account, merchant_name, merchant_city, amount, currency, store_label, phone_number, bill_number, terminal_label } = await req.json().catch(() => ({}));
      
      const response = await fetch(`${BAKONG_API}/generate_qr_code`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BAKONG_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bank_account: bank_account || "dara_mao@bkrt",
          merchant_name: merchant_name || "Daratool_support",
          merchant_city: merchant_city || "Phnom Penh",
          amount: amount || 0,
          currency: currency || "USD",
          store_label: store_label || "Daratoolsupport",
          phone_number: phone_number || "855974640130",
          bill_number: bill_number || `TRX${Date.now()}`,
          terminal_label: terminal_label || "Cashier-01",
        }),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_payment" && md5) {
      // Get payment info
      const response = await fetch(`${BAKONG_API}/check_transaction_by_md5`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${BAKONG_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ md5 }),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use: check_payment, generate_qr, generate_md5, get_payment" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
