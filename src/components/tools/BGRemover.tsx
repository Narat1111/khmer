import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, Download } from "lucide-react";

const BGRemover: React.FC = () => {
  const [original, setOriginal] = useState("");
  const [processed, setProcessed] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setOriginal(src);
      processImage(src);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (src: string) => {
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const d = data.data;
      // Simple background removal: remove near-white pixels
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 220 && d[i + 1] > 220 && d[i + 2] > 220) d[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0);
      setProcessed(c.toDataURL("image/png"));
      setLoading(false);
    };
    img.src = src;
  };

  return (
    <div className="space-y-4">
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <div className="flex justify-center">
        <Button onClick={() => fileRef.current?.click()} className="gap-2"><Upload className="h-4 w-4" /> Upload Image</Button>
      </div>
      {loading && <p className="text-center animate-pulse">Processing...</p>}
      {original && processed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="mb-1 text-xs font-bold text-muted-foreground">Original</p>
            <img src={original} className="rounded-xl border max-h-48 mx-auto" />
          </div>
          <div className="text-center" style={{ backgroundImage: "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%)", backgroundSize: "16px 16px" }}>
            <p className="mb-1 text-xs font-bold text-muted-foreground">Removed</p>
            <img src={processed} className="rounded-xl max-h-48 mx-auto" />
          </div>
        </motion.div>
      )}
      {processed && <Button asChild className="w-full gap-2"><a href={processed} download="no-bg.png"><Download className="h-4 w-4" /> Download</a></Button>}
      <p className="text-xs text-center text-muted-foreground">⚠️ Basic white background removal. For complex backgrounds, use a dedicated AI service.</p>
    </div>
  );
};

export default BGRemover;
