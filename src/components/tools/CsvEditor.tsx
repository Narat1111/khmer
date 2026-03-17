import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, Trash2, Download } from "lucide-react";

const CsvEditor: React.FC = () => {
  const [headers, setHeaders] = useState(["Name", "Age", "City"]);
  const [rows, setRows] = useState([["Dara", "20", "Phnom Penh"], ["Sokha", "25", "Siem Reap"]]);

  const addRow = () => setRows([...rows, headers.map(() => "")]);
  const addCol = () => { setHeaders([...headers, `Col ${headers.length + 1}`]); setRows(rows.map((r) => [...r, ""])); };
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  const updateCell = (ri: number, ci: number, val: string) => {
    const nr = [...rows]; nr[ri] = [...nr[ri]]; nr[ri][ci] = val; setRows(nr);
  };

  const updateHeader = (ci: number, val: string) => { const nh = [...headers]; nh[ci] = val; setHeaders(nh); };

  const download = () => {
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "data.csv"; a.click();
  };

  const importCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = (reader.result as string).split("\n").filter(Boolean);
      if (lines.length > 0) { setHeaders(lines[0].split(",")); setRows(lines.slice(1).map((l) => l.split(","))); }
    };
    reader.readAsText(f);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={addRow} className="gap-1"><Plus className="h-3 w-3" /> Row</Button>
        <Button size="sm" variant="outline" onClick={addCol} className="gap-1"><Plus className="h-3 w-3" /> Column</Button>
        <Button size="sm" variant="secondary" onClick={download} className="gap-1"><Download className="h-3 w-3" /> Export</Button>
        <label className="cursor-pointer">
          <Button size="sm" variant="outline" asChild><span>📂 Import</span></Button>
          <input type="file" accept=".csv" onChange={importCsv} className="hidden" />
        </label>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted">
            {headers.map((h, ci) => <th key={ci} className="p-1"><Input value={h} onChange={(e) => updateHeader(ci, e.target.value)} className="h-7 text-xs font-bold text-center" /></th>)}
            <th className="w-8" />
          </tr></thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t">
                {row.map((cell, ci) => <td key={ci} className="p-1"><Input value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} className="h-7 text-xs" /></td>)}
                <td className="p-1"><button onClick={() => removeRow(ri)} className="text-destructive hover:text-destructive/70"><Trash2 className="h-3 w-3" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CsvEditor;
