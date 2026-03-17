import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Check } from "lucide-react";

const PasswordGenerator: React.FC = () => {
  const { t } = useI18n();
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (digits) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()-_=+[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, (v) => chars[v % chars.length]).join(""));
    setCopied(false);
  }, [length, upper, lower, digits, symbols]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {password && (
        <div className="flex items-center gap-2 rounded-lg border bg-accent/50 p-3">
          <code className="flex-1 break-all font-english text-sm tabular-nums">{password}</code>
          <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">
          ប្រវែង: <span className="font-english tabular-nums">{length}</span>
        </label>
        <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="flex-1 accent-primary" />
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        {[
          { label: "A-Z", state: upper, set: setUpper },
          { label: "a-z", state: lower, set: setLower },
          { label: "0-9", state: digits, set: setDigits },
          { label: "!@#$", state: symbols, set: setSymbols },
        ].map((opt) => (
          <label key={opt.label} className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={opt.state} onChange={() => opt.set(!opt.state)} className="accent-primary" />
            <span className="font-english">{opt.label}</span>
          </label>
        ))}
      </div>

      <Button onClick={generate} className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        {t.generate}
      </Button>
    </div>
  );
};

export default PasswordGenerator;
