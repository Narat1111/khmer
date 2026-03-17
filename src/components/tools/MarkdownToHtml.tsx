import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const MarkdownToHtml: React.FC = () => {
  const [md, setMd] = useState("# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item 1\n- Item 2\n\n```js\nconsole.log('hello');\n```");
  const [tab, setTab] = useState<"preview" | "html">("preview");

  const toHtml = () => {
    const div = document.createElement("div");
    div.innerHTML = document.getElementById("md-preview")?.innerHTML || "";
    return div.innerHTML;
  };

  const copy = () => { navigator.clipboard.writeText(toHtml()); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Textarea value={md} onChange={(e) => setMd(e.target.value)} rows={8} placeholder="Write Markdown..." className="font-mono text-xs" />
      <div className="flex gap-2">
        <Button size="sm" variant={tab === "preview" ? "default" : "outline"} onClick={() => setTab("preview")}>Preview</Button>
        <Button size="sm" variant={tab === "html" ? "default" : "outline"} onClick={() => setTab("html")}>HTML</Button>
        <Button size="sm" variant="secondary" onClick={copy}>📋 Copy HTML</Button>
      </div>
      <div className="rounded-xl border bg-card p-4 min-h-[200px]">
        {tab === "preview" ? (
          <div id="md-preview" className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{md}</ReactMarkdown></div>
        ) : (
          <pre className="text-xs font-mono whitespace-pre-wrap break-all text-muted-foreground">{document.getElementById("md-preview")?.innerHTML || "Switch to Preview first"}</pre>
        )}
      </div>
    </motion.div>
  );
};

export default MarkdownToHtml;
