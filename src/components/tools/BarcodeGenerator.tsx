import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const BarcodeGenerator: React.FC = () => {
  const [text, setText] = useState("1234567890");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawBarcode = () => {
    const c = canvasRef.current;
    if (!c || !text) return;
    const ctx = c.getContext("2d")!;
    c.width = Math.max(text.length * 11 + 40, 200);
    c.height = 120;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#000000";
    let x = 20;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      for (let b = 7; b >= 0; b--) {
        if ((code >> b) & 1) ctx.fillRect(x, 10, 1, 80);
        x += 1;
      }
      ctx.fillRect(x, 10, 1, 80); x += 2;
    }
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, c.width / 2, 108);
  };

  useEffect(() => { drawBarcode(); }, [text]);

  const download = () => {
    const link = document.createElement("a");
    link.download = "barcode.png";
    link.href = canvasRef.current!.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or number" />
        <Button variant="outline" onClick={download}><Download className="h-4 w-4" /></Button>
      </motion.div>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center rounded-xl border bg-white p-4">
        <canvas ref={canvasRef} />
      </motion.div>
    </div>
  );
};

export default BarcodeGenerator;
