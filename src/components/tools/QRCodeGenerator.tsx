import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Camera, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QRCodeGenerator: React.FC = () => {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [tab, setTab] = useState("generate");
  const [scanResult, setScanResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [isBakong, setIsBakong] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

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
    } catch {
      window.open(qrUrl, "_blank");
    }
  };

  const startScan = async () => {
    setScanResult("");
    setIsBakong(false);
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      // Use BarcodeDetector API if available
      if ("BarcodeDetector" in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        intervalRef.current = window.setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const value = barcodes[0].rawValue;
              handleScanResult(value);
            }
          } catch {}
        }, 300);
      } else {
        // Fallback: use canvas + external API
        intervalRef.current = window.setInterval(async () => {
          if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) return;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          try {
            const res = await fetch(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(dataUrl)}`);
            const json = await res.json();
            const value = json?.[0]?.symbol?.[0]?.data;
            if (value) handleScanResult(value);
          } catch {}
        }, 1000);
      }
    } catch {
      setScanResult("Camera access denied. Please allow camera permission.");
      setScanning(false);
    }
  };

  const handleScanResult = (value: string) => {
    setScanResult(value);
    // Detect Bakong QR
    const isBakongQR = value.includes("bakong") || value.includes("nbc.org.kh") || value.startsWith("0002") || value.includes("KHQR");
    setIsBakong(isBakongQR);
    stopScan();
  };

  const stopScan = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => stopScan();
  }, []);

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
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
                </div>
                <canvas ref={canvasRef} className="hidden" />
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
                  <div className="flex items-center gap-2 rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                    <span className="text-lg">🏦</span>
                    <span className="text-sm font-bold">Bakong / KHQR Payment Detected</span>
                  </div>
                )}
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">Scan Result:</p>
                  <p className="text-sm font-medium break-all">{scanResult}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => navigator.clipboard.writeText(scanResult)}
                  >
                    📋 Copy
                  </Button>
                  {scanResult.startsWith("http") && (
                    <a href={scanResult} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button className="w-full gap-2">🔗 Open Link</Button>
                    </a>
                  )}
                  <Button
                    variant="secondary"
                    className="flex-1 gap-2"
                    onClick={() => { setScanResult(""); setIsBakong(false); startScan(); }}
                  >
                    🔄 Scan Again
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
