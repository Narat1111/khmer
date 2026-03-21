import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto as stdCrypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BAKONG_API = "https://api-bakong.nbc.gov.kh";

// ---- EMV QR Code (KHQR) Generator ----

function tlv(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${tag}${len}${value}`;
}

function computeCRC16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

interface KHQRParams {
  bank_account: string;
  merchant_name: string;
  merchant_city: string;
  amount?: number;
  currency?: "USD" | "KHR";
  store_label?: string;
  phone_number?: string;
  bill_number?: string;
  terminal_label?: string;
  static?: boolean;
}

function createKHQR(params: KHQRParams): string {
  const isStatic = params.static ?? false;
  const currency = params.currency || "USD";
  const currencyCode = currency === "USD" ? "840" : "116";

  let qr = "";

  // ID 00: Payload Format Indicator
  qr += tlv("00", "01");

  // ID 01: Point of Initiation Method (11=static, 12=dynamic)
  qr += tlv("01", isStatic ? "11" : "12");

  // ID 29: Merchant Account Information (Bakong)
  const accountInfo = tlv("00", params.bank_account);
  qr += tlv("29", accountInfo);

  // ID 52: Merchant Category Code
  qr += tlv("52", "5999");

  // ID 53: Transaction Currency
  qr += tlv("53", currencyCode);

  // ID 54: Transaction Amount (if provided and not static)
  if (params.amount !== undefined && params.amount > 0) {
    const amountStr = params.amount % 1 === 0 ? params.amount.toString() : params.amount.toFixed(2);
    qr += tlv("54", amountStr);
  }

  // ID 58: Country Code
  qr += tlv("58", "KH");

  // ID 59: Merchant Name
  qr += tlv("59", params.merchant_name);

  // ID 60: Merchant City
  qr += tlv("60", params.merchant_city);

  // ID 62: Additional Data Field Template
  let additionalData = "";
  if (params.bill_number) additionalData += tlv("01", params.bill_number);
  if (params.phone_number) additionalData += tlv("02", params.phone_number);
  if (params.store_label) additionalData += tlv("03", params.store_label);
  if (params.terminal_label) additionalData += tlv("07", params.terminal_label);
  if (additionalData) {
    qr += tlv("62", additionalData);
  }

  // ID 99: Bakong-specific timestamp
  const timestamp = Date.now().toString();
  qr += tlv("99", tlv("00", timestamp));

  // ID 63: CRC (placeholder "0000", then compute)
  const crcPlaceholder = qr + "6304";
  const crc = computeCRC16(crcPlaceholder);
  qr += tlv("63", crc);

  return qr;
}

// ---- MD5 Hash ----

async function computeMd5(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await stdCrypto.subtle.digest("MD5", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---- Deeplink Generator ----

async function generateDeeplink(
  qrData: string,
  token: string,
  callback?: string,
  appIconUrl?: string,
  appName?: string
): Promise<string> {
  try {
    const response = await fetch(`${BAKONG_API}/v1/generate_deeplink_by_qr`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qr: qrData,
        callback: callback || "",
        appIconUrl: appIconUrl || "",
        appName: appName || "",
      }),
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data?.data?.shortLink || data?.data?.link || data?.shortLink || "";
    } catch {
      return "";
    }
  } catch {
    return "";
  }
}

// ---- Main Handler ----

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const BAKONG_TOKEN = Deno.env.get("BAKONG_TOKEN") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiZGRmZmY3NmIyZjgzNDNiMyJ9LCJpYXQiOjE3NzIwMjU0MjQsImV4cCI6MTc3OTgwMTQyNH0.TZtJqGnMbDgacpub2eMlikdUf33a1QkjhMh361Frn-U";
    if (!BAKONG_TOKEN) {
      return new Response(JSON.stringify({ error: "BAKONG_TOKEN not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // ---- CREATE QR ----
    if (action === "create_qr") {
      const qrData = createKHQR({
        bank_account: body.bank_account || "chheak_narat@bkrt",
        merchant_name: body.merchant_name || "NARAT CHHEAK",
        merchant_city: body.merchant_city || "Phnom Penh",
        amount: body.amount,
        currency: body.currency || "USD",
        store_label: body.store_label || "NARAT CHHEAK",
        phone_number: body.phone_number || "855975867586",
        bill_number: body.bill_number,
        terminal_label: body.terminal_label || "Cashier-01",
        static: body.static ?? true,
      });
      const md5 = await computeMd5(qrData);

      return new Response(JSON.stringify({ qr: qrData, md5 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- GENERATE DEEPLINK ----
    if (action === "generate_deeplink" && body.qr_data) {
      const deeplink = await generateDeeplink(
        body.qr_data,
        BAKONG_TOKEN,
        body.callback,
        body.app_icon_url,
        body.app_name
      );
      return new Response(JSON.stringify({ deeplink }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- GENERATE MD5 ----
    if (action === "generate_md5" && body.qr_data) {
      const md5 = await computeMd5(body.qr_data);
      return new Response(JSON.stringify({ md5 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- CHECK PAYMENT ----
    if (action === "check_payment" && body.md5) {
      try {
        const response = await fetch(`${BAKONG_API}/v1/check_transaction_by_md5`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${BAKONG_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ md5: body.md5 }),
        });
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { responseCode: -1, responseMessage: "UNPAID" }; }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ responseCode: -1, responseMessage: "UNPAID", error: e instanceof Error ? e.message : "Network error" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ---- GET PAYMENT ----
    if (action === "get_payment" && body.md5) {
      try {
        const response = await fetch(`${BAKONG_API}/v1/check_transaction_by_md5`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${BAKONG_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ md5: body.md5 }),
        });
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { responseCode: -1, responseMessage: "Unable to fetch" }; }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ responseCode: -1, error: e instanceof Error ? e.message : "Network error" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use: create_qr, generate_deeplink, generate_md5, check_payment, get_payment" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
