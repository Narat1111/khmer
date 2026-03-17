import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const fonts = [
  "Arial", "Verdana", "Georgia", "Times New Roman", "Courier New", "Trebuchet MS",
  "Impact", "Comic Sans MS", "Palatino Linotype", "Lucida Console", "Garamond",
  "Bookman", "Tahoma", "Lucida Sans", "Copperplate", "Papyrus",
];

const FontPreview: React.FC = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [size, setSize] = useState(24);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Preview text..." />
      <div className="flex items-center gap-3">
        <span className="text-xs">Size:</span>
        <input type="range" min={12} max={48} value={size} onChange={(e) => setSize(+e.target.value)} className="flex-1" />
        <span className="text-xs w-8">{size}px</span>
        <button onClick={() => setBold(!bold)} className={`rounded border px-2 py-1 text-xs font-bold ${bold ? "bg-primary text-primary-foreground" : ""}`}>B</button>
        <button onClick={() => setItalic(!italic)} className={`rounded border px-2 py-1 text-xs italic ${italic ? "bg-primary text-primary-foreground" : ""}`}>I</button>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {fonts.map((font) => (
          <motion.div key={font} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-3 hover:border-primary/40 transition-colors">
            <p className="text-[10px] text-muted-foreground mb-1">{font}</p>
            <p style={{ fontFamily: font, fontSize: size, fontWeight: bold ? "bold" : "normal", fontStyle: italic ? "italic" : "normal" }} className="leading-snug break-words">
              {text}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FontPreview;
