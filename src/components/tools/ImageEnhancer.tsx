import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, Download } from "lucide-react";

const ImageEnhancer: React.FC = () => {
  const [image, setImage] = useState("");
  const [enhanced, setEnhanced] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setImage(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`;

  const download = () => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "enhanced.png";
      link.href = c.toDataURL();
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="space-y-4">
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <div className="flex justify-center"><Button onClick={() => fileRef.current?.click()} className="gap-2"><Upload className="h-4 w-4" /> Upload Image</Button></div>
      {image && (
        <>
          <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={image} className="mx-auto max-h-56 rounded-xl border" style={{ filter }} />
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Brightness", value: brightness, set: setBrightness, max: 200 },
              { label: "Contrast", value: contrast, set: setContrast, max: 200 },
              { label: "Saturation", value: saturate, set: setSaturate, max: 200 },
              { label: "Blur", value: blur, set: setBlur, max: 10 },
            ].map(s => (
              <div key={s.label}>
                <label className="text-xs font-medium">{s.label}: {s.value}{s.label === "Blur" ? "px" : "%"}</label>
                <input type="range" min={0} max={s.max} value={s.value} onChange={(e) => s.set(+e.target.value)} className="w-full" />
              </div>
            ))}
          </div>
          <Button onClick={download} className="w-full gap-2"><Download className="h-4 w-4" /> Download Enhanced</Button>
        </>
      )}
    </div>
  );
};

export default ImageEnhancer;
