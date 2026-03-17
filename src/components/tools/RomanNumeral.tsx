import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const toRoman = (n: number): string => {
  if (n <= 0 || n > 3999) return "N/A";
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let r = "";
  vals.forEach((v, i) => { while (n >= v) { r += syms[i]; n -= v; } });
  return r;
};

const fromRoman = (s: string): number => {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let r = 0;
  for (let i = 0; i < s.length; i++) {
    const c = map[s[i].toUpperCase()] || 0;
    const n = map[s[i + 1]?.toUpperCase()] || 0;
    r += c < n ? -c : c;
  }
  return r;
};

const RomanNumeral: React.FC = () => {
  const [num, setNum] = useState("2024");
  const [roman, setRoman] = useState("MMXXIV");

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Number</label>
          <Input type="number" value={num} onChange={(e) => { setNum(e.target.value); setRoman(toRoman(parseInt(e.target.value) || 0)); }} placeholder="2024" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Roman</label>
          <Input value={roman} onChange={(e) => { setRoman(e.target.value); setNum(String(fromRoman(e.target.value))); }} placeholder="MMXXIV" className="font-mono" />
        </div>
      </motion.div>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="rounded-2xl border bg-card p-6 text-center">
        <p className="text-4xl font-bold font-english">{toRoman(parseInt(num) || 0)}</p>
        <p className="mt-2 text-muted-foreground">= {parseInt(num) || 0}</p>
      </motion.div>
    </div>
  );
};

export default RomanNumeral;
