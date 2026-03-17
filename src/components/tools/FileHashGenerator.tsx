import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Check } from "lucide-react";

const FileHashGenerator: React.FC = () => {
  const { t } = useI18n();
  const [hashes, setHashes] = useState<{ algo: string; hash: string }[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setLoading(true);
    const buffer = await file.arrayBuffer();
    const algos = ["SHA-1", "SHA-256", "SHA-512"];
    const results = await Promise.all(
      algos.map(async (algo) => {
        const hashBuffer = await crypto.subtle.digest(algo, buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return { algo, hash: hashArray.map((b) => b.toString(16).padStart(2, "0")).join("") };
      })
    );
    setHashes(results);
    setLoading(false);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(hash);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-accent/50"
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{fileName || "ជ្រើសរើសឯកសារ"}</p>
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

      {loading && <p className="text-center text-sm text-muted-foreground">{t.loading}</p>}

      {hashes.length > 0 && (
        <div className="space-y-2">
          {hashes.map((h) => (
            <div key={h.algo} className="rounded-lg border bg-accent/50 p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground font-english">{h.algo}</span>
                <button onClick={() => copyHash(h.hash)} className="text-muted-foreground hover:text-foreground">
                  {copied === h.hash ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <code className="block break-all font-english text-xs">{h.hash}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileHashGenerator;
