import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Check, Shuffle, Download } from "lucide-react";
import { toast } from "sonner";

const randColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

const GradientGenerator: React.FC = () => {
  const [c1, setC1] = useState("#667eea");
  const [c2, setC2] = useState("#764ba2");
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  const css = `background: ${gradient};`;

  const copy = () => { navigator.clipboard.writeText(css); setCopied(true); toast.success("CSS copied!"); setTimeout(() => setCopied(false), 2000); };
  const randomize = () => { setC1(randColor()); setC2(randColor()); setAngle(Math.floor(Math.random() * 360)); };

  const downloadGradient = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext("2d")!;
    const rad = (angle * Math.PI) / 180;
    const x1 = 600 - 600 * Math.cos(rad), y1 = 315 - 315 * Math.sin(rad);
    const x2 = 600 + 600 * Math.cos(rad), y2 = 315 + 315 * Math.sin(rad);
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, c1); grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(css, 600, 600);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `gradient-${Date.now()}.png`;
      a.click(); URL.revokeObjectURL(url);
      toast.success("Gradient image saved!");
    });
  };

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
        <Button onClick={copy} className="flex-1 gap-2">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied!" : "Copy CSS"}</Button>
        <Button onClick={downloadGradient} variant="outline" className="gap-2"><Download className="h-4 w-4" />Save</Button>
        <Button onClick={randomize} variant="outline" className="gap-2"><Shuffle className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default GradientGenerator;
