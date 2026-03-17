import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const TemperatureConverter: React.FC = () => {
  const [celsius, setCelsius] = useState("37");
  const c = parseFloat(celsius) || 0;
  const f = (c * 9) / 5 + 32;
  const k = c + 273.15;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Celsius (°C)</label>
        <Input type="number" value={celsius} onChange={(e) => setCelsius(e.target.value)} placeholder="37" />
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "°C", value: c.toFixed(1), emoji: "🌡️", bg: "from-blue-500 to-blue-600" },
          { label: "°F", value: f.toFixed(1), emoji: "🔥", bg: "from-orange-500 to-red-500" },
          { label: "K", value: k.toFixed(1), emoji: "❄️", bg: "from-purple-500 to-indigo-500" },
        ].map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
            className={`rounded-2xl bg-gradient-to-br ${t.bg} p-4 text-center text-white`}>
            <span className="text-2xl">{t.emoji}</span>
            <p className="mt-1 text-2xl font-bold font-english">{t.value}</p>
            <p className="text-xs opacity-80">{t.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureConverter;
