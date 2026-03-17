import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Check, Copy, Minimize2, Maximize2, Download } from "lucide-react";
import { toast } from "sonner";

const JSONFormatter: React.FC = () => {
  const { t } = useI18n();
  const [input, setInput] = useState('{"name":"DaraTool","version":"0.2","tools":["calculator","snake"]}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = (indent: number) => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e: any) { setError(e.message); }
  };

  const copy = () => { navigator.clipboard.writeText(output || input); setCopied(true); toast.success("បានចម្លង!"); setTimeout(() => setCopied(false), 2000); };

  const download = () => {
    const blob = new Blob([output || input], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("ទាញយកជោគជ័យ!");
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="h-40 w-full rounded-xl border bg-muted p-3 font-english text-sm outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Paste JSON here..." spellCheck={false} />
      </motion.div>
      <div className="flex gap-2">
        <Button onClick={() => format(2)} className="flex-1"><Maximize2 className="h-4 w-4" />Beautify</Button>
        <Button onClick={() => format(0)} variant="outline" className="flex-1"><Minimize2 className="h-4 w-4" />Minify</Button>
        <Button onClick={copy} variant="outline" size="icon">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button onClick={download} variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">❌ {error}</motion.p>}
      {output && (
        <motion.pre initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="max-h-64 overflow-auto rounded-xl border bg-card p-3 font-english text-sm">{output}</motion.pre>
      )}
    </div>
  );
};

export default JSONFormatter;
