import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Play, Copy, Check, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const LANGUAGES = [
  { id: "html", label: "HTML", default: '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello DaraTool!</h1>\n</body>\n</html>' },
  { id: "javascript", label: "JavaScript", default: 'console.log("Hello DaraTool!");\n\nfunction greet(name) {\n  return `Welcome, ${name}!`;\n}\n\nconsole.log(greet("Cambodia"));' },
  { id: "css", label: "CSS", default: 'body {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: white;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}' },
];

const CodeEditor: React.FC = () => {
  const { t } = useI18n();
  const [langId, setLangId] = useState("html");
  const [code, setCode] = useState(LANGUAGES[0].default);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.id === langId)!;

  const handleLangChange = (id: string) => {
    setLangId(id);
    setCode(LANGUAGES.find((l) => l.id === id)!.default);
    setOutput("");
  };

  const runCode = () => {
    if (langId === "html") {
      setOutput(code);
    } else if (langId === "javascript") {
      try {
        const logs: string[] = [];
        const mockConsole = { log: (...args: any[]) => logs.push(args.map(String).join(" ")) };
        const fn = new Function("console", code);
        fn(mockConsole);
        setOutput(logs.join("\n") || "// No output");
      } catch (err: any) {
        setOutput(`Error: ${err.message}`);
      }
    } else if (langId === "css") {
      setOutput(`<style>${code}</style><div style="padding:20px"><h2>CSS Applied!</h2><p>Check the styling above</p></div>`);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Language tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLangChange(lang.id)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              langId === lang.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {lang.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Editor */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-48 w-full rounded-xl border bg-muted p-4 font-english text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/30"
          spellCheck={false}
          style={{ fontFamily: "'Fira Code', 'Courier New', monospace", tabSize: 2 }}
        />
      </motion.div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={runCode} className="flex-1">
          <Play className="h-4 w-4" />
          Run
        </Button>
        <Button variant="outline" onClick={copyCode}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t.copied : t.copy}
        </Button>
        <Button variant="outline" onClick={() => { setCode(currentLang.default); setOutput(""); }}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Output */}
      {output && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden rounded-xl border"
        >
          <div className="bg-muted px-4 py-2 text-xs font-bold text-muted-foreground">Output</div>
          {langId === "html" || langId === "css" ? (
            <iframe
              srcDoc={output}
              className="h-48 w-full border-t bg-white"
              sandbox="allow-scripts"
              title="preview"
            />
          ) : (
            <pre className="max-h-48 overflow-auto p-4 font-english text-sm">{output}</pre>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CodeEditor;
