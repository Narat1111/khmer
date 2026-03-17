import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const GRID = 20;
const CELL = 16;
type Pos = { x: number; y: number };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Pos>({ x: 15, y: 10 });
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const randomFood = useCallback((): Pos => ({ x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }), []);

  const reset = () => {
    setSnake([{ x: 10, y: 10 }]); setFood(randomFood()); setDir({ x: 1, y: 0 });
    setScore(0); setGameOver(false); setRunning(true);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && d.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && d.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && d.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: (prev[0].x + dirRef.current.x + GRID) % GRID, y: (prev[0].y + dirRef.current.y + GRID) % GRID };
        if (prev.some((s) => s.x === head.x && s.y === head.y)) { setGameOver(true); setRunning(false); return prev; }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) { setFood(randomFood()); setScore((s) => s + 10); }
        else newSnake.pop();
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [running, gameOver, food, randomFood]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
        <span className="text-2xl font-bold font-english">🏆 {score}</span>
      </motion.div>
      <div className="rounded-xl border bg-muted p-2" style={{ width: GRID * CELL + 16, height: GRID * CELL + 16 }}>
        <div className="relative" style={{ width: GRID * CELL, height: GRID * CELL }}>
          {snake.map((s, i) => (
            <div key={i} className={`absolute rounded-sm ${i === 0 ? "bg-green-500" : "bg-green-400"}`}
              style={{ left: s.x * CELL, top: s.y * CELL, width: CELL - 1, height: CELL - 1 }} />
          ))}
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}
            className="absolute rounded-full bg-destructive"
            style={{ left: food.x * CELL, top: food.y * CELL, width: CELL - 1, height: CELL - 1 }} />
        </div>
      </div>
      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2">
        <div />
        <Button size="sm" variant="outline" onClick={() => dirRef.current.y === 0 && setDir({ x: 0, y: -1 })}>▲</Button>
        <div />
        <Button size="sm" variant="outline" onClick={() => dirRef.current.x === 0 && setDir({ x: -1, y: 0 })}>◄</Button>
        <Button size="sm" variant="outline" onClick={() => dirRef.current.y === 0 && setDir({ x: 0, y: 1 })}>▼</Button>
        <Button size="sm" variant="outline" onClick={() => dirRef.current.x === 0 && setDir({ x: 1, y: 0 })}>►</Button>
      </div>
      {gameOver && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg font-bold text-destructive">Game Over! Score: {score}</motion.p>}
      <Button onClick={reset}>{gameOver ? "Play Again" : running ? "Restart" : "Start Game"}</Button>
    </div>
  );
};

export default SnakeGame;
