import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Download, Upload } from "lucide-react";

const GifMaker: React.FC = () => {
  const [frames, setFrames] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [speed, setSpeed] = useState(200);
  const intervalRef = useRef<number | null>(null);

  const addFrames = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = () => setFrames((prev) => [...prev, r.result as string]);
      r.readAsDataURL(f);
    });
  };

  useEffect(() => {
    if (playing && frames.length > 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentFrame((c) => (c + 1) % frames.length);
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, frames.length, speed]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 hover:bg-accent/50">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Upload images as frames</span>
        <input type="file" accept="image/*" multiple onChange={addFrames} className="hidden" />
      </label>
      {frames.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-xl border bg-card p-4 flex justify-center">
            <img src={frames[currentFrame]} alt={`Frame ${currentFrame}`} className="max-h-48 rounded" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Speed (ms):</span>
            <Input type="number" value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-24" min={50} max={2000} step={50} />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setPlaying(!playing)} className="flex-1">{playing ? "⏸ Pause" : "▶️ Play"}</Button>
            <Button variant="destructive" onClick={() => { setFrames([]); setCurrentFrame(0); setPlaying(false); }}>Clear</Button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {frames.map((f, i) => (
              <img key={i} src={f} className={`h-12 w-12 rounded border object-cover cursor-pointer ${i === currentFrame ? "ring-2 ring-primary" : ""}`} onClick={() => setCurrentFrame(i)} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{frames.length} frames • {(1000 / speed).toFixed(1)} fps</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GifMaker;
