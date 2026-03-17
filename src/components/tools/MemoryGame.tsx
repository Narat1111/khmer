import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const EMOJIS = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"];

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const init = () => { setCards(shuffle([...EMOJIS, ...EMOJIS])); setFlipped([]); setMatched([]); setMoves(0); };
  useEffect(init, []);

  const flip = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (cards[next[0]] === cards[next[1]]) { setMatched(m => [...m, ...next]); setFlipped([]); }
      else setTimeout(() => setFlipped([]), 800);
    }
  };

  const won = matched.length === cards.length && cards.length > 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 text-sm font-bold">
        <span>🎯 Moves: {moves}</span>
        <span>✅ Pairs: {matched.length / 2}/{EMOJIS.length}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, i) => {
          const show = flipped.includes(i) || matched.includes(i);
          return (
            <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => flip(i)}
              animate={{ rotateY: show ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-2xl ${matched.includes(i) ? "border-green-500 bg-green-500/10" : show ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
              {show ? card : "❓"}
            </motion.button>
          );
        })}
      </div>
      {won && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl font-bold text-green-500">🎉 You won in {moves} moves!</motion.p>}
      <Button onClick={init}>New Game</Button>
    </div>
  );
};

export default MemoryGame;
