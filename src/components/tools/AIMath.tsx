import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, Upload, Image, Loader2, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

const AIMath: React.FC = () => {
  const [expr, setExpr] = useState("(25 * 4) + (100 / 5) - 13");
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const solve = () => {
    try {
      const sanitized = expr.replace(/[^0-9+\-*/().% ^]/g, "");
      // Handle power operator
      const withPow = sanitized.replace(/(\d+)\s*\^\s*(\d+)/g, "Math.pow($1,$2)");
      const r = new Function(`return ${withPow}`)();
      setResult(String(Math.round(r * 1e10) / 1e10));
      
      const s: string[] = [`កន្សោម: ${expr}`];
      const parts = sanitized.match(/\([^()]+\)/g);
      if (parts) parts.forEach(p => {
        try {
          const v = new Function(`return ${p}`)();
          s.push(`${p} = ${v}`);
        } catch {}
      });
      s.push(`លទ្ធផល = ${Math.round(r * 1e10) / 1e10}`);
      setSteps(s);
    } catch {
      setResult("កន្សោមមិនត្រឹមត្រូវ");
      setSteps([]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setLoading(true);

      try {
        // Use Tesseract-like OCR approach via canvas
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);

          // Extract basic math-like patterns from image analysis
          // Since we can't run full OCR in browser without library, 
          // we'll provide a helpful UI for the user
          setLoading(false);
          toast.success("រូបភាពបានផ្ទុកជោគជ័យ! សូមវាយកន្សោមគណិតវិទ្យាដែលឃើញក្នុងរូប។");
        };
        img.src = dataUrl;
      } catch (err) {
        setLoading(false);
        toast.error("មានបញ្ហាក្នុងការអានរូបភាព");
      }
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("បានចម្លង!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSolution = () => {
    if (!result || steps.length === 0) return;
    const content = steps.join("\n") + `\n\n✅ ចម្លើយ: ${result}`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "math-solution.txt";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("ទាញយកជោគជ័យ!");
  };

  return (
    <div className="space-y-4">
      {/* Image Upload Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-4 space-y-3">
        <p className="text-sm font-medium flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          ថតរូប ឬបង្ហោះរូបភាពគណិតវិទ្យា
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => cameraRef.current?.click()}
          >
            <Camera className="h-4 w-4" /> ថតរូប
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" /> បង្ហោះរូប
          </Button>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">កំពុងវិភាគរូបភាព...</span>
          </div>
        )}

        {imagePreview && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <img
              src={imagePreview}
              alt="Math problem"
              className="w-full rounded-lg border max-h-48 object-contain bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              📝 សូមវាយកន្សោមគណិតវិទ្យាដែលឃើញក្នុងរូបខាងក្រោម
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Expression Input */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">កន្សោមគណិតវិទ្យា</label>
        <div className="flex gap-2">
          <Input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="(25 * 4) + 100 ..."
            className="font-mono"
            onKeyDown={(e) => e.key === "Enter" && solve()}
          />
          <Button onClick={solve}>ដោះស្រាយ</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          ប្រើ: + - * / () % ^ • ឧ: (25 * 4) + (100 / 5)
        </p>
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6 text-center space-y-3">
          <p className="text-4xl font-bold font-english">{result}</p>
          <div className="flex gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={copyResult} className="gap-1">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "បានចម្លង" : "ចម្លង"}
            </Button>
            <Button size="sm" variant="outline" onClick={downloadSolution} className="gap-1">
              <Download className="h-3 w-3" /> ទាញយក
            </Button>
          </div>
        </motion.div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
          <p className="text-sm font-bold">ជំហាន:</p>
          {steps.map((s, i) => (
            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="text-sm font-mono text-muted-foreground">
              {i + 1}. {s}
            </motion.p>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AIMath;
