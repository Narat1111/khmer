import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check } from "lucide-react";

interface Todo { id: string; text: string; done: boolean; }

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try { return JSON.parse(localStorage.getItem("daratool-todos") || "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");

  useEffect(() => { localStorage.setItem("daratool-todos", JSON.stringify(todos)); }, [todos]);

  const add = () => {
    if (!input.trim()) return;
    setTodos([{ id: Date.now().toString(), text: input.trim(), done: false }, ...todos]);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a task..." onKeyDown={(e) => e.key === "Enter" && add()} />
        <Button onClick={add} size="icon"><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="text-xs text-muted-foreground">{todos.filter((t) => t.done).length}/{todos.length} completed</div>
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div key={todo.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
            className="flex items-center gap-3 rounded-xl border bg-card p-3"
          >
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setTodos(todos.map((t) => t.id === todo.id ? { ...t, done: !t.done } : t))}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${todo.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
            >
              {todo.done && <Check className="h-3 w-3" />}
            </motion.button>
            <span className={`flex-1 text-sm ${todo.done ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
            <button onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {todos.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">✨ No tasks yet</p>}
    </div>
  );
};

export default TodoList;
