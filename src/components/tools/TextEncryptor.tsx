import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

const TextEncryptor: React.FC = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const xorCipher = (input: string, secret: string): string => {
    if (!secret) return input;
    return Array.from(input).map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ secret.charCodeAt(i % secret.length))
    ).join("");
  };

  const encrypt = () => {
    if (!text || !key) return;
    const encrypted = btoa(xorCipher(text, key));
    setResult(encrypted);
  };

  const decrypt = () => {
    if (!text || !key) return;
    try { setResult(xorCipher(atob(text), key)); } catch { setResult("Invalid encrypted text"); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex gap-2">
        <Button variant={mode === "encrypt" ? "default" : "outline"} onClick={() => setMode("encrypt")} className="flex-1 gap-2"><Lock className="h-4 w-4" /> Encrypt</Button>
        <Button variant={mode === "decrypt" ? "default" : "outline"} onClick={() => setMode("decrypt")} className="flex-1 gap-2"><Unlock className="h-4 w-4" /> Decrypt</Button>
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Paste encrypted text..."} rows={4} />
      <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Secret key..." type="password" />
      <Button onClick={mode === "encrypt" ? encrypt : decrypt} className="w-full">{mode === "encrypt" ? "🔒 Encrypt" : "🔓 Decrypt"}</Button>
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <Textarea value={result} readOnly rows={3} className="font-mono text-xs" />
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(result)}>📋 Copy</Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TextEncryptor;
