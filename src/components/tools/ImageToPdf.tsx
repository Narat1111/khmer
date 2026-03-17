import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ImagePlus, FileDown, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const ImageToPdf: React.FC = () => {
  const { t } = useI18n();
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ url: URL.createObjectURL(file), file }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);

    try {
      const pdf = new jsPDF();
      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        const img = new Image();
        img.src = images[i].url;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const ratio = Math.min(pageW / img.width, pageH / img.height);
            const w = img.width * ratio;
            const h = img.height * ratio;
            const x = (pageW - w) / 2;
            const y = (pageH - h) / 2;
            pdf.addImage(img, "JPEG", x, y, w, h);
            resolve();
          };
        });
      }
      pdf.save("daratool-images.pdf");
    } catch {
      // fallback
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 transition-colors hover:border-primary/50"
      >
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ImagePlus className="h-10 w-10 text-primary" />
        </motion.div>
        <p className="text-sm text-muted-foreground">Click or drag images here</p>
      </motion.div>

      {/* Image thumbnails */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-3 sm:grid-cols-4"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-xl border"
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                <span className="absolute bottom-1 left-1 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-bold">
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate button */}
      {images.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button onClick={generatePdf} disabled={generating} className="w-full" size="lg">
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                {t.download} PDF ({images.length} images)
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ImageToPdf;
