import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const TextDiff: React.FC = () => {
  const [a, setA] = useState("Hello World\nThis is line 2\nLine three here");
  const [b, setB] = useState("Hello World\nThis is modified\nLine three here\nNew line added");
  const [diff, setDiff] = useState<{ type: string; line: string }[]>([]);

  const compare = () => {
    const la = a.split("\n"), lb = b.split("\n");
    const result: { type: string; line: string }[] = [];
    const max = Math.max(la.length, lb.length);
    for (let i = 0; i < max; i++) {
      if (i >= la.length) result.push({ type: "add", line: lb[i] });
      else if (i >= lb.length) result.push({ type: "remove", line: la[i] });
      else if (la[i] === lb[i]) result.push({ type: "same", line: la[i] });
      else { result.push({ type: "remove", line: la[i] }); result.push({ type: "add", line: lb[i] }); }
    }
    setDiff(result);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className="mb-1 block text-sm font-medium">Original</label><Textarea value={a} onChange={(e) => setA(e.target.value)} rows={6} /></div>
        <div><label className="mb-1 block text-sm font-medium">Modified</label><Textarea value={b} onChange={(e) => setB(e.target.value)} rows={6} /></div>
      </div>
      <Button onClick={compare} className="w-full">Compare</Button>
      {diff.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-4 font-mono text-sm">
          {diff.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`px-2 py-0.5 ${d.type === "add" ? "bg-green-500/20 text-green-700 dark:text-green-400" : d.type === "remove" ? "bg-destructive/20 text-destructive" : ""}`}>
              {d.type === "add" ? "+ " : d.type === "remove" ? "- " : "  "}{d.line}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TextDiff;
