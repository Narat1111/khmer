import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Copy, Check } from "lucide-react";

const ColorPicker: React.FC = () => {
  const { t } = useI18n();
  const [color, setColor] = useState("#3b82f6");
  const [copied, setCopied] = useState("");

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 2000);
  };

  const formats = [
    { label: "HEX", value: color },
    { label: "RGB", value: hexToRgb(color) },
    { label: "HSL", value: hexToHsl(color) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-16 w-16 cursor-pointer rounded-lg border-0" />
        <div className="h-16 flex-1 rounded-lg border" style={{ backgroundColor: color }} />
      </div>

      <div className="space-y-2">
        {formats.map((f) => (
          <div key={f.label} className="flex items-center gap-2 rounded-lg border bg-accent/50 p-2">
            <span className="w-10 text-xs font-medium text-muted-foreground font-english">{f.label}</span>
            <code className="flex-1 font-english text-sm">{f.value}</code>
            <button onClick={() => copyValue(f.value)} className="text-muted-foreground hover:text-foreground">
              {copied === f.value ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
