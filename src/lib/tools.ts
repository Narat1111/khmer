import {
  Video, Mic, ImageDown, QrCode, KeyRound, Ruler, DollarSign,
  CaseSensitive, FileText, Palette, Dice5, Timer, CloudSun, Hash, Binary, MessageSquare,
  Bluetooth, Wifi, MapPin, Code, FileImage, Calculator, Scale, Cake, Keyboard,
  Gamepad2, CircleDot, ListTodo, StickyNote, Clock, Braces, Paintbrush,
  Coins, Receipt, Landmark, Languages,
} from "lucide-react";

export type ToolId =
  | "tiktok" | "voice" | "image_compress" | "qr" | "password"
  | "unit" | "currency" | "text_case" | "word_count" | "color"
  | "random" | "stopwatch" | "weather" | "hash" | "base64" | "ai_chat"
  | "bluetooth" | "wifi" | "ip_location" | "code_editor" | "image_pdf"
  | "calculator" | "bmi_calculator" | "age_calculator" | "typing_test"
  | "snake_game" | "lucky_wheel" | "todo_list" | "notes" | "pomodoro"
  | "json_formatter" | "gradient_generator" | "flip_coin" | "tip_calculator"
  | "loan_calculator" | "translator";

export interface ToolMeta {
  id: ToolId;
  icon: typeof Video;
  category: "media" | "productivity" | "utilities" | "games" | "finance";
}

export const tools: ToolMeta[] = [
  // Media
  { id: "ai_chat", icon: MessageSquare, category: "media" },
  { id: "tiktok", icon: Video, category: "media" },
  { id: "voice", icon: Mic, category: "media" },
  { id: "image_compress", icon: ImageDown, category: "media" },
  { id: "image_pdf", icon: FileImage, category: "media" },
  { id: "translator", icon: Languages, category: "media" },
  // Productivity
  { id: "code_editor", icon: Code, category: "productivity" },
  { id: "qr", icon: QrCode, category: "productivity" },
  { id: "password", icon: KeyRound, category: "productivity" },
  { id: "hash", icon: Hash, category: "productivity" },
  { id: "base64", icon: Binary, category: "productivity" },
  { id: "json_formatter", icon: Braces, category: "productivity" },
  { id: "todo_list", icon: ListTodo, category: "productivity" },
  { id: "notes", icon: StickyNote, category: "productivity" },
  { id: "pomodoro", icon: Clock, category: "productivity" },
  { id: "typing_test", icon: Keyboard, category: "productivity" },
  // Games
  { id: "snake_game", icon: Gamepad2, category: "games" },
  { id: "lucky_wheel", icon: CircleDot, category: "games" },
  { id: "flip_coin", icon: Coins, category: "games" },
  { id: "random", icon: Dice5, category: "games" },
  // Finance
  { id: "calculator", icon: Calculator, category: "finance" },
  { id: "currency", icon: DollarSign, category: "finance" },
  { id: "tip_calculator", icon: Receipt, category: "finance" },
  { id: "loan_calculator", icon: Landmark, category: "finance" },
  { id: "bmi_calculator", icon: Scale, category: "finance" },
  { id: "age_calculator", icon: Cake, category: "finance" },
  // Utilities
  { id: "bluetooth", icon: Bluetooth, category: "utilities" },
  { id: "wifi", icon: Wifi, category: "utilities" },
  { id: "ip_location", icon: MapPin, category: "utilities" },
  { id: "unit", icon: Ruler, category: "utilities" },
  { id: "text_case", icon: CaseSensitive, category: "utilities" },
  { id: "word_count", icon: FileText, category: "utilities" },
  { id: "color", icon: Palette, category: "utilities" },
  { id: "gradient_generator", icon: Paintbrush, category: "utilities" },
  { id: "stopwatch", icon: Timer, category: "utilities" },
  { id: "weather", icon: CloudSun, category: "utilities" },
];
