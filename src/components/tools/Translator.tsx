import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightLeft, Loader2, Copy, Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "km", name: "ខ្មែរ" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
];

const Translator: React.FC = () => {
  const [text, setText] = useState("");
  const [from, setFrom] = useState("en");
  const [to, setTo] = useState("km");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
      const data = await res.json();
      setResult(data.responseData?.translatedText || "Translation failed");
    } catch {
      setResult("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => { setFrom(to); setTo(from); setText(result); setResult(text); };
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1 rounded-lg border bg-card p-2 text-sm">
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <motion.button whileTap={{ rotate: 180 }} onClick={swap} className="rounded-full border p-2 hover:bg-accent">
          <ArrowRightLeft className="h-4 w-4" />
        </motion.button>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 rounded-lg border bg-card p-2 text-sm">
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to translate..."
        className="h-28 w-full rounded-xl border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
      <Button onClick={translate} disabled={loading || !text.trim()} className="w-full">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Translating...</> : "Translate"}
      </Button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-xl border bg-muted p-4">
          <p className="text-sm">{result}</p>
          <button onClick={copy} className="absolute right-2 top-2 rounded-md border bg-card p-1.5 hover:bg-accent">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Translator;
