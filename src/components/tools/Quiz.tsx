import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  { q: "What is the capital of France?", opts: ["London", "Paris", "Berlin", "Madrid"], ans: 1 },
  { q: "Which planet is closest to the Sun?", opts: ["Venus", "Earth", "Mercury", "Mars"], ans: 2 },
  { q: "What is 15 × 15?", opts: ["200", "225", "250", "215"], ans: 1 },
  { q: "Who painted the Mona Lisa?", opts: ["Picasso", "Van Gogh", "Da Vinci", "Monet"], ans: 2 },
  { q: "What is the largest ocean?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3 },
  { q: "How many continents are there?", opts: ["5", "6", "7", "8"], ans: 2 },
  { q: "What gas do plants absorb?", opts: ["Oxygen", "Nitrogen", "CO2", "Hydrogen"], ans: 2 },
  { q: "What year did World War II end?", opts: ["1943", "1944", "1945", "1946"], ans: 2 },
  { q: "Which is the smallest prime number?", opts: ["0", "1", "2", "3"], ans: 2 },
  { q: "What is H2O?", opts: ["Oxygen", "Hydrogen", "Water", "Salt"], ans: 2 },
];

const Quiz: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [done, setDone] = useState(false);

  const answer = (i: number) => {
    if (selected >= 0) return;
    setSelected(i);
    if (i === questions[idx].ans) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(idx + 1); setSelected(-1); }
      else setDone(true);
    }, 1000);
  };

  const restart = () => { setIdx(0); setScore(0); setSelected(-1); setDone(false); };

  if (done) return (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 py-8">
      <p className="text-6xl">{score >= 8 ? "🏆" : score >= 5 ? "🎉" : "📚"}</p>
      <p className="text-2xl font-bold">Score: {score}/{questions.length}</p>
      <p className="text-muted-foreground">{score >= 8 ? "Excellent!" : score >= 5 ? "Good job!" : "Keep learning!"}</p>
      <Button onClick={restart}>Play Again</Button>
    </motion.div>
  );

  const q = questions[idx];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold">Q{idx + 1}/{questions.length}</span>
        <span className="font-bold text-primary">Score: {score}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div animate={{ width: `${((idx + 1) / questions.length) * 100}%` }} className="h-full bg-primary rounded-full" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <p className="text-lg font-bold">{q.q}</p>
          <div className="mt-3 grid gap-2">
            {q.opts.map((o, i) => (
              <motion.button key={i} whileHover={{ scale: selected < 0 ? 1.02 : 1 }} whileTap={{ scale: 0.98 }} onClick={() => answer(i)}
                className={`rounded-xl border-2 p-3 text-left font-medium transition-colors ${
                  selected >= 0 ? (i === q.ans ? "border-green-500 bg-green-500/10" : i === selected ? "border-destructive bg-destructive/10" : "border-border") : "border-border hover:border-primary"
                }`}>{o}</motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
