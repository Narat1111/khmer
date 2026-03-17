import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wifi, Download as DownloadIcon, Upload } from "lucide-react";

const SpeedTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [download, setDownload] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const runTest = async () => {
    setTesting(true); setDownload(null); setLatency(null); setProgress(0);

    // Latency test
    const start1 = performance.now();
    try { await fetch("https://httpbin.org/get", { cache: "no-store" }); } catch {}
    const lat = Math.round(performance.now() - start1);
    setLatency(lat); setProgress(30);

    // Download speed test (download a known file)
    const testUrl = "https://speed.cloudflare.com/__down?bytes=1000000";
    const start2 = performance.now();
    try {
      const res = await fetch(testUrl, { cache: "no-store" });
      const blob = await res.blob();
      const elapsed = (performance.now() - start2) / 1000;
      const mbps = ((blob.size * 8) / (1000000 * elapsed));
      setDownload(Math.round(mbps * 10) / 10);
    } catch {
      setDownload(-1);
    }
    setProgress(100);
    setTesting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={testing ? { rotate: 360 } : {}}
          transition={testing ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
        >
          <Wifi className="h-12 w-12 text-primary" />
        </motion.div>
        <Button onClick={runTest} disabled={testing} size="lg" className="gap-2">
          {testing ? "Testing..." : "Start Speed Test"}
        </Button>
        {testing && (
          <div className="w-48 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {(download !== null || latency !== null) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4 text-center">
            <DownloadIcon className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{download === -1 ? "N/A" : download ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Mbps Download</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <Upload className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{latency ?? "—"}</p>
            <p className="text-xs text-muted-foreground">ms Latency</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SpeedTest;
