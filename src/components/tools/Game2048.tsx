import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SIZE = 4;

const Game2048: React.FC = () => {
  const empty = () => Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));

  const addRandom = (grid: number[][]) => {
    const cells: [number, number][] = [];
    grid.forEach((r, i) => r.forEach((c, j) => { if (c === 0) cells.push([i, j]); }));
    if (cells.length === 0) return;
    const [r, c] = cells[Math.floor(Math.random() * cells.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  };

  const init = () => {
    const g = empty();
    addRandom(g);
    addRandom(g);
    return g;
  };

  const [grid, setGrid] = useState(init);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("2048-best") || "0"));

  const slideRow = (row: number[]): [number[], number] => {
    let s = 0;
    const filtered = row.filter((v) => v !== 0);
    const result: number[] = [];
    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        result.push(filtered[i] * 2);
        s += filtered[i] * 2;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }
    while (result.length < SIZE) result.push(0);
    return [result, s];
  };

  const move = useCallback((dir: "up" | "down" | "left" | "right") => {
    setGrid((prev) => {
      const g = prev.map((r) => [...r]);
      let pts = 0;
      const rotate = (m: number[][]) => m[0].map((_, i) => m.map((r) => r[i]).reverse());

      let rotated = g;
      const rotations = { left: 0, up: 1, right: 2, down: 3 }[dir];
      for (let i = 0; i < rotations; i++) rotated = rotate(rotated);

      const newGrid = rotated.map((row) => {
        const [r, s] = slideRow(row);
        pts += s;
        return r;
      });

      let result = newGrid;
      for (let i = 0; i < (4 - rotations) % 4; i++) result = rotate(result);

      if (JSON.stringify(result) === JSON.stringify(prev)) return prev;

      addRandom(result);
      setScore((s) => {
        const ns = s + pts;
        if (ns > best) { setBest(ns); localStorage.setItem("2048-best", ns.toString()); }
        return ns;
      });
      return result;
    });
  }, [best]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      };
      if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [move]);

  const reset = () => { setGrid(init()); setScore(0); };

  const colors: Record<number, string> = {
    0: "bg-muted", 2: "bg-amber-100 text-amber-900", 4: "bg-amber-200 text-amber-900",
    8: "bg-orange-300 text-white", 16: "bg-orange-400 text-white", 32: "bg-orange-500 text-white",
    64: "bg-red-400 text-white", 128: "bg-yellow-400 text-white", 256: "bg-yellow-500 text-white",
    512: "bg-yellow-600 text-white", 1024: "bg-yellow-700 text-white", 2048: "bg-yellow-300 text-yellow-900",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-xs items-center justify-between">
        <div className="text-center"><p className="text-xs text-muted-foreground">Score</p><p className="text-2xl font-bold font-english tabular-nums">{score}</p></div>
        <div className="text-center"><p className="text-xs text-muted-foreground">Best</p><p className="text-2xl font-bold font-english tabular-nums">{best}</p></div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-muted/50 p-2" style={{ width: "min(100%, 320px)" }}>
        {grid.flat().map((val, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`flex aspect-square items-center justify-center rounded-lg font-english text-lg font-bold ${colors[val] || "bg-amber-800 text-white"}`}
          >
            {val > 0 ? val : ""}
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Use arrow keys to play</p>
      <Button onClick={reset} variant="outline">New Game</Button>
    </div>
  );
};

export default Game2048;