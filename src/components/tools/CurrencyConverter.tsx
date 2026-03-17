import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const popular = ["USD", "KHR", "THB", "EUR", "GBP", "JPY", "CNY", "AUD"];

const CurrencyConverter: React.FC = () => {
  const { t } = useI18n();
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KHR");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((d) => { setRates(d.rates); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!rates) return <p className="text-center text-muted-foreground">{t.error}</p>;

  const numAmount = parseFloat(amount) || 0;
  const result = (numAmount / (rates[from] || 1)) * (rates[to] || 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-english">
            {popular.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="font-english tabular-nums" />
        </div>
        <div className="space-y-2">
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-english">
            {popular.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center rounded-lg border bg-accent/50 px-3 py-2">
            <span className="font-english tabular-nums text-sm">{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-english">
        1 {from} = {((rates[to] || 1) / (rates[from] || 1)).toLocaleString(undefined, { maximumFractionDigits: 4 })} {to}
      </p>
    </div>
  );
};

export default CurrencyConverter;
