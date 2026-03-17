import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

const CSSShadowGen: React.FC = () => {
  const [x, setX] = useState(5);
  const [y, setY] = useState(5);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000040");
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;

  const copy = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadow};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-8">
        <div className="h-32 w-32 rounded-2xl bg-card border" style={{ boxShadow: shadow }} />
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "X Offset", value: x, set: setX, min: -50, max: 50 },
          { label: "Y Offset", value: y, set: setY, min: -50, max: 50 },
          { label: "Blur", value: blur, set: setBlur, min: 0, max: 100 },
          { label: "Spread", value: spread, set: setSpread, min: -50, max: 50 },
        ].map((s) => (
          <div key={s.label}>
            <label className="text-xs font-medium">{s.label}: {s.value}px</label>
            <input type="range" min={s.min} max={s.max} value={s.value} onChange={(e) => s.set(+e.target.value)} className="w-full" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input type="color" value={color.slice(0, 7)} onChange={(e) => setColor(e.target.value + "40")} className="h-8 w-8 rounded" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} /> Inset</label>
      </div>
      <div className="flex items-center gap-2 rounded-xl border bg-muted p-3">
        <code className="flex-1 text-xs font-mono truncate">box-shadow: {shadow};</code>
        <Button size="sm" variant="outline" onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
      </div>
    </div>
  );
};

export default CSSShadowGen;
