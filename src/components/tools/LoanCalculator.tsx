import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("30");
  const [result, setResult] = useState<{ monthly: number; totalPayment: number; totalInterest: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(years) * 12;
    if (p <= 0 || r <= 0 || n <= 0) return;
    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    setResult({ monthly, totalPayment, totalInterest: totalPayment - p });
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        <div><label className="mb-1 block text-sm font-medium">Loan Amount ($)</label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="mb-1 block text-sm font-medium">Interest Rate (%)</label><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></div>
          <div><label className="mb-1 block text-sm font-medium">Years</label><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></div>
        </div>
      </motion.div>
      <Button onClick={calculate} className="w-full">Calculate</Button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-2xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-3xl font-bold font-english text-primary">${result.monthly.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-lg font-bold font-english">${result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-muted-foreground">Total Payment</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-lg font-bold font-english">${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-muted-foreground">Total Interest</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoanCalculator;
