import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface Card { q: string; a: string; }

const FlashcardQuiz: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { q: "What is HTML?", a: "HyperText Markup Language" },
    { q: "What is CSS?", a: "Cascading Style Sheets" },
    { q: "What is JS?", a: "JavaScript - a programming language" },
  ]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const check = () => {
    if (answer.toLowerCase().trim().includes(cards[current].a.toLowerCase().substring(0, 5))) {
      setScore((s) => s + 1);
    }
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 >= cards.length) { setDone(true); return; }
    setCurrent((c) => c + 1);
    setAnswer("");
    setShowResult(false);
  };

  const restart = () => { setCurrent(0); setScore(0); setAnswer(""); setShowResult(false); setDone(false); };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-10">
        <div className="text-5xl">🏆</div>
        <h3 className="text-xl font-bold">Quiz Complete!</h3>
        <p className="text-muted-foreground">Score: {score}/{cards.length}</p>
        <div className="h-2 w-48 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(score / cards.length) * 100}%` }} />
        </div>
        <Button onClick={restart} className="gap-2"><RotateCcw className="h-4 w-4" /> Try Again</Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {current + 1}/{cards.length}</span>
        <span>Score: {score}</span>
      </div>
      <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border bg-card p-6 text-center">
        <p className="text-lg font-bold">{cards[current].q}</p>
      </motion.div>
      {!showResult ? (
        <div className="flex gap-2">
          <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your answer..." onKeyDown={(e) => e.key === "Enter" && check()} />
          <Button onClick={check}>Check</Button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Correct Answer:</p>
            <p className="font-bold text-primary">{cards[current].a}</p>
          </div>
          <Button onClick={next} className="w-full">{current + 1 >= cards.length ? "See Results" : "Next →"}</Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlashcardQuiz;
