import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface Card { front: string; back: string; }

const FlashcardMaker: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { front: "What is React?", back: "A JavaScript library for building UIs" },
    { front: "What is TypeScript?", back: "A typed superset of JavaScript" },
  ]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    setCards([...cards, { front, back }]);
    setFront("");
    setBack("");
  };

  const removeCard = (i: number) => {
    const n = cards.filter((_, j) => j !== i);
    setCards(n);
    if (idx >= n.length) setIdx(Math.max(0, n.length - 1));
  };

  return (
    <div className="space-y-6">
      {/* Card display */}
      {cards.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          <motion.div
            onClick={() => setFlipped(!flipped)}
            className="flex h-48 w-full max-w-md cursor-pointer items-center justify-center rounded-2xl border-2 border-primary/20 bg-card p-6 text-center shadow-elevated"
            whileTap={{ scale: 0.97 }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ perspective: 1000 }}
          >
            <p className="text-lg font-bold" style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
              {flipped ? cards[idx]?.back : cards[idx]?.front}
            </p>
          </motion.div>
          <p className="text-xs text-muted-foreground">Tap to flip • {idx + 1}/{cards.length}</p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false); }} disabled={idx === 0}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setFlipped(!flipped)}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => { setIdx(Math.min(cards.length - 1, idx + 1)); setFlipped(false); }} disabled={idx === cards.length - 1}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* Add card */}
      <div className="space-y-2 rounded-xl border bg-card p-4">
        <Input value={front} onChange={(e) => setFront(e.target.value)} placeholder="Front (question)" />
        <Textarea value={back} onChange={(e) => setBack(e.target.value)} placeholder="Back (answer)" rows={2} />
        <Button onClick={addCard} className="w-full gap-2"><Plus className="h-4 w-4" /> Add Card</Button>
      </div>

      {/* Card list */}
      <div className="space-y-2">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between rounded-lg border bg-card p-3">
            <div className="flex-1 truncate text-sm"><span className="font-bold">{c.front}</span> → {c.back}</div>
            <Button variant="ghost" size="icon" onClick={() => removeCard(i)}><Trash2 className="h-3 w-3" /></Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardMaker;