import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DateDiff: React.FC = () => {
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [result, setResult] = useState<{ days: number; weeks: number; months: number; hours: number } | null>(null);

  const calc = () => {
    if (!d1 || !d2) return;
    const a = new Date(d1), b = new Date(d2);
    const diff = Math.abs(b.getTime() - a.getTime());
    const days = Math.floor(diff / 86400000);
    setResult({ days, weeks: Math.floor(days / 7), months: Math.floor(days / 30.44), hours: days * 24 });
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-sm font-medium">Start Date</label><Input type="date" value={d1} onChange={(e) => setD1(e.target.value)} /></div>
        <div><label className="mb-1 block text-sm font-medium">End Date</label><Input type="date" value={d2} onChange={(e) => setD2(e.target.value)} /></div>
      </motion.div>
      <Button onClick={calc} className="w-full">Calculate Difference</Button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          {[
            { v: result.days, l: "Days", e: "📅" },
            { v: result.weeks, l: "Weeks", e: "📆" },
            { v: result.months, l: "Months", e: "🗓️" },
            { v: result.hours.toLocaleString(), l: "Hours", e: "⏰" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="rounded-xl border bg-card p-3 text-center">
              <span className="text-2xl">{item.e}</span>
              <p className="text-xl font-bold font-english">{item.v}</p>
              <p className="text-xs text-muted-foreground">{item.l}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DateDiff;
