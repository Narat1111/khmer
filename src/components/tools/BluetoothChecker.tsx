import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Bluetooth, Loader2, CheckCircle, XCircle, Smartphone, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BluetoothDevice {
  name: string;
  id: string;
}

const BluetoothChecker: React.FC = () => {
  const { t } = useI18n();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [error, setError] = useState("");

  const isWebBluetoothSupported = () => {
    return typeof navigator !== "undefined" && "bluetooth" in navigator;
  };

  const checkBluetooth = async () => {
    setError("");

    if (!isWebBluetoothSupported()) {
      setSupported(false);
      setError(
        "Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera on desktop/Android. iOS Safari does not support Web Bluetooth."
      );
      return;
    }

    // Check if running in secure context
    if (!window.isSecureContext) {
      setSupported(false);
      setError("Bluetooth requires a secure (HTTPS) connection.");
      return;
    }

    setSupported(true);
    setScanning(true);

    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service", "device_information"],
      });
      
      const newDevice = {
        name: device.name || "Unknown Device",
        id: device.id,
      };
      
      setDevices((prev) => {
        // Avoid duplicates
        if (prev.find(d => d.id === newDevice.id)) return prev;
        return [...prev, newDevice];
      });
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        // User cancelled the picker - not an error
      } else if (err.name === "SecurityError") {
        setError("Bluetooth access was blocked. This feature requires HTTPS and user gesture.");
      } else {
        setError(err.message || "Failed to scan for devices");
      }
    } finally {
      setScanning(false);
    }
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
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0 0 hsl(var(--primary) / 0.2)",
              "0 0 0 12px hsl(var(--primary) / 0)",
              "0 0 0 0 hsl(var(--primary) / 0.2)",
            ] 
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          <Bluetooth className="h-10 w-10 text-primary" />
        </motion.div>

        <Button onClick={checkBluetooth} disabled={scanning} size="lg" className="gap-2">
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Bluetooth className="h-4 w-4" />
              Scan for Bluetooth Devices
            </>
          )}
        </Button>

        {!isWebBluetoothSupported() && supported === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 rounded-xl bg-yellow-500/10 p-3 text-sm text-yellow-600 dark:text-yellow-400"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Web Bluetooth may not be supported on your browser/device. Try Chrome on Android or desktop.</span>
          </motion.div>
        )}
      </motion.div>

      {supported !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-3 rounded-xl p-4 ${
            supported ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-destructive/10 text-destructive"
          }`}
        >
          {supported ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">
            {supported ? "Bluetooth is supported ✓" : "Bluetooth is not supported ✗"}
          </span>
        </motion.div>
      )}

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {devices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            <h3 className="text-sm font-bold">Found Devices ({devices.length}):</h3>
            {devices.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <Smartphone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.id}</p>
                </div>
              </motion.div>
            ))}
            <Button onClick={checkBluetooth} variant="outline" className="w-full gap-2 mt-2">
              <Bluetooth className="h-4 w-4" />
              Scan More Devices
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BluetoothChecker;
