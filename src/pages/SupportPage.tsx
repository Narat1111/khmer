import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Smartphone, Loader2, RefreshCw, CheckCircle2, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import naratAvatar from "@/assets/narat-avatar.png";
import bakongIcon from "@/assets/icons/bakong-icon.png";

const BAKONG_ACCOUNT = "chheak_narat@bkrt";
const MERCHANT_NAME = "NARAT CHHEAK";

const SupportPage = () => {
  const { lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [md5Hash, setMd5Hash] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [deeplink, setDeeplink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const amounts = [
    { usd: 1, khr: 4100, label: "☕" },
    { usd: 2, khr: 8200, label: "🍜" },
    { usd: 5, khr: 20500, label: "💪" },
    { usd: 10, khr: 41000, label: "🌟" },
    { usd: 20, khr: 82000, label: "🚀" },
    { usd: 50, khr: 205000, label: "👑" },
  ];

  // Generate QR via edge function
  const generateQR = useCallback(async (amount?: number) => {
    setLoading(true);
    setPaymentStatus(null);
    try {
      const { data, error } = await supabase.functions.invoke("bakong-khqr", {
        body: {
          action: "create_qr",
          bank_account: BAKONG_ACCOUNT,
          merchant_name: MERCHANT_NAME,
          merchant_city: "Phnom Penh",
          amount: amount || undefined,
          currency: "USD",
          store_label: MERCHANT_NAME,
          phone_number: "855975867586",
          bill_number: `TRX${Date.now().toString().slice(-8)}`,
          terminal_label: "Cashier-01",
          static: !amount,
        },
      });
      if (error) throw error;
      if (data?.qr) {
        setQrData(data.qr);
        setMd5Hash(data.md5);

        // Generate deeplink
        const { data: dlData } = await supabase.functions.invoke("bakong-khqr", {
          body: {
            action: "generate_deeplink",
            qr_data: data.qr,
            callback: "https://Hinarat.lovable.app/support",
            app_icon_url: "https://kirashopdav.lovable.app/images/logo.png",
            app_name: "NARAT CHHEAK",
          },
        });
        if (dlData?.deeplink) setDeeplink(dlData.deeplink);
      }
    } catch (err) {
      console.error("QR generation error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial QR generation (static, no amount)
  useEffect(() => {
    generateQR();
  }, [generateQR]);

  // Regenerate when amount changes
  useEffect(() => {
    if (selectedAmount !== null) {
      generateQR(selectedAmount);
    }
  }, [selectedAmount, generateQR]);

  const checkPayment = useCallback(async () => {
    if (!md5Hash) return;
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("bakong-khqr", {
        body: { action: "check_payment", md5: md5Hash },
      });
      if (error) throw error;
      const status = data?.responseMessage || "UNPAID";
      setPaymentStatus(status);
      if (status === "PAID" || status === "SUCCESS") {
        toast.success(lang === "km" ? "ការទូទាត់ជោគជ័យ! សូមអរគុណ! 🙏❤️" : "Payment successful! Thank you! 🙏❤️");
      }
    } catch (err) {
      console.error("Payment check error:", err);
    } finally {
      setChecking(false);
    }
  }, [md5Hash, lang]);

  // Auto-poll payment status
  useEffect(() => {
    if (!md5Hash || paymentStatus === "PAID" || paymentStatus === "SUCCESS") return;
    const interval = setInterval(checkPayment, 8000);
    return () => clearInterval(interval);
  }, [md5Hash, paymentStatus, checkPayment]);

  const copyAccount = () => {
    navigator.clipboard.writeText(BAKONG_ACCOUNT);
    setCopied(true);
    toast.success(lang === "km" ? "បានចម្លងគណនី Bakong!" : "Bakong account copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openBakong = () => {
    if (deeplink) {
      window.open(deeplink, "_blank");
    } else {
      window.open("https://bakong.nbc.gov.kh/", "_blank");
    }
  };

  const isPaid = paymentStatus === "PAID" || paymentStatus === "SUCCESS";
  const qrImageUrl = qrData
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=300x300&color=1a1a2e&bgcolor=ffffff`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-lg py-6 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Hero */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="mx-auto w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20"
            >
              <img src={naratAvatar} alt="Hinarat" className="w-full h-full object-cover" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              {lang === "km" ? "គាំទ្រ Hinarat" : "Support Hinarat"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "km"
                ? "សូមអរគុណដែលប្រើ Hinarat! ការគាំទ្ររបស់អ្នកជួយយើងបន្តអភិវឌ្ឍឧបករណ៍ឥតគិតថ្លៃ 🙏"
                : "Thank you for using Hinarat! Your support helps us keep building free tools 🙏"}
            </p>
          </div>

          {/* Payment Success */}
          {isPaid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border-2 border-green-500/30 bg-green-500/10 p-5 text-center space-y-2"
            >
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
              <h2 className="text-lg font-bold text-green-600">
                {lang === "km" ? "ការទូទាត់ជោគជ័យ!" : "Payment Successful!"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {lang === "km" ? "សូមអរគុណច្រើនសម្រាប់ការគាំទ្រ! ❤️🙏" : "Thank you for your support! ❤️🙏"}
              </p>
            </motion.div>
          )}

          {/* KHQR Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border-2 border-primary/20 bg-card p-5 space-y-4"
          >
            {/* Bakong Header */}
            <div className="flex items-center gap-2 justify-center">
              <motion.img
                src={bakongIcon}
                alt="Bakong"
                className="h-8 w-8 object-contain"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <span className="text-sm font-bold">BAKONG KHQR</span>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <motion.div
                className="bg-white p-3 rounded-xl shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.3 }}
              >
                {loading ? (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : qrImageUrl ? (
                  <img src={qrImageUrl} alt="Bakong KHQR" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-muted-foreground text-xs">
                    QR unavailable
                  </div>
                )}
              </motion.div>
            </div>

            {/* Scan instruction */}
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {lang === "km" ? "ស្កេន QR ជាមួយ Bakong App" : "Scan QR with Bakong App"}
              </span>
              {checking && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
            </div>

            {/* Payment Status */}
            {md5Hash && !isPaid && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  {lang === "km" ? "កំពុងរង់ចាំការទូទាត់..." : "Waiting for payment..."}
                </span>
                <Button size="sm" variant="ghost" onClick={checkPayment} disabled={checking} className="h-6 px-2">
                  <RefreshCw className={`h-3 w-3 ${checking ? "animate-spin" : ""}`} />
                </Button>
              </motion.div>
            )}

            {/* Account Info */}
            <div className="rounded-xl bg-muted p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{lang === "km" ? "គណនី Bakong" : "Bakong Account"}</p>
                  <p className="font-mono text-sm font-bold">{BAKONG_ACCOUNT}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={copyAccount} className="gap-1">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{lang === "km" ? "ឈ្មោះអ្នកទទួល" : "Recipient"}</p>
                <p className="text-sm font-bold">{MERCHANT_NAME}</p>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-center">
                {lang === "km" ? "ជ្រើសរើសចំនួន" : "Choose amount"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {amounts.map((amt, i) => (
                  <motion.button
                    key={amt.usd}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAmount(selectedAmount === amt.usd ? null : amt.usd)}
                    className={`rounded-xl border-2 p-3 text-center transition-all ${
                      selectedAmount === amt.usd
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xl">{amt.label}</span>
                    <p className="text-sm font-bold font-english">${amt.usd}</p>
                    <p className="text-[10px] text-muted-foreground font-english">{amt.khr.toLocaleString()}៛</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Open Bakong Button */}
            <Button onClick={openBakong} className="w-full gap-2" size="lg">
              <img src={bakongIcon} alt="" className="h-5 w-5 object-contain" />
              {lang === "km" ? "បើក Bakong App" : "Open Bakong App"}
              {deeplink && <ExternalLink className="h-3 w-3" />}
            </Button>
          </motion.div>

          {/* How to Use */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border bg-card p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold">{lang === "km" ? "របៀបបង់ប្រាក់" : "How to Pay"}</h3>
            </div>
            <ol className="space-y-2 text-xs text-muted-foreground">
              {(lang === "km" ? [
                "បើក Bakong App នៅលើទូរស័ព្ទរបស់អ្នក",
                "ចុច 'Scan QR' ហើយស្កេន QR Code ខាងលើ",
                "បញ្ចូលចំនួនទឹកប្រាក់ដែលអ្នកចង់គាំទ្រ",
                "បញ្ជាក់ការទូទាត់ ✅",
                "ប្រព័ន្ធនឹងផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិ!"
              ] : [
                "Open Bakong App on your phone",
                "Tap 'Scan QR' and scan the QR code above",
                "Enter the amount you want to support",
                "Confirm the payment ✅",
                "System will auto-verify!"
              ]).map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Thank You */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border bg-card p-4 text-center space-y-2"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Heart className="h-6 w-6 text-destructive mx-auto" />
            </motion.div>
            <h3 className="font-bold">{lang === "km" ? "សូមអរគុណ! 🙏" : "Thank You! 🙏"}</h3>
            <p className="text-xs text-muted-foreground">
              {lang === "km"
                ? "រាល់ការគាំទ្រគឺជួយឱ្យ Hinarat រក្សា 100+ ឧបករណ៍ឥតគិតថ្លៃសម្រាប់មនុស្សគ្រប់គ្នា ❤️"
                : "Every contribution helps Hinarat maintain 100+ free tools for everyone ❤️"}
            </p>
          </motion.div>

          {/* Contact Telegram */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>
              <a href="https://t.me/Naratkh168" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                📱 Telegram: @Naratkh168
              </a>
            </p>
            <p>© 2026 Hinarat - {lang === "km" ? "ឧបករណ៍ឥតគិតថ្លៃសម្រាប់អ្នកគ្រប់គ្នា" : "Free tools for everyone"}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
