import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react";

interface Interval { label: string; seconds: number; }

const TimerIntervals: React.FC = () => {
  const [intervals, setIntervals] = useState<Interval[]>([
    { label: "Work", seconds: 30 },
    { label: "Rest", seconds: 10 },
  ]);
  const [running, setRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [rounds, setRounds] = useState(0);
  const [newLabel, setNewLabel] = useState("");
  const [newSec, setNewSec] = useState("30");
  const audioRef = useRef<AudioContext | null>(null);

  const beep = () => {
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const osc = audioRef.current.createOscillator();
      osc.connect(audioRef.current.destination);
      osc.frequency.value = 800;
      osc.start(); setTimeout(() => osc.stop(), 200);
    } catch {}
  };

  useEffect(() => {
    if (!running || intervals.length === 0) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          beep();
          const next = (currentIdx + 1) % intervals.length;
          if (next === 0) setRounds((r) => r + 1);
          setCurrentIdx(next);
          return intervals[next].seconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, currentIdx, intervals]);

  const start = () => { setTimeLeft(intervals[0]?.seconds || 0); setCurrentIdx(0); setRounds(0); setRunning(true); };
  const addInterval = () => { if (!newLabel.trim()) return; setIntervals([...intervals, { label: newLabel, seconds: +newSec || 30 }]); setNewLabel(""); setNewSec("30"); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {running ? (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-xl border bg-card p-6 text-center space-y-3">
          <p className="text-xs text-muted-foreground">Round {rounds + 1}</p>
          <p className="text-sm font-bold text-primary">{intervals[currentIdx]?.label}</p>
          <motion.p key={timeLeft} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-5xl font-bold tabular-nums">{timeLeft}s</motion.p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => setRunning(false)} variant="outline"><Pause className="h-4 w-4" /></Button>
            <Button onClick={() => { setRunning(false); setTimeLeft(intervals[0]?.seconds || 0); setCurrentIdx(0); }} variant="destructive"><RotateCcw className="h-4 w-4" /></Button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="space-y-2">
            {intervals.map((int, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border bg-card p-2 text-xs">
                <span className="font-bold flex-1">{int.label}</span>
                <span className="text-muted-foreground">{int.seconds}s</span>
                <button onClick={() => setIntervals(intervals.filter((_, idx) => idx !== i))} className="text-destructive"><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label..." className="flex-1" />
            <Input type="number" value={newSec} onChange={(e) => setNewSec(e.target.value)} className="w-16" />
            <Button size="sm" onClick={addInterval}><Plus className="h-4 w-4" /></Button>
          </div>
          <Button onClick={start} disabled={intervals.length === 0} className="w-full gap-2"><Play className="h-4 w-4" /> Start Intervals</Button>
        </>
      )}
    </motion.div>
  );
};

export default TimerIntervals;
