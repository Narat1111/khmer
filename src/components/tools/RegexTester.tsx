import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact us at hello@example.com or support@test.org for help.");

  const { matches, error } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const m = [...text.matchAll(re)];
      return { matches: m, error: "" };
    } catch (e: any) {
      return { matches: [] as RegExpMatchArray[], error: e.message };
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Pattern</label>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" placeholder="regex pattern" />
        </div>
        <div className="w-20">
          <label className="mb-1 block text-sm font-medium">Flags</label>
          <Input value={flags} onChange={(e) => setFlags(e.target.value)} className="font-mono" placeholder="gi" />
        </div>
      </motion.div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <label className="mb-1 block text-sm font-medium">Test String</label>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-sm font-bold">🎯 {matches.length} Matches</p>
        <div className="flex flex-wrap gap-2">
          {matches.map((m, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }} className="rounded-full bg-primary/20 px-3 py-1 text-sm font-mono text-primary">
              {m[0]}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RegexTester;
