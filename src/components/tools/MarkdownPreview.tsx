import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

const sample = `# Hello World\n\n**Bold** and *italic* text.\n\n- List item 1\n- List item 2\n\n> Blockquote here\n\n\`code snippet\`\n\n[Link](https://example.com)`;

const MarkdownPreview: React.FC = () => {
  const [md, setMd] = useState(sample);

  const render = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-sm">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-3 italic text-muted-foreground">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <label className="mb-1 block text-sm font-medium">Markdown</label>
          <Textarea value={md} onChange={(e) => setMd(e.target.value)} rows={12} className="font-mono text-sm" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <label className="mb-1 block text-sm font-medium">Preview</label>
          <div className="min-h-[280px] rounded-xl border bg-card p-4 prose-sm" dangerouslySetInnerHTML={{ __html: render(md) }} />
        </motion.div>
      </div>
    </div>
  );
};

export default MarkdownPreview;
