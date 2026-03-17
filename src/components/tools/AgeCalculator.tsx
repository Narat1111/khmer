import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number; nextBday: number } | null>(null);

  const calculate = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
    setResult({ years, months, days, totalDays, nextBday: daysUntil });
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Date of Birth</label>
        <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      </motion.div>
      <Button onClick={calculate} className="w-full">Calculate Age</Button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          {[
            { label: "Years", value: result.years, emoji: "🎂" },
            { label: "Months", value: result.months, emoji: "📅" },
            { label: "Days", value: result.days, emoji: "☀️" },
            { label: "Total Days", value: result.totalDays.toLocaleString(), emoji: "📊" },
            { label: "Next Birthday", value: `${result.nextBday} days`, emoji: "🎉" },
            { label: "Hours Lived", value: (result.totalDays * 24).toLocaleString(), emoji: "⏰" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="rounded-xl border bg-card p-3 text-center">
              <span className="text-2xl">{item.emoji}</span>
              <p className="mt-1 text-lg font-bold font-english">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AgeCalculator;
