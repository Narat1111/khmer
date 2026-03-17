import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

const ImageCompressor: React.FC = () => {
  const { t } = useI18n();
  const [original, setOriginal] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setOriginal(file);
    setCompressed(null);
    setStats(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressed(URL.createObjectURL(blob));
            setStats({ original: file.size, compressed: blob.size });
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-accent/50"
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{original ? original.name : "ជ្រើសរើសរូបភាព"}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">
          គុណភាព: <span className="font-english tabular-nums">{Math.round(quality * 100)}%</span>
        </label>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={quality}
          onChange={(e) => {
            setQuality(Number(e.target.value));
            if (original) handleFile(original);
          }}
          className="flex-1 accent-primary"
        />
      </div>

      {stats && (
        <div className="rounded-lg border bg-accent/50 p-3 text-sm">
          <div className="flex justify-between">
            <span>ទំហំដើម:</span>
            <span className="font-english tabular-nums">{formatSize(stats.original)}</span>
          </div>
          <div className="flex justify-between">
            <span>ទំហំថ្មី:</span>
            <span className="font-english tabular-nums">{formatSize(stats.compressed)}</span>
          </div>
          <div className="flex justify-between font-medium text-primary">
            <span>បន្ថយ:</span>
            <span className="font-english tabular-nums">
              {Math.round((1 - stats.compressed / stats.original) * 100)}%
            </span>
          </div>
        </div>
      )}

      {compressed && (
        <a href={compressed} download="compressed.jpg">
          <Button className="w-full gap-2">
            <Download className="h-4 w-4" />
            {t.download}
          </Button>
        </a>
      )}
    </div>
  );
};

export default ImageCompressor;
