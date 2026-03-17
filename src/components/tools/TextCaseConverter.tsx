import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

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
    toast.success("បានចម្លង!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "converted-text.txt";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("ទាញយកជោគជ័យ!");
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
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCopy} disabled={!text} className="flex-1 gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t.copied : t.copy}
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!text} className="flex-1 gap-2">
          <Download className="h-4 w-4" /> {t.download}
        </Button>
      </div>
    </div>
  );
};

export default TextCaseConverter;
