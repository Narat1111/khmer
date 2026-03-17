import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Save, Trash2 } from "lucide-react";

interface JournalEntry { id: string; date: string; title: string; content: string; }

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  const save = () => {
    if (!content.trim()) return;
    setEntries([{ id: Date.now().toString(), date: new Date().toLocaleDateString(), title: title || "Untitled", content }, ...entries]);
    setTitle(""); setContent("");
  };

  const entry = entries.find((e) => e.id === viewing);

  if (entry) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <Button variant="ghost" onClick={() => setViewing(null)}>← Back</Button>
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h3 className="font-bold">{entry.title}</h3>
          <p className="text-xs text-muted-foreground">{entry.date}</p>
          <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title..." className="w-full rounded-xl border bg-background px-3 py-2 text-sm font-bold outline-none" />
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your thoughts..." rows={6} />
      <Button onClick={save} className="w-full gap-2"><Save className="h-4 w-4" /> Save Entry</Button>
      {entries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-muted-foreground">Journal Entries ({entries.length})</h4>
          {entries.map((e) => (
            <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setViewing(e.id)} className="cursor-pointer rounded-lg border bg-card p-3 hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{e.title}</p>
                <button onClick={(ev) => { ev.stopPropagation(); setEntries(entries.filter((x) => x.id !== e.id)); }} className="text-destructive"><Trash2 className="h-3 w-3" /></button>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{e.date} • {e.content.substring(0, 50)}...</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Journal;
