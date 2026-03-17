import { useState } from "react";
import { motion } from "framer-motion";

const choices = ["🪨", "📄", "✂️"] as const;
const names = ["Rock", "Paper", "Scissors"];

const RockPaperScissors: React.FC = () => {
  const [player, setPlayer] = useState(-1);
  const [cpu, setCpu] = useState(-1);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ w: 0, l: 0, d: 0 });

  const play = (p: number) => {
    const c = Math.floor(Math.random() * 3);
    setPlayer(p); setCpu(c);
    if (p === c) { setResult("Draw!"); setScore(s => ({ ...s, d: s.d + 1 })); }
    else if ((p + 1) % 3 === c) { setResult("You Lose!"); setScore(s => ({ ...s, l: s.l + 1 })); }
    else { setResult("You Win! 🎉"); setScore(s => ({ ...s, w: s.w + 1 })); }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-8">
        {player >= 0 && <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
          <p className="text-6xl">{choices[player]}</p><p className="mt-2 text-sm font-bold">You</p>
        </motion.div>}
        {player >= 0 && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="self-center text-2xl font-bold">VS</motion.p>}
        {cpu >= 0 && <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
          <p className="text-6xl">{choices[cpu]}</p><p className="mt-2 text-sm font-bold">CPU</p>
        </motion.div>}
      </div>
      {result && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className={`text-2xl font-bold ${result.includes("Win") ? "text-green-500" : result.includes("Lose") ? "text-destructive" : ""}`}>{result}</motion.p>}
      <div className="flex gap-3">
        {choices.map((c, i) => (
          <motion.button key={i} whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.8 }} onClick={() => play(i)}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-border bg-card text-4xl shadow-lg hover:border-primary transition-colors">
            {c}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-6 text-center">
        <div><p className="text-xl font-bold text-green-500 font-english">{score.w}</p><p className="text-xs text-muted-foreground">Wins</p></div>
        <div><p className="text-xl font-bold font-english">{score.d}</p><p className="text-xs text-muted-foreground">Draws</p></div>
        <div><p className="text-xl font-bold text-destructive font-english">{score.l}</p><p className="text-xs text-muted-foreground">Losses</p></div>
      </div>
    </div>
  );
};

export default RockPaperScissors;
