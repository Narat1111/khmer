import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

const Base64Encoder: React.FC = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(t.error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("បានចម្លង!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `base64-${mode}d.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("ទាញយកជោគជ័យ!");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${mode === "encode" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${mode === "decode" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
        >
          Decode
        </button>
      </div>

      <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder="វាយអត្ថបទនៅទីនេះ..." />
      
      <Button onClick={convert} className="w-full">{t.convert}</Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {output && (
        <div className="space-y-2">
          <div className="rounded-lg border bg-accent/50 p-3">
            <code className="block break-all font-english text-sm">{output}</code>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="flex-1 gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t.copied : t.copy}
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex-1 gap-2">
              <Download className="h-4 w-4" /> {t.download}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Base64Encoder;
