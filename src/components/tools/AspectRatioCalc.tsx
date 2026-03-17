import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const presets = [
  { name: "16:9", w: 16, h: 9 }, { name: "4:3", w: 4, h: 3 }, { name: "1:1", w: 1, h: 1 },
  { name: "21:9", w: 21, h: 9 }, { name: "9:16", w: 9, h: 16 }, { name: "3:2", w: 3, h: 2 },
];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const AspectRatioCalc: React.FC = () => {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const g = gcd(width, height);
  const ratioW = width / g;
  const ratioH = height / g;

  const setFromRatio = (rw: number, rh: number) => {
    setWidth(rw * 100);
    setHeight(rh * 100);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Width</label>
          <Input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} />
        </div>
        <span className="mt-5 text-muted-foreground font-bold">×</span>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Height</label>
          <Input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-4 text-center">
        <p className="text-xs text-muted-foreground">Aspect Ratio</p>
        <p className="text-3xl font-bold text-primary">{ratioW}:{ratioH}</p>
      </motion.div>

      <div className="flex items-center justify-center">
        <motion.div
          className="rounded-lg border-2 border-primary bg-primary/5"
          style={{ width: Math.min(200, width / 10), height: Math.min(200, height / 10) }}
          animate={{ width: Math.min(200, width / 10), height: Math.min(200, height / 10) }}
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map((p) => (
          <button key={p.name} onClick={() => setFromRatio(p.w, p.h)} className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${ratioW === p.w && ratioH === p.h ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{p.name}</button>
        ))}
      </div>
    </motion.div>
  );
};

export default AspectRatioCalc;
