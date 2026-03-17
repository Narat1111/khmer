import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Circle, Square, Download } from "lucide-react";

const ScreenRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setVideoUrl("");
    } catch { /* user cancelled */ }
  };

  const stop = () => { recorderRef.current?.stop(); setRecording(false); };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
        {!recording ? (
          <Button onClick={start} className="gap-2"><Circle className="h-4 w-4 fill-destructive text-destructive" /> Start Recording</Button>
        ) : (
          <Button onClick={stop} variant="destructive" className="gap-2">
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}><Square className="h-4 w-4" /></motion.span>
            Stop Recording
          </Button>
        )}
      </motion.div>
      {recording && <motion.p animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-sm text-destructive font-bold">🔴 Recording...</motion.p>}
      {videoUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-3">
          <video src={videoUrl} controls className="w-full rounded-xl border" />
          <Button asChild className="w-full gap-2"><a href={videoUrl} download="recording.webm"><Download className="h-4 w-4" /> Download</a></Button>
        </motion.div>
      )}
    </div>
  );
};

export default ScreenRecorder;
