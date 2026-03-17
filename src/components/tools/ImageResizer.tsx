import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Download, Upload } from "lucide-react";

const ImageResizer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const load = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => { setOrigSize({ w: img.width, h: img.height }); setWidth(img.width); setHeight(img.height); imgRef.current = img; };
      img.src = r.result as string;
      setImage(r.result as string);
    };
    r.readAsDataURL(f);
  };

  const setW = (w: number) => { setWidth(w); if (lock && origSize.w) setHeight(Math.round((w / origSize.w) * origSize.h)); };
  const setH = (h: number) => { setHeight(h); if (lock && origSize.h) setWidth(Math.round((h / origSize.h) * origSize.w)); };

  const resize = () => {
    if (!canvasRef.current || !imgRef.current) return;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasRef.current.getContext("2d")?.drawImage(imgRef.current, 0, 0, width, height);
    const a = document.createElement("a");
    a.download = `resized-${width}x${height}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 hover:bg-accent/50">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Upload image to resize</span>
        <input type="file" accept="image/*" onChange={load} className="hidden" />
      </label>
      {image && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <img src={image} alt="preview" className="max-h-48 rounded-xl border mx-auto" />
          <p className="text-center text-xs text-muted-foreground">Original: {origSize.w} × {origSize.h}</p>
          <div className="flex items-center gap-2">
            <Input type="number" value={width} onChange={(e) => setW(+e.target.value)} className="w-24" />
            <span className="text-muted-foreground">×</span>
            <Input type="number" value={height} onChange={(e) => setH(+e.target.value)} className="w-24" />
            <Button size="sm" variant={lock ? "default" : "outline"} onClick={() => setLock(!lock)}>🔗</Button>
          </div>
          <Button onClick={resize} className="w-full gap-2"><Download className="h-4 w-4" /> Resize & Download</Button>
        </motion.div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};

export default ImageResizer;
