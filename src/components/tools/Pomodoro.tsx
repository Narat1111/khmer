import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

const MODES = [
  { label: "Focus", minutes: 25, color: "text-destructive" },
  { label: "Short Break", minutes: 5, color: "text-green-500" },
  { label: "Long Break", minutes: 15, color: "text-primary" },
];

const Pomodoro: React.FC = () => {
  const [mode, setMode] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            setSessions((p) => p + (mode === 0 ? 1 : 0));
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const switchMode = (i: number) => { setMode(i); setSeconds(MODES[i].minutes * 60); setRunning(false); };
  const total = MODES[mode].minutes * 60;
  const progress = ((total - seconds) / total) * 100;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        {MODES.map((m, i) => (
          <motion.button key={m.label} whileTap={{ scale: 0.95 }} onClick={() => switchMode(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${mode === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >{m.label}</motion.button>
        ))}
      </div>
      <div className="relative flex h-52 w-52 items-center justify-center">
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
          <motion.circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="4"
            strokeDasharray={283} strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round" transform="rotate(-90 50 50)" />
        </svg>
        <span className={`text-5xl font-bold font-english tabular-nums ${MODES[mode].color}`}>{mm}:{ss}</span>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => setRunning(!running)} size="lg">
          {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button variant="outline" size="lg" onClick={() => { setSeconds(MODES[mode].minutes * 60); setRunning(false); }}>
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">🍅 Sessions: <span className="font-bold">{sessions}</span></p>
    </div>
  );
};

export default Pomodoro;
