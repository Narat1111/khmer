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

// Bakong API endpoints
const BAKONG_API = "https://api-bakong.nbc.gov.kh";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const BAKONG_TOKEN = Deno.env.get("BAKONG_TOKEN");
    if (!BAKONG_TOKEN) {
      return new Response(JSON.stringify({ error: "BAKONG_TOKEN not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, md5, qr_data } = body;

    // Generate MD5 hash from QR data
    if (action === "generate_md5" && qr_data) {
      const md5Hash = await computeMd5(qr_data);
      return new Response(JSON.stringify({ md5: md5Hash }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check payment status
    if (action === "check_payment" && md5) {
      try {
        const response = await fetch(`${BAKONG_API}/v1/check_transaction_by_md5`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${BAKONG_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ md5 }),
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          // API returned non-JSON (HTML error page etc.)
          data = { responseCode: -1, responseMessage: "UNPAID", rawStatus: response.status };
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (fetchErr) {
        // Network error - return UNPAID status
        return new Response(JSON.stringify({ 
          responseCode: -1, 
          responseMessage: "UNPAID",
          error: fetchErr instanceof Error ? fetchErr.message : "Network error"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Get payment details
    if (action === "get_payment" && md5) {
      try {
        const response = await fetch(`${BAKONG_API}/v1/check_transaction_by_md5`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${BAKONG_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ md5 }),
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { responseCode: -1, responseMessage: "Unable to fetch payment info" };
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (fetchErr) {
        return new Response(JSON.stringify({ 
          responseCode: -1,
          error: fetchErr instanceof Error ? fetchErr.message : "Network error"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use: check_payment, generate_md5, get_payment" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
