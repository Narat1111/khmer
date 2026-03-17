import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const CATEGORIES = {
  "Arrows": "← → ↑ ↓ ↔ ↕ ⇐ ⇒ ⇑ ⇓ ⇔ ➜ ➤ ➡ ⬅ ⬆ ⬇",
  "Math": "± × ÷ ≠ ≈ ≤ ≥ √ ∞ ∑ ∏ ∫ Δ π θ φ",
  "Currency": "$ € £ ¥ ₹ ₿ ₩ ₫ ฿ ₴ ₸ ₺ ₽",
  "Stars": "★ ☆ ✦ ✧ ✪ ✫ ✬ ✭ ✮ ✯ ⭐ 🌟",
  "Hearts": "♥ ♡ ❤ ❥ 💕 💖 💗 💘 💝 💞 💟",
  "Music": "♩ ♪ ♫ ♬ 🎵 🎶 🎼",
  "Symbols": "© ® ™ ° † ‡ § ¶ • … ‰ ‱ ℃ ℉",
};

const CharacterMap: React.FC = () => {
  const [copied, setCopied] = useState("");
  const [search, setSearch] = useState("");

  const copy = (c: string) => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(""), 800); };

  return (
    <div className="space-y-4">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search symbols..." />
      {copied && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-sm font-bold text-primary">Copied: {copied}</motion.p>}
      {Object.entries(CATEGORIES).map(([cat, chars]) => {
        const filtered = chars.split(" ").filter(c => !search || c.includes(search) || cat.toLowerCase().includes(search.toLowerCase()));
        if (filtered.length === 0) return null;
        return (
          <div key={cat}>
            <p className="mb-2 text-xs font-bold text-muted-foreground">{cat}</p>
            <div className="flex flex-wrap gap-1">
              {filtered.map((c, i) => (
                <motion.button key={i} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.8 }} onClick={() => copy(c)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg hover:bg-accent transition-colors">{c}</motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterMap;
