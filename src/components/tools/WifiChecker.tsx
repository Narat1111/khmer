import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Loader2, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface SpeedResult {
  downlink: number;
  rtt: number;
  effectiveType: string;
  online: boolean;
}

const WifiChecker: React.FC = () => {
  const { t } = useI18n();
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkWifi = async () => {
    setTesting(true);
    await new Promise((r) => setTimeout(r, 1500));

    const conn = (navigator as any).connection;
    setResult({
      online: navigator.onLine,
      downlink: conn?.downlink ?? 0,
      rtt: conn?.rtt ?? 0,
      effectiveType: conn?.effectiveType ?? "unknown",
    });
    setTesting(false);
  };

  const getSignalStrength = () => {
    if (!result) return 0;
    if (result.downlink >= 10) return 4;
    if (result.downlink >= 5) return 3;
    if (result.downlink >= 1) return 2;
    return 1;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: online
              ? ["0 0 0 0 rgba(34,197,94,0.2)", "0 0 0 20px rgba(34,197,94,0)", "0 0 0 0 rgba(34,197,94,0)"]
              : ["0 0 0 0 rgba(239,68,68,0.2)", "0 0 0 20px rgba(239,68,68,0)", "0 0 0 0 rgba(239,68,68,0)"],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`flex h-20 w-20 items-center justify-center rounded-full ${
            online ? "bg-green-500/10" : "bg-destructive/10"
          }`}
        >
          {online ? (
            <Wifi className="h-10 w-10 text-green-500" />
          ) : (
            <WifiOff className="h-10 w-10 text-destructive" />
          )}
        </motion.div>

        <p className={`text-sm font-bold ${online ? "text-green-500" : "text-destructive"}`}>
          {online ? "🟢 Connected" : "🔴 Disconnected"}
        </p>

        <Button onClick={checkWifi} disabled={testing} size="lg">
          {testing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Activity className="h-4 w-4" />
              Check WiFi Speed
            </>
          )}
        </Button>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: "Speed", value: `${result.downlink} Mbps`, icon: "⚡" },
            { label: "Latency", value: `${result.rtt} ms`, icon: "📡" },
            { label: "Type", value: result.effectiveType.toUpperCase(), icon: "📶" },
            { label: "Signal", value: `${"█".repeat(getSignalStrength())}${"░".repeat(4 - getSignalStrength())}`, icon: "📊" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-4 text-center"
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="mt-1 text-lg font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WifiChecker;
