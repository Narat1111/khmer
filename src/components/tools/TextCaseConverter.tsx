import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const TextCaseConverter: React.FC = () => {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const cases = [
    { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
    { label: "lowercase", fn: (s: string) => s.toLowerCase() },
    { label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
    { label: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { label: "snake_case", fn: (s: string) => s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") },
  ];

  const apply = (fn: (s: string) => string) => {
    setText(fn(text));
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={(e) => { setText(e.target.value); setCopied(false); }} rows={5} placeholder="វាយអត្ថបទនៅទីនេះ..." />
      <div className="flex flex-wrap gap-2">
        {cases.map((c) => (
          <Button key={c.label} variant="outline" size="sm" onClick={() => apply(c.fn)} className="font-english text-xs">
            {c.label}
          </Button>
        ))}
      </div>
      <Button variant="outline" onClick={handleCopy} disabled={!text} className="w-full gap-2">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? t.copied : t.copy}
      </Button>
    </div>
  );
};

export default TextCaseConverter;
