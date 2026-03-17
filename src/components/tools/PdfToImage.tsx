import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Upload, Image, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface PageImage {
  dataUrl: string;
  pageNum: number;
  width: number;
  height: number;
}

const PdfToImage: React.FC = () => {
  const [pages, setPages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPdfPages = useCallback(async (file: File) => {
    setLoading(true);
    setPages([]);
    setFileName(file.name.replace(".pdf", ""));

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Use pdf.js via CDN
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) {
        // Load pdf.js dynamically
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = () => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            resolve();
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const lib = (window as any).pdfjsLib;
      const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const results: PageImage[] = [];

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      for (let i = 1; i <= Math.min(totalPages, 20); i++) {
        const page = await pdf.getPage(i);
        const scale = 2; // High quality
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        results.push({
          dataUrl: canvas.toDataURL("image/png"),
          pageNum: i,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPages(results);
      toast.success(`បំប្លែង ${results.length} ទំព័រជោគជ័យ!`);
    } catch (err) {
      console.error(err);
      toast.error("មានបញ្ហាក្នុងការអាន PDF");
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPage = (page: PageImage) => {
    const a = document.createElement("a");
    a.href = page.dataUrl;
    a.download = `${fileName}-page-${page.pageNum}.png`;
    a.click();
    toast.success(`ទាញយកទំព័រ ${page.pageNum} ជោគជ័យ!`);
  };

  const downloadAll = () => {
    pages.forEach((page, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = page.dataUrl;
        a.download = `${fileName}-page-${page.pageNum}.png`;
        a.click();
      }, i * 300);
    });
    toast.success(`កំពុងទាញយក ${pages.length} រូបភាព...`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 hover:bg-accent/50 transition-colors">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">ជ្រើសរើសឯកសារ PDF</p>
          <p className="text-xs text-muted-foreground">រហូតដល់ 20 ទំព័រ • គុណភាពខ្ពស់ PNG</p>
        </div>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) renderPdfPages(f);
          }}
          className="hidden"
        />
      </label>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">កំពុងបំប្លែង PDF...</span>
        </div>
      )}

      {pages.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              <FileText className="inline h-4 w-4 mr-1" />
              {pages.length} ទំព័រ
            </p>
            <Button onClick={downloadAll} size="sm" className="gap-2">
              <Download className="h-4 w-4" /> ទាញយកទាំងអស់
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pages.map((page) => (
              <motion.div
                key={page.pageNum}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group rounded-lg border bg-card overflow-hidden"
              >
                <img
                  src={page.dataUrl}
                  alt={`Page ${page.pageNum}`}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadPage(page)}
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" /> ទំព័រ {page.pageNum}
                  </Button>
                </div>
                <div className="p-1 text-center text-xs text-muted-foreground">
                  ទំព័រ {page.pageNum}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {!loading && pages.length === 0 && (
        <div className="rounded-xl border bg-card p-6 text-center space-y-2">
          <div className="text-4xl">📄→🖼️</div>
          <h3 className="font-bold">PDF → Image Converter</h3>
          <p className="text-xs text-muted-foreground">
            បង្ហោះឯកសារ PDF ដើម្បីបំប្លែងទំព័រទាំងអស់ទៅជារូបភាព PNG គុណភាពខ្ពស់
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PdfToImage;
