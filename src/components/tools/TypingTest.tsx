import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const sentences = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "Programming is the art of telling a computer what to do step by step.",
  "Cambodia is a beautiful country with ancient temples and rich culture.",
  "Technology changes the world and makes our lives easier every day.",
  "Practice makes perfect when learning any new skill or language.",
];

const TypingTest: React.FC = () => {
  const [text] = useState(() => sentences[Math.floor(Math.random() * sentences.length)]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback((val: string) => {
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(val);
    if (val.length >= text.length) {
      setFinished(true);
      const elapsed = (Date.now() - startTime) / 60000;
      const words = text.split(" ").length;
      setWpm(Math.round(words / elapsed));
      let correct = 0;
      for (let i = 0; i < text.length; i++) if (val[i] === text[i]) correct++;
      setAccuracy(Math.round((correct / text.length) * 100));
    }
  }, [started, startTime, text]);

  const restart = () => {
    setInput(""); setStarted(false); setFinished(false); setWpm(0); setAccuracy(100);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-muted p-4 font-english text-sm leading-relaxed">
        {text.split("").map((char, i) => (
          <span key={i} className={i < input.length ? (input[i] === char ? "text-green-500" : "bg-destructive/30 text-destructive") : i === input.length ? "border-b-2 border-primary" : "text-muted-foreground"}>
            {char}
          </span>
        ))}
      </motion.div>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => !finished && handleInput(e.target.value)}
        className="w-full rounded-xl border bg-card p-3 font-english text-sm outline-none focus:ring-2 focus:ring-primary/30"
        placeholder="Start typing here..."
        disabled={finished}
        autoFocus
      />
      {finished && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-3xl font-bold font-english text-primary">{wpm}</p>
            <p className="text-xs text-muted-foreground">WPM</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-3xl font-bold font-english">{accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
        </motion.div>
      )}
      {finished && <Button onClick={restart} className="w-full">Try Again</Button>}
    </div>
  );
};

export default TypingTest;
