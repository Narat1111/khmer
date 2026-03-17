import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

interface Task { id: string; text: string; column: string; }

const KanbanBoard: React.FC = () => {
  const columns = ["To Do", "In Progress", "Done"];
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Design homepage", column: "To Do" },
    { id: "2", text: "Write API", column: "In Progress" },
    { id: "3", text: "Deploy app", column: "Done" },
  ]);
  const [newTask, setNewTask] = useState("");

  const add = () => { if (!newTask.trim()) return; setTasks([...tasks, { id: Date.now().toString(), text: newTask, column: "To Do" }]); setNewTask(""); };
  const move = (id: string, dir: number) => {
    setTasks(tasks.map((t) => {
      if (t.id !== id) return t;
      const ci = columns.indexOf(t.column);
      const ni = Math.max(0, Math.min(columns.length - 1, ci + dir));
      return { ...t, column: columns[ni] };
    }));
  };
  const remove = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex gap-2">
        <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task..." onKeyDown={(e) => e.key === "Enter" && add()} />
        <Button onClick={add}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col) => (
          <div key={col} className="rounded-xl border bg-card p-2 min-h-[200px]">
            <h4 className="text-xs font-bold text-center mb-2 pb-1 border-b">{col} ({tasks.filter((t) => t.column === col).length})</h4>
            <div className="space-y-1">
              {tasks.filter((t) => t.column === col).map((t) => (
                <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-background p-2 text-xs">
                  <p className="font-medium mb-1">{t.text}</p>
                  <div className="flex gap-1">
                    {columns.indexOf(col) > 0 && <button onClick={() => move(t.id, -1)} className="text-[10px] text-muted-foreground hover:text-foreground">←</button>}
                    {columns.indexOf(col) < 2 && <button onClick={() => move(t.id, 1)} className="text-[10px] text-muted-foreground hover:text-foreground">→</button>}
                    <button onClick={() => remove(t.id)} className="ml-auto text-destructive"><Trash2 className="h-2.5 w-2.5" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default KanbanBoard;
