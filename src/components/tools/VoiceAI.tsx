import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Square } from "lucide-react";

const VoiceAI: React.FC = () => {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePlay = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (!text.trim()) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "km-KH";
    utter.rate = rate;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="វាយអត្ថបទនៅទីនេះ..."
        rows={5}
      />

      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">
          ល្បឿន: <span className="font-english tabular-nums">{rate}x</span>
        </label>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
      </div>

      <Button onClick={handlePlay} disabled={!text.trim()} className="w-full gap-2">
        {speaking ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {speaking ? t.stop : t.play}
      </Button>

      <p className="text-xs text-muted-foreground">
        ប្រើ Web Speech API — ភាពត្រឹមត្រូវអាចខុសគ្នាតាមកម្មវិធីរុករក
      </p>
    </div>
  );
};

export default VoiceAI;
