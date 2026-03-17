import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const PercentageCalc: React.FC = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const pOfV = a && b ? (parseFloat(a) / 100) * parseFloat(b) : null;
  const whatP = a && b ? (parseFloat(a) / parseFloat(b)) * 100 : null;
  const pChange = a && b && parseFloat(a) !== 0 ? ((parseFloat(b) - parseFloat(a)) / parseFloat(a)) * 100 : null;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Value A</label>
          <Input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="25" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Value B</label>
          <Input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="200" />
        </div>
      </motion.div>
      {a && b && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-3">
          {[
            { label: `${a}% of ${b}`, value: pOfV?.toFixed(2), emoji: "📊" },
            { label: `${a} is what % of ${b}`, value: whatP?.toFixed(2) + "%", emoji: "🔢" },
            { label: `% change ${a} → ${b}`, value: (pChange! >= 0 ? "+" : "") + pChange?.toFixed(2) + "%", emoji: pChange! >= 0 ? "📈" : "📉" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="rounded-xl border bg-card p-4 text-center">
              <span className="text-2xl">{item.emoji}</span>
              <p className="mt-1 text-xl font-bold font-english">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PercentageCalc;
