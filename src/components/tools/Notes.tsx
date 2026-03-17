import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";

interface Note { id: string; title: string; content: string; date: string; }

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem("daratool-notes") || "[]"); } catch { return []; }
  });
  const [active, setActive] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => { localStorage.setItem("daratool-notes", JSON.stringify(notes)); }, [notes]);

  const saveNote = () => {
    if (!title.trim()) return;
    if (active) {
      setNotes(notes.map((n) => n.id === active ? { ...n, title, content, date: new Date().toLocaleString() } : n));
    } else {
      setNotes([{ id: Date.now().toString(), title, content, date: new Date().toLocaleString() }, ...notes]);
    }
    setActive(null); setTitle(""); setContent("");
  };

  const editNote = (note: Note) => { setActive(note.id); setTitle(note.title); setContent(note.content); };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note..."
          className="h-32 w-full rounded-xl border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
        <div className="flex gap-2">
          <Button onClick={saveNote} className="flex-1"><Save className="h-4 w-4" />{active ? "Update" : "Save"}</Button>
          {active && <Button variant="outline" onClick={() => { setActive(null); setTitle(""); setContent(""); }}>Cancel</Button>}
        </div>
      </motion.div>
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => editNote(note)} className="cursor-pointer rounded-xl border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-bold">{note.title}</h3>
              <button onClick={(e) => { e.stopPropagation(); setNotes(notes.filter((n) => n.id !== note.id)); }} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{note.content}</p>
            <p className="mt-2 text-xs text-muted-foreground">{note.date}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
