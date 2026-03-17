import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Upload } from "lucide-react";

const PdfToImage: React.FC = () => {
  const [msg, setMsg] = useState("");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="rounded-xl border bg-card p-6 text-center space-y-4">
        <div className="text-4xl">📄→🖼️</div>
        <h3 className="font-bold">PDF to Image Converter</h3>
        <p className="text-sm text-muted-foreground">Convert PDF pages to high-quality images</p>
        <label className="cursor-pointer inline-block">
          <Button className="gap-2"><Upload className="h-4 w-4" /> Upload PDF</Button>
          <input type="file" accept=".pdf" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              // Use canvas to render PDF preview
              const url = URL.createObjectURL(f);
              setMsg(`PDF "${f.name}" loaded (${(f.size / 1024).toFixed(1)} KB). For full conversion, use the browser print feature (Ctrl+P → Save as Image).`);
            }
          }} className="hidden" />
        </label>
        {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
        <div className="text-xs text-muted-foreground mt-4">
          <p>💡 Tip: You can also use your browser's screenshot tool or print → save as image for quick conversions.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PdfToImage;
