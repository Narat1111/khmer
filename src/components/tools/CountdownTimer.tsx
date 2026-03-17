import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CountdownTimer: React.FC = () => {
  const [target, setTarget] = useState("");
  const [label, setLabel] = useState("My Event");
  const [diff, setDiff] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const ms = new Date(target).getTime() - Date.now();
      if (ms <= 0) { setDiff({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setDiff({ d: Math.floor(ms / 86400000), h: Math.floor((ms % 86400000) / 3600000), m: Math.floor((ms % 3600000) / 60000), s: Math.floor((ms % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-3 sm:grid-cols-2">
        <div><label className="mb-1 block text-sm font-medium">Event Name</label><Input value={label} onChange={(e) => setLabel(e.target.value)} /></div>
        <div><label className="mb-1 block text-sm font-medium">Target Date & Time</label><Input type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} /></div>
      </motion.div>
      {diff && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <p className="mb-4 text-lg font-bold">{label}</p>
          <div className="flex justify-center gap-3">
            {[
              { v: diff.d, l: "Days" },
              { v: diff.h, l: "Hours" },
              { v: diff.m, l: "Minutes" },
              { v: diff.s, l: "Seconds" },
            ].map((item, i) => (
              <motion.div key={i} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="rounded-2xl border bg-card p-4 min-w-[70px]">
                <p className="text-3xl font-bold font-english">{String(item.v).padStart(2, "0")}</p>
                <p className="text-xs text-muted-foreground">{item.l}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CountdownTimer;
