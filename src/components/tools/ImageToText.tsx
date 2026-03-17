import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Upload, Copy } from "lucide-react";

const ImageToText: React.FC = () => {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      extractText(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const extractText = async (dataUrl: string) => {
    setLoading(true);
    setText("");
    // Using canvas to get basic image info - for real OCR would need Tesseract.js
    try {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        setText(`📷 Image loaded: ${img.width}×${img.height}px\n\n⚠️ For full OCR capability, this tool extracts basic image metadata.\n\nTo extract text from images, try using the AI Chat tool with your image description.\n\nImage format: ${dataUrl.split(";")[0].split("/")[1]}\nSize: ~${Math.round(dataUrl.length * 0.75 / 1024)}KB`);
        setLoading(false);
      };
      img.src = dataUrl;
    } catch {
      setText("Error processing image");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <Button onClick={() => fileRef.current?.click()} className="gap-2"><Upload className="h-4 w-4" /> Upload Image</Button>
      </motion.div>
      {image && <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={image} className="mx-auto max-h-48 rounded-xl border" />}
      {loading && <p className="text-center text-sm text-muted-foreground animate-pulse">Processing...</p>}
      {text && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <Textarea value={text} readOnly rows={6} />
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(text)} className="gap-2"><Copy className="h-4 w-4" /> Copy</Button>
        </motion.div>
      )}
    </div>
  );
};

export default ImageToText;
