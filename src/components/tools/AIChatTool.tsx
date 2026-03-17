import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Settings2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const AIChatTool: React.FC = () => {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSystem, setShowSystem] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(() =>
    localStorage.getItem("sranal-system-prompt") || ""
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveSystemPrompt = (val: string) => {
    setSystemPrompt(val);
    localStorage.setItem("sranal-system-prompt", val);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          systemPrompt: systemPrompt.trim() || undefined,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        const content = assistantSoFar;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ ${e.message || t.error}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "400px" }}>
      {/* System Prompt Toggle */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setShowSystem(!showSystem)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {lang === "km" ? "ការកំណត់ System Prompt" : "System Prompt Settings"}
        </button>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t.clear}
          </button>
        )}
      </div>

      {/* System Prompt Box */}
      {showSystem && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <label className="mb-1.5 block text-xs font-medium text-primary">
            System Prompt
          </label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => saveSystemPrompt(e.target.value)}
            placeholder={
              lang === "km"
                ? "វាយការណែនាំសម្រាប់ AI នៅទីនេះ... (ឧ. អ្នកជាអ្នកជំនួយការខ្មែរ)"
                : "Enter instructions for the AI... (e.g. You are a Khmer language tutor)"
            }
            rows={3}
            className="border-primary/20 bg-background text-sm"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {lang === "km"
              ? "System prompt កំណត់អាកប្បកិរិយារបស់ AI។ បន្ថែមការណែនាំផ្ទាល់ខ្លួនរបស់អ្នក។"
              : "The system prompt defines the AI's behavior. Add your custom instructions."}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-lg border bg-accent/30 p-3" style={{ maxHeight: "350px" }}>
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {lang === "km" ? "ចាប់ផ្តើមការសន្ទនាជាមួយ AI..." : "Start a conversation with AI..."}
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-card"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="rounded-2xl border bg-card px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={lang === "km" ? "វាយសារនៅទីនេះ..." : "Type a message..."}
          rows={2}
          className="flex-1 resize-none"
        />
        <Button onClick={send} disabled={loading || !input.trim()} className="self-end">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AIChatTool;
