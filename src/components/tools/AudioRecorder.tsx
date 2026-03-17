import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mic, Square, Download, Loader2 } from "lucide-react";

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRef.current = recorder;
      setRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div animate={recording ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }} className={`flex h-28 w-28 items-center justify-center rounded-full ${recording ? "bg-destructive/20" : "bg-primary/10"}`}>
        <Mic className={`h-12 w-12 ${recording ? "text-destructive" : "text-primary"}`} />
      </motion.div>
      <p className="font-english text-3xl font-bold tabular-nums">{fmt(duration)}</p>
      <div className="flex gap-3">
        {!recording ? (
          <Button onClick={startRecording} size="lg" className="gap-2"><Mic className="h-4 w-4" /> Record</Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2"><Square className="h-4 w-4" /> Stop</Button>
        )}
      </div>
      {audioUrl && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-3">
          <audio controls src={audioUrl} className="w-full" />
          <a href={audioUrl} download="recording.webm">
            <Button variant="outline" className="w-full gap-2"><Download className="h-4 w-4" /> Download</Button>
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default AudioRecorder;