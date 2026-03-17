import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const URLEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState("https://example.com/search?q=hello world&lang=en");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    try { setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input)); } catch { setOutput("Invalid input"); }
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="mb-1 block text-sm font-medium">Input</label>
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
      </motion.div>
      <div className="flex gap-2">
        <Button onClick={() => { setMode("encode"); process(); }} variant={mode === "encode" ? "default" : "outline"} className="flex-1">Encode</Button>
        <Button onClick={() => { setMode("decode"); process(); }} variant={mode === "decode" ? "default" : "outline"} className="flex-1">Decode</Button>
      </div>
      {output && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <label className="mb-1 block text-sm font-medium">Result</label>
          <Textarea value={output} readOnly rows={3} className="font-mono text-sm" />
        </motion.div>
      )}
    </div>
  );
};

export default URLEncoderDecoder;
