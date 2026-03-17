import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, X, RotateCcw } from "lucide-react";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FF8C00", "#7B68EE"];

const LuckyWheel: React.FC = () => {
  const [items, setItems] = useState<string[]>(["Pizza 🍕", "Burger 🍔", "Sushi 🍣", "Pasta 🍝", "Salad 🥗", "Tacos 🌮"]);
  const [newItem, setNewItem] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState("");

  const spin = () => {
    if (items.length < 2 || spinning) return;
    setSpinning(true);
    setWinner("");
    const extra = 1440 + Math.random() * 1440;
    const newRot = rotation + extra;
    setRotation(newRot);
    setTimeout(() => {
      const angle = newRot % 360;
      const slice = 360 / items.length;
      const idx = Math.floor(((360 - angle + slice / 2) % 360) / slice) % items.length;
      setWinner(items[idx]);
      setSpinning(false);
    }, 4000);
  };

  const addItem = () => {
    if (newItem.trim() && items.length < 12) { setItems([...items, newItem.trim()]); setNewItem(""); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        {/* Pointer */}
        <div className="text-2xl">▼</div>
        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative h-64 w-64 rounded-full border-4 border-border shadow-elevated"
          style={{
            background: `conic-gradient(${items.map((_, i) => `${COLORS[i % COLORS.length]} ${(i / items.length) * 100}% ${((i + 1) / items.length) * 100}%`).join(", ")})`,
          }}
        >
          {items.map((item, i) => {
            const angle = (i + 0.5) * (360 / items.length);
            return (
              <div key={i} className="absolute left-1/2 top-1/2 origin-left -translate-y-1/2" style={{ transform: `rotate(${angle}deg)`, width: "45%" }}>
                <span className="ml-2 text-xs font-bold text-white drop-shadow-md">{item.length > 8 ? item.slice(0, 8) + "…" : item}</span>
              </div>
            );
          })}
        </motion.div>

        {winner && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Winner:</p>
            <p className="text-2xl font-bold">{winner}</p>
          </motion.div>
        )}

        <Button onClick={spin} disabled={spinning || items.length < 2} size="lg" className="gap-2">
          <RotateCcw className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Spinning..." : "Spin!"}
        </Button>
      </div>

      <div className="flex gap-2">
        <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add item..." onKeyDown={(e) => e.key === "Enter" && addItem()} />
        <Button onClick={addItem} size="icon"><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white" style={{ background: COLORS[i % COLORS.length] }}>
            {item}
            <button onClick={() => setItems(items.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default LuckyWheel;
