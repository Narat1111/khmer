import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";

const categories = {
  length: {
    km: "ប្រវែង",
    en: "Length",
    units: [
      { id: "m", label: "ម៉ែត្រ (m)", factor: 1 },
      { id: "km", label: "គម (km)", factor: 1000 },
      { id: "cm", label: "សម (cm)", factor: 0.01 },
      { id: "mm", label: "មម (mm)", factor: 0.001 },
      { id: "ft", label: "ហ្វីត (ft)", factor: 0.3048 },
      { id: "in", label: "អ៊ីន (in)", factor: 0.0254 },
      { id: "mi", label: "ម៉ាយ (mi)", factor: 1609.34 },
    ],
  },
  weight: {
    km: "ទម្ងន់",
    en: "Weight",
    units: [
      { id: "kg", label: "គក (kg)", factor: 1 },
      { id: "g", label: "ក្រ (g)", factor: 0.001 },
      { id: "mg", label: "មក (mg)", factor: 0.000001 },
      { id: "lb", label: "ផោន (lb)", factor: 0.453592 },
      { id: "oz", label: "អោន (oz)", factor: 0.0283495 },
    ],
  },
  temperature: {
    km: "សីតុណ្ហភាព",
    en: "Temperature",
    units: [
      { id: "c", label: "°C", factor: 0 },
      { id: "f", label: "°F", factor: 0 },
      { id: "k", label: "K", factor: 0 },
    ],
  },
};

function convertTemp(val: number, from: string, to: string): number {
  let celsius = from === "c" ? val : from === "f" ? (val - 32) * 5 / 9 : val - 273.15;
  if (to === "c") return celsius;
  if (to === "f") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

const UnitConverter: React.FC = () => {
  const { lang } = useI18n();
  const [cat, setCat] = useState<keyof typeof categories>("length");
  const [from, setFrom] = useState(categories[cat].units[0].id);
  const [to, setTo] = useState(categories[cat].units[1].id);
  const [value, setValue] = useState("1");

  const current = categories[cat];
  const numVal = parseFloat(value) || 0;

  let result: number;
  if (cat === "temperature") {
    result = convertTemp(numVal, from, to);
  } else {
    const fromUnit = current.units.find((u) => u.id === from)!;
    const toUnit = current.units.find((u) => u.id === to)!;
    result = (numVal * fromUnit.factor) / toUnit.factor;
  }

  const handleCatChange = (newCat: keyof typeof categories) => {
    setCat(newCat);
    setFrom(categories[newCat].units[0].id);
    setTo(categories[newCat].units[1].id);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.entries(categories).map(([key, c]) => (
          <button
            key={key}
            onClick={() => handleCatChange(key as keyof typeof categories)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${cat === key ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}
          >
            {lang === "km" ? c.km : c.en}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
            {current.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
          <Input value={value} onChange={(e) => setValue(e.target.value)} type="number" className="font-english tabular-nums" />
        </div>
        <div className="space-y-2">
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
            {current.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
          <div className="flex items-center rounded-lg border bg-accent/50 px-3 py-2">
            <span className="font-english tabular-nums text-sm">{result.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
