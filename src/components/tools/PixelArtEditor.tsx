import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eraser, Download, Palette } from "lucide-react";

const GRID = 16;
const COLORS = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#8800ff", "#ff0088", "#00ff88", "#888888", "#444444"];

const PixelArtEditor: React.FC = () => {
  const [pixels, setPixels] = useState<string[]>(Array(GRID * GRID).fill("#ffffff"));
  const [color, setColor] = useState("#000000");
  const [painting, setPainting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paint = (i: number) => {
    const n = [...pixels];
    n[i] = color;
    setPixels(n);
  };

  const clear = () => setPixels(Array(GRID * GRID).fill("#ffffff"));

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = 32;
    canvas.width = GRID * s;
    canvas.height = GRID * s;
    pixels.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect((i % GRID) * s, Math.floor(i / GRID) * s, s, s);
    });
    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Color palette */}
      <div className="flex flex-wrap gap-1.5">
        {COLORS.map((c) => (
          <motion.button key={c} whileTap={{ scale: 0.8 }} onClick={() => setColor(c)} className={`h-7 w-7 rounded-lg border-2 ${color === c ? "border-primary ring-2 ring-primary/30" : "border-border"}`} style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* Grid */}
      <div
        className="mx-auto grid rounded-lg border overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, width: "min(100%, 400px)", aspectRatio: "1" }}
        onMouseLeave={() => setPainting(false)}
      >
        {pixels.map((c, i) => (
          <div
            key={i}
            className="border border-border/20 cursor-crosshair"
            style={{ backgroundColor: c }}
            onMouseDown={() => { setPainting(true); paint(i); }}
            onMouseEnter={() => painting && paint(i)}
            onMouseUp={() => setPainting(false)}
            onTouchStart={(e) => { e.preventDefault(); paint(i); }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={clear} variant="outline" className="flex-1 gap-2"><Eraser className="h-4 w-4" /> Clear</Button>
        <Button onClick={exportImage} className="flex-1 gap-2"><Download className="h-4 w-4" /> Export PNG</Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PixelArtEditor;