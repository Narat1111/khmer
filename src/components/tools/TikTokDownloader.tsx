import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, AlertCircle } from "lucide-react";

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
    try {
      const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      if (json.video) {
        setData(json);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setError(t.error + " — មិនអាចទាញយកវីដេអូបានទេ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
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
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {data.title && <p className="text-sm font-medium">{data.title}</p>}
          <div className="flex flex-col gap-2">
            {data.video && (
              <a href={data.video} target="_blank" rel="noopener noreferrer">
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  {t.download} — HD
                </Button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokDownloader;
