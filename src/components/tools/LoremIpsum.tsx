import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

const LoremIpsum: React.FC = () => {
  const [count, setCount] = useState("3");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 20);
    const paragraphs = Array.from({ length: n }, () => {
      const len = 30 + Math.floor(Math.random() * 40);
      return Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]).join(" ") + ".";
    });
    setText(paragraphs.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("\n\n"));
  };

  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
        <Input type="number" value={count} onChange={(e) => setCount(e.target.value)} placeholder="Paragraphs" className="w-32" />
        <Button onClick={generate}>Generate</Button>
        {text && <Button variant="outline" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>}
      </motion.div>
      {text && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-4 text-sm leading-relaxed whitespace-pre-line">
          {text}
        </motion.div>
      )}
    </div>
  );
};

export default LoremIpsum;
