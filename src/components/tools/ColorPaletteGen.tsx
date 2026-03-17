import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw, Copy, Check } from "lucide-react";

const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

const ColorPaletteGen: React.FC = () => {
  const [colors, setColors] = useState(() => Array.from({ length: 5 }, randomColor));
  const [copied, setCopied] = useState(-1);

  const regenerate = () => setColors(Array.from({ length: 5 }, randomColor));

  const copy = (c: string, i: number) => {
    navigator.clipboard.writeText(c);
    setCopied(i);
    setTimeout(() => setCopied(-1), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button onClick={regenerate} className="gap-2"><RefreshCw className="h-4 w-4" /> Generate Palette</Button>
      </div>
      <div className="flex gap-2 overflow-hidden rounded-2xl border">
        {colors.map((c, i) => (
          <motion.div key={i + c} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => copy(c, i)} className="flex flex-1 cursor-pointer flex-col items-center justify-end p-3 transition-transform hover:scale-105"
            style={{ background: c, minHeight: 180 }}>
            <motion.span whileHover={{ scale: 1.1 }} className="rounded-lg bg-white/80 px-2 py-1 text-xs font-bold font-mono text-black backdrop-blur">
              {copied === i ? <Check className="inline h-3 w-3" /> : c.toUpperCase()}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">Click a color to copy its hex code</p>
    </div>
  );
};

export default ColorPaletteGen;
