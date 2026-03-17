import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Bluetooth, Loader2, CheckCircle, XCircle } from "lucide-react";
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

  const checkBluetooth = async () => {
    setError("");
    setDevices([]);

    if (!("bluetooth" in navigator)) {
      setSupported(false);
      setError("Web Bluetooth API is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    setSupported(true);
    setScanning(true);

    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      setDevices((prev) => [
        ...prev,
        { name: device.name || "Unknown Device", id: device.id },
      ]);
    } catch (err: any) {
      if (err.name !== "NotFoundError") {
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
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          <Bluetooth className="h-10 w-10 text-primary" />
        </motion.div>

        <Button onClick={checkBluetooth} disabled={scanning} size="lg">
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            "Scan for Bluetooth Devices"
          )}
        </Button>
      </motion.div>

      {supported !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-3 rounded-xl p-4 ${
            supported ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
          }`}
        >
          {supported ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">
            {supported ? "Bluetooth is supported ✓" : "Bluetooth is not supported ✗"}
          </span>
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive"
        >
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
            <h3 className="text-sm font-bold">Found Devices:</h3>
            {devices.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <Bluetooth className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.id}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BluetoothChecker;
