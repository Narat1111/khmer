import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FACES = ["⚀","⚁","⚂","⚃","⚄","⚅"];

const DiceRoller: React.FC = () => {
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const results = dice.map(() => Math.floor(Math.random() * 6) + 1);
      setDice(results);
      setHistory(h => [results.reduce((a, b) => a + b, 0), ...h].slice(0, 20));
      setRolling(false);
    }, 600);
  };

  const addDie = () => dice.length < 6 && setDice([...dice, 1]);
  const removeDie = () => dice.length > 1 && setDice(dice.slice(0, -1));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        {dice.map((d, i) => (
          <motion.div key={i} animate={rolling ? { rotate: [0, 360, 720], scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.6 }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-border bg-card shadow-lg text-5xl">
            {FACES[d - 1]}
          </motion.div>
        ))}
      </div>
      <p className="text-2xl font-bold font-english">Total: {dice.reduce((a, b) => a + b, 0)}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={removeDie}>- Die</Button>
        <Button onClick={roll} disabled={rolling} size="lg">{rolling ? "Rolling..." : "🎲 Roll!"}</Button>
        <Button size="sm" variant="outline" onClick={addDie}>+ Die</Button>
      </div>
      {history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
          {history.map((h, i) => (
            <span key={i} className="rounded-full bg-muted px-2 py-1 text-xs font-bold">{h}</span>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DiceRoller;
