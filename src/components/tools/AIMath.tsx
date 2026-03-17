import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AIMath: React.FC = () => {
  const [expr, setExpr] = useState("(25 * 4) + (100 / 5) - 13");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  const solve = () => {
    try {
      // Safe math eval using Function constructor with only math ops
      const sanitized = expr.replace(/[^0-9+\-*/().% ]/g, "");
      const r = new Function(`return ${sanitized}`)();
      setResult(String(Math.round(r * 1e10) / 1e10));
      
      // Generate simple steps
      const s: string[] = [`Expression: ${expr}`];
      const parts = sanitized.match(/\([^()]+\)/g);
      if (parts) parts.forEach(p => {
        const v = new Function(`return ${p}`)();
        s.push(`${p} = ${v}`);
      });
      s.push(`Result = ${Math.round(r * 1e10) / 1e10}`);
      setSteps(s);
    } catch {
      setResult("Invalid expression");
      setSteps([]);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Math Expression</label>
        <div className="flex gap-2">
          <Input value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="(25 * 4) + 100" className="font-mono" onKeyDown={(e) => e.key === "Enter" && solve()} />
          <Button onClick={solve}>Solve</Button>
        </div>
      </motion.div>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6 text-center">
          <p className="text-4xl font-bold font-english">{result}</p>
        </motion.div>
      )}
      {steps.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
          <p className="text-sm font-bold">Steps:</p>
          {steps.map((s, i) => (
            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="text-sm font-mono text-muted-foreground">
              {s}
            </motion.p>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AIMath;
