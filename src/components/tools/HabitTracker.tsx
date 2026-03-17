import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, Check, X } from "lucide-react";

interface Habit { name: string; days: boolean[] }

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const s = localStorage.getItem("dt-habits");
    return s ? JSON.parse(s) : [{ name: "Exercise 🏃", days: Array(7).fill(false) }, { name: "Read 📖", days: Array(7).fill(false) }];
  });
  const [input, setInput] = useState("");

  useEffect(() => { localStorage.setItem("dt-habits", JSON.stringify(habits)); }, [habits]);

  const add = () => { if (input.trim()) { setHabits([...habits, { name: input.trim(), days: Array(7).fill(false) }]); setInput(""); } };
  const toggle = (hi: number, di: number) => {
    const next = [...habits];
    next[hi] = { ...next[hi], days: [...next[hi].days] };
    next[hi].days[di] = !next[hi].days[di];
    setHabits(next);
  };
  const remove = (i: number) => setHabits(habits.filter((_, j) => j !== i));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="New habit..." onKeyDown={(e) => e.key === "Enter" && add()} />
        <Button onClick={add} size="icon"><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="text-left p-2">Habit</th>{DAYS.map(d => <th key={d} className="p-2 text-center text-xs">{d}</th>)}<th></th></tr></thead>
          <tbody>
            {habits.map((h, hi) => (
              <motion.tr key={hi} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: hi * 0.05 }} className="border-t">
                <td className="p-2 font-medium">{h.name}</td>
                {h.days.map((done, di) => (
                  <td key={di} className="p-2 text-center">
                    <motion.button whileTap={{ scale: 0.7 }} onClick={() => toggle(hi, di)}
                      className={`h-8 w-8 rounded-lg border-2 transition-colors ${done ? "border-green-500 bg-green-500 text-white" : "border-border hover:border-primary"}`}>
                      {done && <Check className="h-4 w-4 mx-auto" />}
                    </motion.button>
                  </td>
                ))}
                <td><button onClick={() => remove(hi)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTracker;
