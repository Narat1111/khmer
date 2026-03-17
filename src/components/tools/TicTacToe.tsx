import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [xTurn, setXTurn] = useState(true);
  const [score, setScore] = useState({ x: 0, o: 0 });

  const winner = LINES.reduce<string | null>((w, [a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c] ? board[a] : w, null);
  const draw = !winner && board.every(Boolean);

  const play = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = xTurn ? "X" : "O";
    setBoard(next);
    setXTurn(!xTurn);
    // check winner after set
    const w = LINES.reduce<string | null>((w, [a, b, c]) => next[a] && next[a] === next[b] && next[a] === next[c] ? next[a] : w, null);
    if (w) setScore(s => w === "X" ? { ...s, x: s.x + 1 } : { ...s, o: s.o + 1 });
  };

  const reset = () => { setBoard(Array(9).fill("")); setXTurn(true); };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-center">
        <div className={xTurn && !winner ? "text-primary" : ""}><p className="text-2xl font-bold font-english">{score.x}</p><p className="text-xs">X</p></div>
        <div className={!xTurn && !winner ? "text-primary" : ""}><p className="text-2xl font-bold font-english">{score.o}</p><p className="text-xs">O</p></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <motion.button key={i} whileHover={{ scale: cell ? 1 : 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => play(i)}
            className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 text-3xl font-bold ${cell === "X" ? "border-blue-500 text-blue-500" : cell === "O" ? "border-red-500 text-red-500" : "border-border hover:border-primary"}`}>
            {cell && <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}>{cell}</motion.span>}
          </motion.button>
        ))}
      </div>
      {winner && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl font-bold">{winner} Wins! 🎉</motion.p>}
      {draw && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl font-bold">Draw! 🤝</motion.p>}
      <Button onClick={reset}>New Game</Button>
    </div>
  );
};

export default TicTacToe;
