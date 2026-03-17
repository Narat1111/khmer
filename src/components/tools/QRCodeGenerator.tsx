import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Camera, ScanLine, Copy, ExternalLink, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsQR from "jsqr";
import { toast } from "sonner";

const QRCodeGenerator: React.FC = () => {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [tab, setTab] = useState("generate");
  const [scanResult, setScanResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [isBakong, setIsBakong] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const qrUrl = text.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=300x300`
    : null;

  const downloadQR = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("QR Code saved!");
    } catch {
      window.open(qrUrl, "_blank");
    }
  };

  const handleScanResult = useCallback((value: string) => {
    setScanResult(value);
    const isBakongQR = value.includes("bakong") || value.includes("nbc.org.kh") || value.startsWith("0002") || value.includes("KHQR");
    setIsBakong(isBakongQR);
    stopScan();

    // Auto-copy
    navigator.clipboard.writeText(value).then(() => {
      toast.success("📋 Copied to clipboard!");
    }).catch(() => {});

    // Auto-open if URL
    if (value.startsWith("http://") || value.startsWith("https://")) {
      setTimeout(() => {
        window.open(value, "_blank");
        toast.info("🔗 Opening link...");
      }, 800);
    }
  }, []);

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

    if (code && code.data) {
      handleScanResult(code.data);
      return;
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [handleScanResult]);

  const startScan = async () => {
    setScanResult("");
    setIsBakong(false);
    setCopied(false);
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      // Start scanning frames with jsQR
      animFrameRef.current = requestAnimationFrame(scanFrame);
    } catch {
      setScanResult("Camera access denied. Please allow camera permission.");
      setScanning(false);
      toast.error("Camera access denied");
    }
  };

  const stopScan = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const copyResult = async () => {
    await navigator.clipboard.writeText(scanResult);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => stopScan();
  }, []);

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => { setTab(v); if (v !== "scan") stopScan(); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" className="gap-2">
            <QrCode className="h-4 w-4" /> Generate
          </TabsTrigger>
          <TabsTrigger value="scan" className="gap-2">
            <Camera className="h-4 w-4" /> Scan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4 mt-4">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="វាយអត្ថបទ ឬតំណរភ្ជាប់..."
          />
          <AnimatePresence>
            {qrUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="rounded-xl border bg-background p-4 shadow-sm">
                  <img src={qrUrl} alt="QR Code" className="h-48 w-48" />
                </div>
                <Button onClick={downloadQR} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  {t.download} QR Code
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4 mt-4">
          <div className="flex flex-col items-center gap-4">
            {!scanning && !scanResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                >
                  <ScanLine className="h-10 w-10 text-primary" />
                </motion.div>
                <p className="text-sm text-muted-foreground text-center">
                  Auto-scan • Auto-copy • Auto-open links
                </p>
                <Button onClick={startScan} size="lg" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Open Camera & Scan QR
                </Button>
              </motion.div>
            )}

            {scanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-3">
                <div className="relative overflow-hidden rounded-xl border">
                  <video ref={videoRef} className="w-full" autoPlay playsInline muted />
                  <motion.div
                    className="absolute left-4 right-4 h-0.5 bg-primary"
                    animate={{ top: ["20%", "80%", "20%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                  {/* Corner markers */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <p className="text-xs text-muted-foreground text-center animate-pulse">
                  🔍 Scanning for QR code...
                </p>
                <Button onClick={stopScan} variant="destructive" className="w-full">
                  Stop Scanning
                </Button>
              </motion.div>
            )}

            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-3"
              >
                {isBakong && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400"
                  >
                    <span className="text-lg">🏦</span>
                    <span className="text-sm font-bold">Bakong / KHQR Payment Detected</span>
                  </motion.div>
                )}

                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">✅ Scan Result (auto-copied):</p>
                  <p className="text-sm font-medium break-all">{scanResult}</p>
                  {scanResult.startsWith("http") && (
                    <p className="text-xs text-primary mt-1">🔗 Link auto-opened in new tab</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={copyResult}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  {scanResult.startsWith("http") && (
                    <a href={scanResult} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button className="w-full gap-2">
                        <ExternalLink className="h-4 w-4" /> Open Link
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="secondary"
                    className="flex-1 gap-2"
                    onClick={() => { setScanResult(""); setIsBakong(false); startScan(); }}
                  >
                    <RotateCcw className="h-4 w-4" /> Scan Again
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRCodeGenerator;
