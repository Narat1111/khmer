import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const moods = ["😄", "🙂", "😐", "😟", "😢"];
const moodLabels = ["Great", "Good", "Okay", "Bad", "Terrible"];

interface Entry { date: string; mood: number; note: string; }

const MoodTracker: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const save = () => {
    if (selected === null) return;
    setEntries([{ date: new Date().toLocaleDateString(), mood: selected, note }, ...entries]);
    setSelected(null); setNote("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-bold mb-3">How are you feeling today?</p>
        <div className="flex justify-center gap-3">
          {moods.map((m, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(i)}
              className={`text-3xl transition-all ${selected === i ? "scale-125 drop-shadow-lg" : "opacity-60 hover:opacity-100"}`}
            >{m}</motion.button>
          ))}
        </div>
        {selected !== null && <p className="mt-2 text-xs text-primary font-bold">{moodLabels[selected]}</p>}
      </div>
      {selected !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)..." className="w-full rounded-xl border bg-background p-3 text-sm outline-none resize-none" rows={2} />
          <Button onClick={save} className="w-full">Save Mood</Button>
        </motion.div>
      )}
      {entries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground">History</h4>
          {entries.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 rounded-lg border bg-card p-2">
              <span className="text-xl">{moods[e.mood]}</span>
              <div className="flex-1"><p className="text-xs font-bold">{moodLabels[e.mood]}</p>{e.note && <p className="text-[10px] text-muted-foreground">{e.note}</p>}</div>
              <span className="text-[10px] text-muted-foreground">{e.date}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MoodTracker;
