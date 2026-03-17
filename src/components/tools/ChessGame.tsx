import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Piece = "K" | "Q" | "R" | "B" | "N" | "P" | "k" | "q" | "r" | "b" | "n" | "p" | null;

const INITIAL: Piece[][] = [
  ["r","n","b","q","k","b","n","r"],
  ["p","p","p","p","p","p","p","p"],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ["P","P","P","P","P","P","P","P"],
  ["R","N","B","Q","K","B","N","R"],
];

const SYMBOLS: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Piece[][]>(INITIAL.map((r) => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [captured, setCaptured] = useState<{ white: string[]; black: string[] }>({ white: [], black: [] });

  const isWhite = (p: Piece) => p !== null && p === p.toUpperCase();
  const isBlack = (p: Piece) => p !== null && p === p.toLowerCase();

  const handleClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      const sp = board[sr][sc];
      // Simple move (no full chess rules validation)
      if (r === sr && c === sc) { setSelected(null); return; }

      const target = board[r][c];
      if (target && ((turn === "white" && isWhite(target)) || (turn === "black" && isBlack(target)))) {
        setSelected([r, c]); return;
      }

      const nb = board.map((row) => [...row]);
      if (target) {
        if (turn === "white") setCaptured((p) => ({ ...p, white: [...p.white, SYMBOLS[target]] }));
        else setCaptured((p) => ({ ...p, black: [...p.black, SYMBOLS[target]] }));
      }
      nb[r][c] = sp;
      nb[sr][sc] = null;
      setBoard(nb);
      setTurn(turn === "white" ? "black" : "white");
      setSelected(null);
    } else {
      if (!piece) return;
      if (turn === "white" && !isWhite(piece)) return;
      if (turn === "black" && !isBlack(piece)) return;
      setSelected([r, c]);
    }
  };

  const reset = () => { setBoard(INITIAL.map((r) => [...r])); setTurn("white"); setSelected(null); setCaptured({ white: [], black: [] }); };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-xs items-center justify-between">
        <p className={`text-sm font-bold ${turn === "white" ? "text-primary" : "text-muted-foreground"}`}>⬜ White</p>
        <p className="text-xs rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{turn === "white" ? "White's turn" : "Black's turn"}</p>
        <p className={`text-sm font-bold ${turn === "black" ? "text-primary" : "text-muted-foreground"}`}>⬛ Black</p>
      </div>

      <div className="grid grid-cols-8 rounded-lg border-2 border-primary/20 overflow-hidden" style={{ width: "min(100%, 360px)" }}>
        {board.map((row, r) =>
          row.map((piece, c) => (
            <motion.button
              key={`${r}-${c}`}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleClick(r, c)}
              className={`flex aspect-square items-center justify-center text-xl sm:text-2xl
                ${(r + c) % 2 === 0 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-amber-700/60 dark:bg-amber-800/50"}
                ${selected?.[0] === r && selected?.[1] === c ? "!bg-primary/30 ring-2 ring-primary" : ""}
              `}
            >
              {piece ? SYMBOLS[piece] : ""}
            </motion.button>
          ))
        )}
      </div>

      {(captured.white.length > 0 || captured.black.length > 0) && (
        <div className="flex w-full max-w-xs justify-between text-lg">
          <div>{captured.white.join("")}</div>
          <div>{captured.black.join("")}</div>
        </div>
      )}

      <Button onClick={reset} variant="outline">New Game</Button>
    </div>
  );
};

export default ChessGame;