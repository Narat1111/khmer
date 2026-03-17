import {
  Video, Mic, ImageDown, QrCode, KeyRound, Ruler, DollarSign,
  CaseSensitive, FileText, Palette, Dice5, Timer, CloudSun, Hash, Binary, MessageSquare,
} from "lucide-react";

export type ToolId =
  | "tiktok" | "voice" | "image_compress" | "qr" | "password"
  | "unit" | "currency" | "text_case" | "word_count" | "color"
  | "random" | "stopwatch" | "weather" | "hash" | "base64" | "ai_chat";

export interface ToolMeta {
  id: ToolId;
  icon: typeof Video;
  category: "media" | "productivity" | "utilities";
}

export const tools: ToolMeta[] = [
  { id: "ai_chat", icon: MessageSquare, category: "media" },
  { id: "tiktok", icon: Video, category: "media" },
  { id: "voice", icon: Mic, category: "media" },
  { id: "image_compress", icon: ImageDown, category: "media" },
  { id: "qr", icon: QrCode, category: "productivity" },
  { id: "password", icon: KeyRound, category: "productivity" },
  { id: "hash", icon: Hash, category: "productivity" },
  { id: "base64", icon: Binary, category: "productivity" },
  { id: "unit", icon: Ruler, category: "utilities" },
  { id: "currency", icon: DollarSign, category: "utilities" },
  { id: "text_case", icon: CaseSensitive, category: "utilities" },
  { id: "word_count", icon: FileText, category: "utilities" },
  { id: "color", icon: Palette, category: "utilities" },
  { id: "random", icon: Dice5, category: "utilities" },
  { id: "stopwatch", icon: Timer, category: "utilities" },
  { id: "weather", icon: CloudSun, category: "utilities" },
];
