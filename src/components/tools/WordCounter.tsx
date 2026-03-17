import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

const WordCounter: React.FC = () => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim() ? text.split(/[.!?។]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0;

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("បានចម្លង!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const report = `Word Count Report\n${"=".repeat(30)}\nWords: ${words}\nCharacters: ${chars}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\n\n--- Text ---\n${text}`;
    const blob = new Blob([report], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "word-count-report.txt";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("ទាញយកជោគជ័យ!");
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="វាយអត្ថបទនៅទីនេះ..." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "ពាក្យ", value: words },
          { label: "អក្សរ", value: chars },
          { label: "ប្រយោគ", value: sentences },
          { label: "កថាខណ្ឌ", value: paragraphs },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-accent/50 p-3 text-center">
            <div className="font-english text-2xl font-bold tabular-nums text-primary">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
      {text && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyText} className="flex-1 gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "បានចម្លង" : "ចម្លង"}
          </Button>
          <Button variant="outline" onClick={downloadReport} className="flex-1 gap-2">
            <Download className="h-4 w-4" /> ទាញយក
          </Button>
        </div>
      )}
    </div>
  );
};

export default WordCounter;
