import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, Scissors } from "lucide-react";

const VideoTrimmer: React.FC = () => {
  const [video, setVideo] = useState<string | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const load = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setVideo(URL.createObjectURL(f));
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const preview = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = start;
    videoRef.current.play();
    const check = () => {
      if (videoRef.current && videoRef.current.currentTime >= end) { videoRef.current.pause(); return; }
      requestAnimationFrame(check);
    };
    check();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 hover:bg-accent/50">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Upload video file</span>
        <input type="file" accept="video/*" onChange={load} className="hidden" />
      </label>
      {video && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <video ref={videoRef} src={video} onLoadedMetadata={() => { const d = videoRef.current?.duration || 0; setDuration(d); setEnd(d); }} className="w-full rounded-xl border" controls />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm"><span>Start: {fmt(start)}</span><input type="range" min={0} max={duration} step={0.1} value={start} onChange={(e) => setStart(Math.min(+e.target.value, end - 0.5))} className="flex-1" /></div>
            <div className="flex items-center gap-2 text-sm"><span>End: {fmt(end)}</span><input type="range" min={0} max={duration} step={0.1} value={end} onChange={(e) => setEnd(Math.max(+e.target.value, start + 0.5))} className="flex-1" /></div>
            <p className="text-xs text-muted-foreground">Duration: {fmt(end - start)}</p>
          </div>
          <Button onClick={preview} className="w-full gap-2"><Scissors className="h-4 w-4" /> Preview Selection</Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VideoTrimmer;
