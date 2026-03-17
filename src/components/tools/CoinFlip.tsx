import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CoinFlip: React.FC = () => {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails";
      setResult(r);
      setStats((s) => ({ ...s, [r]: s[r] + 1 }));
      setFlipping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={flipping ? { rotateY: [0, 1800], scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-border bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-elevated"
      >
        <span className="text-5xl">{result === "heads" ? "👑" : result === "tails" ? "🌿" : "🪙"}</span>
      </motion.div>
      {result && (
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl font-bold uppercase">
          {result}!
        </motion.p>
      )}
      <Button onClick={flip} disabled={flipping} size="lg">
        {flipping ? "Flipping..." : "Flip Coin"}
      </Button>
      <div className="flex gap-6 text-center">
        <div><p className="text-2xl font-bold font-english text-yellow-500">{stats.heads}</p><p className="text-xs text-muted-foreground">Heads</p></div>
        <div><p className="text-2xl font-bold font-english text-green-500">{stats.tails}</p><p className="text-xs text-muted-foreground">Tails</p></div>
      </div>
      <Button variant="outline" size="sm" onClick={() => setStats({ heads: 0, tails: 0 })}>Reset Stats</Button>
    </div>
  );
};

export default CoinFlip;
