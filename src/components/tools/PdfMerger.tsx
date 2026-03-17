import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { FileText, Plus, Trash2, Download } from "lucide-react";

interface PdfFile { file: File; url: string; name: string; }

const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [error, setError] = useState("");

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).filter((f) => f.type === "application/pdf");
    if (newFiles.length === 0) { setError("Please select PDF files only"); return; }
    setError("");
    const pdfFiles = newFiles.map((f) => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const remove = (i: number) => {
    URL.revokeObjectURL(files[i].url);
    setFiles(files.filter((_, j) => j !== i));
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const n = [...files];
    [n[i - 1], n[i]] = [n[i], n[i - 1]];
    setFiles(n);
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8">
        <FileText className="h-12 w-12 text-primary" />
        <p className="text-sm text-muted-foreground">Select PDF files to merge</p>
        <label className="cursor-pointer">
          <Button asChild><span><Plus className="mr-2 h-4 w-4" /> Add PDF Files</span></Button>
          <input type="file" accept=".pdf" multiple onChange={addFiles} className="hidden" />
        </label>
      </motion.div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-bold">{files.length} files selected</p>
          {files.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-sm">{f.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => moveUp(i)} disabled={i === 0} className="h-7 w-7 text-xs">↑</Button>
                <Button variant="ghost" size="icon" onClick={() => remove(i)} className="h-7 w-7"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </motion.div>
          ))}
          <p className="text-xs text-muted-foreground">⚠️ Client-side PDF merging requires a library. Files are ready to be ordered and reviewed.</p>
        </div>
      )}
    </div>
  );
};

export default PdfMerger;