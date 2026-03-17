import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, AlertCircle, Play, Music, Film } from "lucide-react";
import { motion } from "framer-motion";

const TikTokDownloader: React.FC = () => {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    const apis = [
      async () => {
        const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
        const json = await res.json();
        if (json.code === 0 && json.data) {
          return {
            title: json.data.title || "TikTok Video",
            video: `https://www.tikwm.com${json.data.play}`,
            videoHD: json.data.hdplay ? `https://www.tikwm.com${json.data.hdplay}` : null,
            music: json.data.music ? `https://www.tikwm.com${json.data.music}` : null,
            cover: json.data.cover,
            author: json.data.author?.nickname || json.data.author?.unique_id,
          };
        }
        throw new Error("Invalid");
      },
      async () => {
        const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (json.code === 0 && json.data) {
          return {
            title: json.data.title || "TikTok Video",
            video: json.data.play,
            videoHD: json.data.hdplay || null,
            music: json.data.music || null,
            cover: json.data.cover,
            author: json.data.author?.nickname,
          };
        }
        throw new Error("Invalid");
      },
    ];

    for (const apiFn of apis) {
      try {
        const result = await apiFn();
        setData(result);
        setLoading(false);
        return;
      } catch {
        continue;
      }
    }

    setError("មិនអាចទាញយកវីដេអូបានទេ។ សូមពិនិត្យតំណរភ្ជាប់ម្ដងទៀត");
    setLoading(false);
  };

  // Download file to phone by fetching blob and triggering download
  const downloadFile = async (fileUrl: string, filename: string, type: string) => {
    setDownloading(type);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch {
      // Fallback: open in new tab
      window.open(fileUrl, "_blank");
    }
    setDownloading(null);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t.paste_url || "Paste TikTok URL..."}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleDownload()}
        />
        <Button onClick={handleDownload} disabled={loading || !url.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.download}
        </Button>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {data.cover && (
            <div className="relative overflow-hidden rounded-xl border">
              <img src={data.cover} alt="cover" className="w-full object-cover" style={{ maxHeight: 300 }} crossOrigin="anonymous" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-12 w-12 text-white drop-shadow-lg" fill="white" />
              </div>
            </div>
          )}

          <div className="rounded-xl border bg-card p-3">
            {data.author && <p className="text-xs text-muted-foreground">@{data.author}</p>}
            {data.title && <p className="mt-1 text-sm font-medium leading-snug">{data.title}</p>}
          </div>

          <div className="flex flex-col gap-2">
            {data.videoHD && (
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => downloadFile(data.videoHD, `tiktok-hd-${Date.now()}.mp4`, "hd")}
                disabled={downloading === "hd"}
              >
                {downloading === "hd" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
                {t.download} — HD Video
              </Button>
            )}
            {data.video && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => downloadFile(data.video, `tiktok-${Date.now()}.mp4`, "sd")}
                disabled={downloading === "sd"}
              >
                {downloading === "sd" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {t.download} — Video
              </Button>
            )}
            {data.music && (
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => downloadFile(data.music, `tiktok-music-${Date.now()}.mp3`, "music")}
                disabled={downloading === "music"}
              >
                {downloading === "music" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
                🎵 {t.download} Music
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TikTokDownloader;
