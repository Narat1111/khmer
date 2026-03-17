import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) setBmi(Math.round((w / (h * h)) * 10) / 10);
  };

  const getCategory = (b: number) => {
    if (b < 18.5) return { label: "Underweight", color: "text-blue-500", emoji: "🔵" };
    if (b < 25) return { label: "Normal", color: "text-green-500", emoji: "🟢" };
    if (b < 30) return { label: "Overweight", color: "text-yellow-500", emoji: "🟡" };
    return { label: "Obese", color: "text-destructive", emoji: "🔴" };
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Weight (kg)</label>
          <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Height (cm)</label>
          <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" />
        </div>
      </motion.div>
      <Button onClick={calculate} className="w-full">Calculate BMI</Button>
      {bmi !== null && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border bg-card p-6 text-center">
          <p className="text-5xl font-bold font-english">{bmi}</p>
          <p className={`mt-2 text-lg font-bold ${getCategory(bmi).color}`}>
            {getCategory(bmi).emoji} {getCategory(bmi).label}
          </p>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${bmi < 18.5 ? "bg-blue-500" : bmi < 25 ? "bg-green-500" : bmi < 30 ? "bg-yellow-500" : "bg-destructive"}`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BMICalculator;
