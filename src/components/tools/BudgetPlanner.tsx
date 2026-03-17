import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, Trash2, DollarSign } from "lucide-react";

interface Item { name: string; amount: number; type: "income" | "expense"; }

const BudgetPlanner: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { name: "Salary", amount: 2000, type: "income" },
    { name: "Rent", amount: 500, type: "expense" },
    { name: "Food", amount: 200, type: "expense" },
  ]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const add = () => {
    if (!name.trim() || !amount) return;
    setItems([...items, { name, amount: parseFloat(amount), type }]);
    setName("");
    setAmount("");
  };

  const totalIncome = items.filter((i) => i.type === "income").reduce((s, i) => s + i.amount, 0);
  const totalExpense = items.filter((i) => i.type === "expense").reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Income", value: totalIncome, color: "text-green-500" },
          { label: "Expense", value: totalExpense, color: "text-red-500" },
          { label: "Balance", value: balance, color: balance >= 0 ? "text-green-500" : "text-red-500" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-lg font-bold font-english tabular-nums ${s.color}`}>${s.value.toFixed(2)}</p>
          </motion.div>
        ))}
      </div>

      {/* Add item */}
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" className="flex-1" />
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$" type="number" className="w-24" />
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded-lg border bg-card px-2 text-sm">
          <option value="income">+</option>
          <option value="expense">−</option>
        </select>
        <Button onClick={add} size="icon"><Plus className="h-4 w-4" /></Button>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${item.type === "income" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-english text-sm font-bold tabular-nums ${item.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {item.type === "income" ? "+" : "−"}${item.amount.toFixed(2)}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BudgetPlanner;