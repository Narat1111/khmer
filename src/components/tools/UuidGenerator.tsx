import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw, Copy } from "lucide-react";

const UuidGenerator: React.FC = () => {
  const gen = () => crypto.randomUUID();
  const [uuids, setUuids] = useState<string[]>([gen()]);
  const [count, setCount] = useState(1);

  const generate = () => {
    setUuids(Array.from({ length: count }, () => gen()));
  };

  const copyAll = () => navigator.clipboard.writeText(uuids.join("\n"));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Count:</span>
        <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(+e.target.value)} className="w-16 rounded border bg-background px-2 py-1 text-sm" />
        <Button onClick={generate} className="gap-2"><RefreshCw className="h-4 w-4" /> Generate</Button>
        <Button variant="outline" onClick={copyAll} className="gap-2"><Copy className="h-4 w-4" /> Copy All</Button>
      </div>
      <div className="space-y-1">
        {uuids.map((u, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigator.clipboard.writeText(u)}
          >
            <code className="text-xs font-mono flex-1 break-all">{u}</code>
            <Copy className="h-3 w-3 text-muted-foreground shrink-0" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UuidGenerator;
