import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GitBranch } from "lucide-react";

interface MindNode { id: string; text: string; children: string[]; color: string; }

const colors = ["hsl(var(--primary))", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

const MindMap: React.FC = () => {
  const [nodes, setNodes] = useState<MindNode[]>([
    { id: "root", text: "Main Idea", children: [], color: colors[0] },
  ]);
  const [selected, setSelected] = useState("root");
  const [newText, setNewText] = useState("");

  const addChild = () => {
    if (!newText.trim()) return;
    const id = `node-${Date.now()}`;
    const color = colors[nodes.length % colors.length];
    setNodes((prev) => [
      ...prev.map((n) => n.id === selected ? { ...n, children: [...n.children, id] } : n),
      { id, text: newText, children: [], color },
    ]);
    setNewText("");
  };

  const removeNode = (id: string) => {
    if (id === "root") return;
    const getDescendants = (nodeId: string): string[] => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return [];
      return [nodeId, ...node.children.flatMap(getDescendants)];
    };
    const toRemove = new Set(getDescendants(id));
    setNodes((prev) => prev.filter((n) => !toRemove.has(n.id)).map((n) => ({ ...n, children: n.children.filter((c) => !toRemove.has(c)) })));
    if (selected === id) setSelected("root");
  };

  const renderNode = (id: string, depth = 0) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return null;
    return (
      <motion.div key={id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4" style={{ marginLeft: depth * 16 }}>
        <div
          className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-all ${selected === id ? "ring-2 ring-primary" : "hover:bg-accent"}`}
          onClick={() => setSelected(id)}
        >
          <GitBranch className="h-3 w-3" style={{ color: node.color }} />
          <span className="text-sm font-medium">{node.text}</span>
          {id !== "root" && (
            <button onClick={(e) => { e.stopPropagation(); removeNode(id); }} className="ml-auto text-destructive hover:text-destructive/80">
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
        {node.children.map((childId) => renderNode(childId, depth + 1))}
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex gap-2">
        <Input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Add branch to selected node..." onKeyDown={(e) => e.key === "Enter" && addChild()} />
        <Button onClick={addChild} className="gap-1"><Plus className="h-4 w-4" /> Add</Button>
      </div>
      <p className="text-xs text-muted-foreground">Selected: <strong>{nodes.find((n) => n.id === selected)?.text}</strong></p>
      <div className="rounded-xl border bg-card p-4 space-y-1 min-h-[300px]">
        {renderNode("root")}
      </div>
    </motion.div>
  );
};

export default MindMap;
