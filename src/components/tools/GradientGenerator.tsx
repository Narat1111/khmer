import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Check, Shuffle } from "lucide-react";

const randColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

const GradientGenerator: React.FC = () => {
  const [c1, setC1] = useState("#667eea");
  const [c2, setC2] = useState("#764ba2");
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  const css = `background: ${gradient};`;

  const copy = () => { navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const randomize = () => { setC1(randColor()); setC2(randColor()); setAngle(Math.floor(Math.random() * 360)); };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="h-40 w-full rounded-2xl shadow-elevated" style={{ background: gradient }} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium">Color 1</label>
          <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
            <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-8 w-8 cursor-pointer rounded" />
            <span className="font-english text-sm">{c1}</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Color 2</label>
          <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
            <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-8 w-8 cursor-pointer rounded" />
            <span className="font-english text-sm">{c2}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Angle: {angle}°</label>
        <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full" />
      </div>
      <div className="rounded-xl bg-muted p-3 font-english text-sm">{css}</div>
      <div className="flex gap-2">
        <Button onClick={copy} className="flex-1">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied!" : "Copy CSS"}</Button>
        <Button onClick={randomize} variant="outline"><Shuffle className="h-4 w-4" />Random</Button>
      </div>
    </div>
  );
};

export default GradientGenerator;
