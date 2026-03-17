import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Upload, Download } from "lucide-react";

const MemeMaker: React.FC = () => {
  const [image, setImage] = useState("");
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [fontSize, setFontSize] = useState(36);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setImage(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  useEffect(() => {
    if (!image) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Meme text style
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = fontSize / 10;
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.lineJoin = "round";

      // Top text
      if (topText) {
        ctx.strokeText(topText.toUpperCase(), c.width / 2, fontSize + 10);
        ctx.fillText(topText.toUpperCase(), c.width / 2, fontSize + 10);
      }
      // Bottom text
      if (bottomText) {
        ctx.strokeText(bottomText.toUpperCase(), c.width / 2, c.height - 15);
        ctx.fillText(bottomText.toUpperCase(), c.width / 2, c.height - 15);
      }
    };
    img.src = image;
  }, [image, topText, bottomText, fontSize]);

  const download = () => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvasRef.current!.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Input value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Top text..." />
          <Input value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="Bottom text..." />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Size:</span>
          <input type="range" min={16} max={72} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="flex-1" />
          <span className="text-xs font-bold w-8">{fontSize}</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => fileRef.current?.click()} className="gap-2 flex-1"><Upload className="h-4 w-4" /> Upload Image</Button>
          {image && <Button onClick={download} variant="outline" className="gap-2"><Download className="h-4 w-4" /> Save</Button>}
        </div>
      </motion.div>
      {image ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
          <canvas ref={canvasRef} className="max-w-full rounded-xl border" />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-border">
          <p className="text-muted-foreground">Upload an image to create a meme 🎭</p>
        </motion.div>
      )}
    </div>
  );
};

export default MemeMaker;
