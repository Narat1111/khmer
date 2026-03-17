import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

const SIZE = 9;
const generatePuzzle = (): (number | null)[][] => {
  // Simple pre-made puzzle
  const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9],
  ];
  return puzzle.map((r) => r.map((v) => (v === 0 ? null : v)));
};

const SudokuGame: React.FC = () => {
  const [initial] = useState(generatePuzzle);
  const [grid, setGrid] = useState<(number | null)[][]>(() => initial.map((r) => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const isFixed = (r: number, c: number) => initial[r][c] !== null;

  const setCell = (val: number | null) => {
    if (!selected || isFixed(selected[0], selected[1])) return;
    const n = grid.map((r) => [...r]);
    n[selected[0]][selected[1]] = val;
    setGrid(n);
  };

  const hasConflict = (r: number, c: number) => {
    const v = grid[r][c];
    if (!v) return false;
    // Row / col / box check
    for (let i = 0; i < 9; i++) {
      if (i !== c && grid[r][i] === v) return true;
      if (i !== r && grid[i][c] === v) return true;
    }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = br; i < br + 3; i++)
      for (let j = bc; j < bc + 3; j++)
        if ((i !== r || j !== c) && grid[i][j] === v) return true;
    return false;
  };

  const reset = () => setGrid(initial.map((r) => [...r]));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-9 rounded-lg border-2 border-primary/30 overflow-hidden" style={{ width: "min(100%, 360px)" }}>
        {grid.map((row, r) =>
          row.map((val, c) => (
            <motion.button
              key={`${r}-${c}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected([r, c])}
              className={`flex aspect-square items-center justify-center font-english text-sm font-bold border-r border-b
                ${c % 3 === 2 && c < 8 ? "border-r-primary/30" : "border-r-border/50"}
                ${r % 3 === 2 && r < 8 ? "border-b-primary/30" : "border-b-border/50"}
                ${selected?.[0] === r && selected?.[1] === c ? "bg-primary/20" : "bg-card"}
                ${isFixed(r, c) ? "text-foreground" : "text-primary"}
                ${hasConflict(r, c) ? "!text-destructive !bg-destructive/10" : ""}
              `}
            >
              {val || ""}
            </motion.button>
          ))
        )}
      </div>

      {/* Number pad */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <Button key={n} variant="outline" size="icon" onClick={() => setCell(n)} className="h-9 w-9 font-english font-bold">{n}</Button>
        ))}
        <Button variant="outline" size="icon" onClick={() => setCell(null)} className="h-9 w-9 text-xs">✕</Button>
      </div>

      <Button onClick={reset} variant="outline" className="gap-2"><RotateCcw className="h-4 w-4" /> Reset</Button>
    </div>
  );
};

export default SudokuGame;