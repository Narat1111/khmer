import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw } from "lucide-react";

const StopwatchTimer: React.FC = () => {
  const { t } = useI18n();
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    const startTime = Date.now() - time;
    intervalRef.current = window.setInterval(() => {
      setTime(Date.now() - startTime);
    }, 10);
  }, [running, time]);

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    stop();
    setTime(0);
    setLaps([]);
  };

  const lap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="font-english text-6xl font-bold tabular-nums tracking-tight text-foreground">
          {fmt(time)}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!running ? (
          <Button onClick={start} className="gap-2">
            <Play className="h-4 w-4" />
            {t.start}
          </Button>
        ) : (
          <>
            <Button onClick={stop} variant="destructive" className="gap-2">
              <Square className="h-4 w-4" />
              {t.stop}
            </Button>
            <Button onClick={lap} variant="outline">Lap</Button>
          </>
        )}
        <Button onClick={reset} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {t.reset}
        </Button>
      </div>

      {laps.length > 0 && (
        <div className="space-y-1">
          {laps.map((l, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-1.5 text-sm">
              <span className="text-muted-foreground">Lap {laps.length - i}</span>
              <span className="font-english tabular-nums">{fmt(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StopwatchTimer;
