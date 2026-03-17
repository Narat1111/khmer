import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const filters: Record<string, { name: string; filter: string }> = {
  normal: { name: "Normal", filter: "none" },
  protanopia: { name: "Protanopia (Red-blind)", filter: "url(#protanopia)" },
  deuteranopia: { name: "Deuteranopia (Green-blind)", filter: "url(#deuteranopia)" },
  tritanopia: { name: "Tritanopia (Blue-blind)", filter: "url(#tritanopia)" },
  achromatopsia: { name: "Achromatopsia (Total)", filter: "grayscale(100%)" },
};

const ColorBlindness: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [active, setActive] = useState("normal");

  const load = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(f); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="protanopia"><feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" /></filter>
          <filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" /></filter>
          <filter id="tritanopia"><feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" /></filter>
        </defs>
      </svg>
      <Input type="file" accept="image/*" onChange={load} />
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([k, v]) => (
          <button key={k} onClick={() => setActive(k)} className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${active === k ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
            {v.name}
          </button>
        ))}
      </div>
      {image && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border overflow-hidden">
          <img src={image} alt="preview" className="w-full" style={{ filter: filters[active].filter }} />
        </motion.div>
      )}
      {!image && <p className="text-center py-10 text-sm text-muted-foreground">Upload an image to see color blindness simulations</p>}
    </motion.div>
  );
};

export default ColorBlindness;
