import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const TIPS = [10, 15, 18, 20, 25];

const TipCalculator: React.FC = () => {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState("1");

  const billNum = parseFloat(bill) || 0;
  const peopleNum = Math.max(1, parseInt(people) || 1);
  const tipAmount = billNum * (tip / 100);
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Bill Amount ($)</label>
        <Input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00" />
      </motion.div>
      <div>
        <label className="mb-2 block text-sm font-medium">Tip: {tip}%</label>
        <div className="flex gap-2">
          {TIPS.map((t) => (
            <motion.button key={t} whileTap={{ scale: 0.9 }} onClick={() => setTip(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-bold transition-colors ${tip === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
            >{t}%</motion.button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Split between</label>
        <Input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
      </div>
      {billNum > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          {[
            { label: "Tip Amount", value: `$${tipAmount.toFixed(2)}`, emoji: "💰" },
            { label: "Total", value: `$${total.toFixed(2)}`, emoji: "🧾" },
            { label: "Per Person", value: `$${perPerson.toFixed(2)}`, emoji: "👤" },
            { label: "Tip/Person", value: `$${(tipAmount / peopleNum).toFixed(2)}`, emoji: "🎁" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl border bg-card p-3 text-center">
              <span className="text-xl">{item.emoji}</span>
              <p className="mt-1 text-lg font-bold font-english">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TipCalculator;
