import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface IPData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const IPLocation: React.FC = () => {
  const { t } = useI18n();
  const [data, setData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchIP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("Failed to fetch IP info");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to get IP location");
    } finally {
      setLoading(false);
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
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          <Globe className="h-10 w-10 text-primary" />
        </motion.div>

        <Button onClick={fetchIP} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Detect My IP & Location
            </>
          )}
        </Button>
      </motion.div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-destructive">
          {error}
        </motion.p>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="rounded-xl border bg-primary/5 p-4 text-center"
          >
            <Shield className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-2xl font-bold font-english tabular-nums">{data.ip}</p>
            <p className="text-xs text-muted-foreground">Your Public IP Address</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "City", value: data.city, icon: "🏙️" },
              { label: "Region", value: data.region, icon: "📍" },
              { label: "Country", value: data.country_name, icon: "🌍" },
              { label: "ISP", value: data.org, icon: "🔌" },
              { label: "Timezone", value: data.timezone, icon: "🕐" },
              { label: "Coordinates", value: `${data.latitude?.toFixed(2)}, ${data.longitude?.toFixed(2)}`, icon: "📐" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border bg-card p-3"
              >
                <span className="text-lg">{item.icon}</span>
                <p className="mt-1 text-sm font-bold leading-tight">{item.value || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IPLocation;
