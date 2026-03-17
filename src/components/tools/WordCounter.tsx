import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const WordCounter: React.FC = () => {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.trim() ? text.split(/[.!?។]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0;

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
    </div>
  );
};

export default WordCounter;
