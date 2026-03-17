import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

const buttons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleBtn = (btn: string) => {
    if (btn === "C") { setDisplay("0"); setPrev(null); setOp(null); setFresh(true); return; }
    if (btn === "⌫") { setDisplay((d) => d.length > 1 ? d.slice(0, -1) : "0"); return; }
    if (btn === "±") { setDisplay((d) => d.startsWith("-") ? d.slice(1) : "-" + d); return; }
    if (btn === "%") { setDisplay((d) => String(parseFloat(d) / 100)); return; }
    if (["+", "−", "×", "÷"].includes(btn)) {
      setPrev(parseFloat(display));
      setOp(btn);
      setFresh(true);
      return;
    }
    if (btn === "=") {
      if (prev === null || !op) return;
      const cur = parseFloat(display);
      let result = 0;
      if (op === "+") result = prev + cur;
      else if (op === "−") result = prev - cur;
      else if (op === "×") result = prev * cur;
      else if (op === "÷") result = cur !== 0 ? prev / cur : 0;
      const r = Math.round(result * 1e10) / 1e10;
      const entry = `${prev} ${op} ${cur} = ${r}`;
      setHistory(h => [entry, ...h].slice(0, 20));
      setDisplay(String(r));
      setPrev(null); setOp(null); setFresh(true);
      return;
    }
    if (fresh) { setDisplay(btn === "." ? "0." : btn); setFresh(false); }
    else { setDisplay((d) => d === "0" && btn !== "." ? btn : d + btn); }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    toast.success("Copied: " + display);
    setTimeout(() => setCopied(false), 1500);
  };

  const saveHistory = () => {
    if (!history.length) return;
    const blob = new Blob([history.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "calculator-history.txt";
    a.click(); URL.revokeObjectURL(url);
    toast.success("History saved!");
  };

  const isOp = (b: string) => ["+", "−", "×", "÷"].includes(b);

  return (
    <div className="mx-auto max-w-xs space-y-3">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-muted p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <button onClick={copyResult} className="p-1 rounded text-muted-foreground hover:text-foreground">
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </button>
            {history.length > 0 && (
              <button onClick={saveHistory} className="p-1 rounded text-muted-foreground hover:text-foreground">
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-3xl font-bold font-english tabular-nums truncate">{display}</p>
        </div>
        {op && prev !== null && (
          <p className="text-xs text-muted-foreground text-right mt-1">{prev} {op}</p>
        )}
      </motion.div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn, i) => (
          <motion.button
            key={btn + i}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => handleBtn(btn)}
            className={`flex h-14 items-center justify-center rounded-xl text-lg font-bold transition-colors ${
              btn === "=" ? "bg-primary text-primary-foreground col-span-1" :
              isOp(btn) ? "bg-primary/20 text-primary" :
              btn === "C" ? "bg-destructive/20 text-destructive" :
              "bg-muted hover:bg-accent"
            }`}
          >
            {btn}
          </motion.button>
        ))}
      </div>
      {history.length > 0 && (
        <div className="rounded-xl border bg-card p-3 max-h-32 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground mb-1">History</p>
          {history.map((h, i) => (
            <p key={i} className="text-xs font-english text-muted-foreground">{h}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calculator;
