import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, AlertCircle, Play } from "lucide-react";
import { motion } from "framer-motion";

const TikTokDownloader: React.FC = () => {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    // Try multiple APIs for reliability
    const apis = [
      async () => {
        const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (json.code === 0 && json.data) {
          return {
            title: json.data.title || "TikTok Video",
            video: json.data.play,
            videoHD: json.data.hdplay,
            music: json.data.music,
            cover: json.data.cover,
            author: json.data.author?.nickname,
          };
        }
        throw new Error("Invalid response");
      },
      async () => {
        const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        if (json.video) {
          return {
            title: json.title || "TikTok Video",
            video: json.video,
            videoHD: json.video,
            cover: json.images?.[0],
            author: json.author,
          };
        }
        throw new Error("Invalid response");
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

    setError(t.error + " — មិនអាចទាញយកវីដេអូបានទេ។ សូមពិនិត្យតំណរភ្ជាប់ម្ដងទៀត");
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t.paste_url}
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
          {/* Preview */}
          {data.cover && (
            <div className="relative overflow-hidden rounded-xl border">
              <img src={data.cover} alt="cover" className="w-full object-cover" style={{ maxHeight: 300 }} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-12 w-12 text-white drop-shadow-lg" fill="white" />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="rounded-xl border bg-card p-3">
            {data.author && <p className="text-xs text-muted-foreground">@{data.author}</p>}
            {data.title && <p className="mt-1 text-sm font-medium leading-snug">{data.title}</p>}
          </div>

          {/* Download buttons */}
          <div className="flex flex-col gap-2">
            {data.videoHD && (
              <a href={data.videoHD} target="_blank" rel="noopener noreferrer" download>
                <Button className="w-full gap-2" size="lg">
                  <Download className="h-4 w-4" />
                  {t.download} — HD
                </Button>
              </a>
            )}
            {data.video && data.video !== data.videoHD && (
              <a href={data.video} target="_blank" rel="noopener noreferrer" download>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  {t.download} — SD
                </Button>
              </a>
            )}
            {data.music && (
              <a href={data.music} target="_blank" rel="noopener noreferrer" download>
                <Button variant="secondary" className="w-full gap-2">
                  🎵 {t.download} Music
                </Button>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TikTokDownloader;