import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload } from "lucide-react";

const MusicPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<{ name: string; url: string }[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newTracks = files.map((f) => ({ name: f.name.replace(/\.\w+$/, ""), url: URL.createObjectURL(f) }));
    setTracks((prev) => [...prev, ...newTracks]);
  };

  const toggle = () => {
    if (!audioRef.current || !tracks.length) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  };

  const prev = () => { if (current > 0) { setCurrent(current - 1); setPlaying(true); } };
  const next = () => { if (current < tracks.length - 1) { setCurrent(current + 1); setPlaying(true); } };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 hover:bg-accent/50 transition-colors">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Add audio files (MP3, WAV, etc.)</span>
        <input type="file" accept="audio/*" multiple onChange={addFiles} className="hidden" />
      </label>

      {tracks.length > 0 && (
        <>
          <audio
            ref={audioRef}
            src={tracks[current]?.url}
            onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => { setDuration(audioRef.current?.duration || 0); if (playing) audioRef.current?.play(); }}
            onEnded={next}
          />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5 space-y-4">
            <div className="text-center">
              <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 3, repeat: playing ? Infinity : 0, ease: "linear" }} className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Volume2 className="h-8 w-8 text-primary" />
              </motion.div>
              <p className="font-bold text-sm">{tracks[current]?.name}</p>
              <p className="text-xs text-muted-foreground">Track {current + 1} of {tracks.length}</p>
            </div>
            <div className="space-y-1">
              <input type="range" min={0} max={duration || 1} value={progress} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = +e.target.value; }} className="w-full" />
              <div className="flex justify-between text-[10px] text-muted-foreground"><span>{fmt(progress)}</span><span>{fmt(duration)}</span></div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button size="icon" variant="ghost" onClick={prev}><SkipBack className="h-5 w-5" /></Button>
              <Button size="icon" onClick={toggle} className="h-12 w-12 rounded-full">{playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}</Button>
              <Button size="icon" variant="ghost" onClick={next}><SkipForward className="h-5 w-5" /></Button>
            </div>
          </motion.div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {tracks.map((t, i) => (
              <div key={i} onClick={() => { setCurrent(i); setPlaying(true); }} className={`cursor-pointer rounded-lg p-2 text-xs transition-colors ${i === current ? "bg-primary/10 font-bold" : "hover:bg-accent"}`}>
                🎵 {t.name}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MusicPlayer;
