import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dice5, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const RandomNumber: React.FC = () => {
  const { t } = useI18n();
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const lo = parseInt(min) || 0;
    const hi = parseInt(max) || 100;
    const n = Math.min(parseInt(count) || 1, 100);
    const nums: number[] = [];
    for (let i = 0; i < n; i++) {
      nums.push(Math.floor(Math.random() * (hi - lo + 1)) + lo);
    }
    setResults(nums);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join(", "));
    setCopied(true);
    toast.success("Copied: " + results.join(", "));
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">អប្បបរមា</label>
          <Input value={min} onChange={(e) => setMin(e.target.value)} type="number" className="font-english tabular-nums" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">អតិបរមា</label>
          <Input value={max} onChange={(e) => setMax(e.target.value)} type="number" className="font-english tabular-nums" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">ចំនួន</label>
          <Input value={count} onChange={(e) => setCount(e.target.value)} type="number" className="font-english tabular-nums" />
        </div>
      </div>

      <Button onClick={generate} className="w-full gap-2">
        <Dice5 className="h-4 w-4" />
        {t.generate}
      </Button>

      {results.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {results.map((n, i) => (
              <div key={i} className="rounded-lg border bg-accent/50 px-4 py-2 font-english text-lg font-bold tabular-nums text-primary">
                {n}
              </div>
            ))}
          </div>
          <Button onClick={copyResults} variant="outline" className="w-full gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Results"}
          </Button>
        </>
      )}
    </div>
  );
};

export default RandomNumber;
