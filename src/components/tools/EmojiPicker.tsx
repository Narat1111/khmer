import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const emojis = ["😀","😂","🥰","😎","🤔","😱","🥳","😴","🤮","👻","💀","🤖","👽","🎃","😈","💩","🙈","🐶","🐱","🦊","🐻","🐼","🐨","🦁","🐯","🐸","🐵","🦄","🐝","🦋","🌸","🌺","🌻","🌹","🍕","🍔","🍟","🌮","🍣","🍦","🎂","🍪","☕","🍷","🎮","🎯","🎲","🏆","⚽","🏀","🎸","🎹","🎨","📸","💻","📱","⌚","💡","🔥","⭐","🌈","❤️","💎","🚀","✈️","🏠","🌍","🎵","🔑","📚","🎁","🛒","⏰","🔔","📌","✅","❌","⚡","💰","🎭","🧲","🧪","🔬","🧬","🗿","🏝️","🎪","🎠","🛸","🧊","🪐","🌙","☀️","🌊","🍀","🌵","🎋","🎑"];

const EmojiPicker: React.FC = () => {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  const copy = (e: string) => {
    navigator.clipboard.writeText(e);
    setCopied(e);
    setRecent(r => [e, ...r.filter(x => x !== e)].slice(0, 20));
    setTimeout(() => setCopied(""), 800);
  };

  return (
    <div className="space-y-4">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search emoji..." />
      {recent.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-bold text-muted-foreground">Recent</p>
          <div className="flex flex-wrap gap-1">{recent.map((e, i) => (
            <motion.button key={i} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} onClick={() => copy(e)} className="rounded-lg p-1.5 text-xl hover:bg-accent">{e}</motion.button>
          ))}</div>
        </div>
      )}
      {copied && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-sm font-bold text-primary">Copied {copied}!</motion.p>}
      <div className="grid grid-cols-8 gap-1 sm:grid-cols-10">
        {emojis.map((e, i) => (
          <motion.button key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.005 }} whileHover={{ scale: 1.4, rotate: 10 }} whileTap={{ scale: 0.7 }} onClick={() => copy(e)} className="flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors hover:bg-accent">
            {e}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
