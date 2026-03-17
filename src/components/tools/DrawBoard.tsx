import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eraser, Download, Trash2 } from "lucide-react";

const COLORS = ["#000000","#FF0000","#FF6B00","#FFD600","#00C853","#2196F3","#9C27B0","#FF4081","#FFFFFF"];

const DrawBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = c.offsetWidth;
    c.height = 400;
    const ctx = c.getContext("2d");
    if (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, c.width, c.height); }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const t = "touches" in e ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stop = () => setDrawing(false);

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, c.width, c.height); }
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current!.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-3">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-2">
        {COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)} className={`h-8 w-8 rounded-full border-2 transition-transform ${color === c ? "scale-125 border-primary" : "border-transparent"}`} style={{ background: c }} />
        ))}
        <input type="range" min="1" max="20" value={size} onChange={(e) => setSize(+e.target.value)} className="w-20" />
        <Button size="sm" variant="outline" onClick={() => setColor("#FFFFFF")}><Eraser className="h-4 w-4" /></Button>
        <Button size="sm" variant="outline" onClick={clear}><Trash2 className="h-4 w-4" /></Button>
        <Button size="sm" variant="outline" onClick={download}><Download className="h-4 w-4" /></Button>
      </motion.div>
      <canvas ref={canvasRef} onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
        className="w-full cursor-crosshair rounded-xl border bg-white touch-none" style={{ height: 400 }} />
    </div>
  );
};

export default DrawBoard;
