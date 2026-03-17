import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const BinaryConverter: React.FC = () => {
  const [dec, setDec] = useState("255");

  const num = parseInt(dec) || 0;
  const results = [
    { label: "Decimal", value: num.toString(), emoji: "🔢" },
    { label: "Binary", value: num.toString(2), emoji: "💻" },
    { label: "Hexadecimal", value: "0x" + num.toString(16).toUpperCase(), emoji: "🔤" },
    { label: "Octal", value: "0o" + num.toString(8), emoji: "8️⃣" },
  ];

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Enter a number</label>
        <Input type="number" value={dec} onChange={(e) => setDec(e.target.value)} placeholder="255" />
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {results.map((r, i) => (
          <motion.div key={r.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl border bg-card p-3 text-center cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigator.clipboard.writeText(r.value)}>
            <span className="text-xl">{r.emoji}</span>
            <p className="mt-1 font-bold font-mono text-sm break-all">{r.value}</p>
            <p className="text-xs text-muted-foreground">{r.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BinaryConverter;
