import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

interface Expense { id: string; name: string; amount: number; category: string; date: string; }

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");

  const add = () => {
    if (!name.trim() || !amount) return;
    setExpenses([...expenses, { id: Date.now().toString(), name, amount: +amount, category, date: new Date().toLocaleDateString() }]);
    setName(""); setAmount("");
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>);

  const cats = ["food", "transport", "entertainment", "shopping", "bills", "other"];
  const catEmoji: Record<string, string> = { food: "🍔", transport: "🚗", entertainment: "🎬", shopping: "🛍️", bills: "💡", other: "📦" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="rounded-xl border bg-card p-4 text-center">
        <p className="text-xs text-muted-foreground">Total Expenses</p>
        <p className="text-2xl font-bold text-primary">${total.toFixed(2)}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Expense name" className="flex-1 min-w-[120px]" />
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$0" className="w-20" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border bg-background px-2 py-1 text-xs">
          {cats.map((c) => <option key={c} value={c}>{catEmoji[c]} {c}</option>)}
        </select>
        <Button onClick={add} size="sm"><Plus className="h-4 w-4" /></Button>
      </div>
      {Object.keys(byCategory).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <span key={cat} className="rounded-full bg-muted px-2 py-1 text-xs">{catEmoji[cat]} {cat}: ${amt.toFixed(2)}</span>
          ))}
        </div>
      )}
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {expenses.map((e) => (
          <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 rounded-lg border bg-card p-2 text-xs">
            <span>{catEmoji[e.category]}</span>
            <span className="flex-1 font-medium">{e.name}</span>
            <span className="font-bold">${e.amount.toFixed(2)}</span>
            <button onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))} className="text-destructive"><Trash2 className="h-3 w-3" /></button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExpenseTracker;
