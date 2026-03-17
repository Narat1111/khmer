import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Scissors, Upload, Download } from "lucide-react";

const AudioTrimmer: React.FC = () => {
  const [audio, setAudio] = useState<{ url: string; name: string } | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const load = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    setAudio({ url, name: f.name });
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const playPreview = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = start;
    audioRef.current.play();
    const check = () => {
      if (audioRef.current && audioRef.current.currentTime >= end) { audioRef.current.pause(); return; }
      requestAnimationFrame(check);
    };
    check();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 hover:bg-accent/50">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Upload audio file to trim</span>
        <input type="file" accept="audio/*" onChange={load} className="hidden" />
      </label>
      {audio && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <audio ref={audioRef} src={audio.url} onLoadedMetadata={() => { const d = audioRef.current?.duration || 0; setDuration(d); setEnd(d); }} controls className="w-full" />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span>Start: {fmt(start)}</span>
              <input type="range" min={0} max={duration} step={0.1} value={start} onChange={(e) => setStart(Math.min(+e.target.value, end - 0.5))} className="flex-1" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>End: {fmt(end)}</span>
              <input type="range" min={0} max={duration} step={0.1} value={end} onChange={(e) => setEnd(Math.max(+e.target.value, start + 0.5))} className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground">Selected: {fmt(start)} → {fmt(end)} ({fmt(end - start)})</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={playPreview} variant="outline" className="flex-1 gap-2"><Scissors className="h-4 w-4" /> Preview Trim</Button>
            <a href={audio.url} download={`trimmed-${audio.name}`}><Button className="gap-2"><Download className="h-4 w-4" /> Download</Button></a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AudioTrimmer;
