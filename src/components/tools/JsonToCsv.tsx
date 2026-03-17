import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const JsonToCsv: React.FC = () => {
  const [json, setJson] = useState('[\n  {"name": "Dara", "age": 20, "city": "Phnom Penh"},\n  {"name": "Sokha", "age": 25, "city": "Siem Reap"}\n]');
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data) || data.length === 0) { setError("JSON must be an array of objects"); return; }
      const headers = Object.keys(data[0]);
      const rows = data.map((row: any) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(","));
      setCsv([headers.join(","), ...rows].join("\n"));
    } catch { setError("Invalid JSON"); }
  };

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.csv";
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Textarea value={json} onChange={(e) => setJson(e.target.value)} rows={8} placeholder="Paste JSON array..." className="font-mono text-xs" />
      <Button onClick={convert} className="w-full">Convert to CSV</Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {csv && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <Textarea value={csv} readOnly rows={6} className="font-mono text-xs" />
          <Button variant="outline" onClick={downloadCsv} className="gap-2"><Download className="h-4 w-4" /> Download CSV</Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JsonToCsv;
