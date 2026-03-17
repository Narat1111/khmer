import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const fields = [
  { label: "Minute", range: "0-59", values: ["*", "0", "15", "30", "*/5", "*/15"] },
  { label: "Hour", range: "0-23", values: ["*", "0", "6", "12", "18", "*/2"] },
  { label: "Day (month)", range: "1-31", values: ["*", "1", "15", "*/2"] },
  { label: "Month", range: "1-12", values: ["*", "1", "6", "*/3"] },
  { label: "Day (week)", range: "0-6", values: ["*", "0", "1-5", "6"] },
];

const describe = (parts: string[]): string => {
  const [min, hr, dom, mon, dow] = parts;
  let s = "Runs ";
  if (min === "*" && hr === "*") s += "every minute";
  else if (min.startsWith("*/")) s += `every ${min.slice(2)} minutes`;
  else if (hr === "*") s += `at minute ${min} of every hour`;
  else s += `at ${hr.padStart(2, "0")}:${min.padStart(2, "0")}`;
  if (dom !== "*") s += ` on day ${dom}`;
  if (mon !== "*") s += ` in month ${mon}`;
  if (dow === "1-5") s += " (weekdays)";
  else if (dow === "0" || dow === "6") s += ` (${dow === "0" ? "Sunday" : "Saturday"})`;
  else if (dow !== "*") s += ` on day-of-week ${dow}`;
  return s;
};

const CronParser: React.FC = () => {
  const [parts, setParts] = useState(["*", "*", "*", "*", "*"]);
  const cron = parts.join(" ");

  const update = (i: number, v: string) => { const np = [...parts]; np[i] = v; setParts(np); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="rounded-xl border bg-card p-4 text-center">
        <code className="text-lg font-bold font-mono text-primary">{cron}</code>
        <p className="text-xs text-muted-foreground mt-2">{describe(parts)}</p>
      </div>
      <div className="space-y-3">
        {fields.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-bold w-24">{f.label} <span className="text-muted-foreground font-normal">({f.range})</span></span>
            <Input value={parts[i]} onChange={(e) => update(i, e.target.value)} className="w-20 text-center font-mono" />
            <div className="flex gap-1 flex-wrap">
              {f.values.map((v) => (
                <button key={v} onClick={() => update(i, v)} className={`rounded border px-2 py-0.5 text-[10px] transition-colors ${parts[i] === v ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{v}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CronParser;
