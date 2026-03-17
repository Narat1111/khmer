import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const QRCodeGenerator: React.FC = () => {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const qrUrl = text.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=300x300`
    : null;

  return (
    <div className="space-y-4">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="វាយអត្ថបទ ឬតំណរភ្ជាប់..."
      />

      {qrUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border bg-background p-4">
            <img src={qrUrl} alt="QR Code" className="h-48 w-48" />
          </div>
          <a href={qrUrl} download="qrcode.png">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t.download}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
