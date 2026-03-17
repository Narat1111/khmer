import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Heart, Copy, Check, ExternalLink, QrCode, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import daraAvatar from "@/assets/dara-avatar.png";

// Pre-generated KHQR string from Bakong
const KHQR_DATA = "00020101021229170013dara_mao@bkrt520459995802KH5915Daratool_support6010Phnom Penh991700131771164836867630440B5";
const BAKONG_ACCOUNT = "dara_mao@bkrt";
const MERCHANT_NAME = "Daratool Support";

const SupportPage = () => {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const amounts = [
    { usd: 1, khr: 4100, label: "☕" },
    { usd: 2, khr: 8200, label: "🍜" },
    { usd: 5, khr: 20500, label: "💪" },
    { usd: 10, khr: 41000, label: "🌟" },
    { usd: 20, khr: 82000, label: "🚀" },
    { usd: 50, khr: 205000, label: "👑" },
  ];

  const generateQrUrl = (amount?: number) => {
    // Generate QR with amount embedded
    const qrData = amount 
      ? `${KHQR_DATA}5403${amount.toFixed(2)}` 
      : KHQR_DATA;
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=300x300&color=1a1a2e&bgcolor=ffffff`;
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(BAKONG_ACCOUNT);
    setCopied(true);
    toast.success(lang === "km" ? "បានចម្លងគណនី Bakong!" : "Bakong account copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openBakong = () => {
    // Try to open Bakong app via deep link
    window.open(`https://bakong.nbc.gov.kh/`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-lg py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="mx-auto w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20"
            >
              <img src={daraAvatar} alt="DaraTool" className="w-full h-full object-cover" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              {lang === "km" ? "គាំទ្រ DaraTool" : "Support DaraTool"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "km" 
                ? "សូមអរគុណដែលប្រើ DaraTool! ការគាំទ្ររបស់អ្នកជួយយើងបន្តអភិវឌ្ឍឧបករណ៍ឥតគិតថ្លៃ 🙏" 
                : "Thank you for using DaraTool! Your support helps us keep building free tools 🙏"}
            </p>
          </div>

          {/* KHQR Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border-2 border-primary/20 bg-card p-5 space-y-4"
          >
            <div className="flex items-center gap-2 justify-center">
              <div className="bg-[#E31837] text-white text-xs font-bold px-2 py-1 rounded-md">
                BAKONG
              </div>
              <span className="text-sm font-bold">KHQR</span>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <img
                  src={generateQrUrl(selectedAmount || undefined)}
                  alt="Bakong KHQR"
                  className="w-48 h-48"
                />
              </div>
            </div>

            {/* Scan instruction */}
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Smartphone className="h-3 w-3" />
              {lang === "km" 
                ? "ស្កេន QR ជាមួយ Bakong App" 
                : "Scan QR with Bakong App"}
            </p>

            {/* Account Info */}
            <div className="rounded-xl bg-muted p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "km" ? "គណនី Bakong" : "Bakong Account"}
                  </p>
                  <p className="font-mono text-sm font-bold">{BAKONG_ACCOUNT}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={copyAccount} className="gap-1">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {lang === "km" ? "ឈ្មោះអ្នកទទួល" : "Recipient"}
                </p>
                <p className="text-sm font-bold">{MERCHANT_NAME}</p>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-center">
                {lang === "km" ? "ជ្រើសរើសចំនួន" : "Choose amount"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {amounts.map((amt) => (
                  <motion.button
                    key={amt.usd}
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
              <ExternalLink className="h-4 w-4" />
              {lang === "km" ? "បើក Bakong App" : "Open Bakong App"}
            </Button>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border bg-card p-4 text-center space-y-2"
          >
            <Heart className="h-6 w-6 text-red-500 mx-auto" />
            <h3 className="font-bold">
              {lang === "km" ? "សូមអរគុណ! 🙏" : "Thank You! 🙏"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {lang === "km"
                ? "រាល់ការគាំទ្រគឺជួយឱ្យ DaraTool រក្សា 100+ ឧបករណ៍ឥតគិតថ្លៃសម្រាប់មនុស្សគ្រប់គ្នា។ យើងដឹងគុណយ៉ាងខ្លាំង! ❤️"
                : "Every contribution helps DaraTool maintain 100+ free tools for everyone. We truly appreciate it! ❤️"}
            </p>
          </motion.div>

          {/* Phone Number */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>📞 855 97 464 0130</p>
            <p>© 2025 DaraTool - {lang === "km" ? "ឧបករណ៍ឥតគិតថ្លៃសម្រាប់អ្នកគ្រប់គ្នា" : "Free tools for everyone"}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
