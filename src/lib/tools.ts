import {
  Video, Mic, ImageDown, QrCode, KeyRound, Ruler, DollarSign,
  CaseSensitive, FileText, Palette, Dice5, Timer, CloudSun, Hash, Binary, MessageSquare,
  Bluetooth, Wifi, MapPin, Code, FileImage, Calculator, Scale, Cake, Keyboard,
  Gamepad2, CircleDot, ListTodo, StickyNote, Clock, Braces, Paintbrush,
  Coins, Receipt, Landmark, Languages, FileCode, Regex, Type, Smile, PenTool,
  Barcode, Percent, CalendarDays, Hourglass, SwatchBook, BoxSelect, Diff,
  Link2, BinaryIcon, LetterText, Thermometer, Radio, Dices, Swords, Brain,
  Grid3X3, Quote, MonitorPlay, CheckSquare, LayoutGrid, ScanText, ImageMinus,
  FunctionSquare, SlidersHorizontal, HelpCircle, Laugh,
  MicIcon, BookOpen, Wallet, Grid2X2, Crown, Hash as HashIcon, Layers, FileUp,
  Presentation, GitBranch, GraduationCap, Music, Eye, FileSpreadsheet, Table2,
  CodeXml, Maximize, FileOutput, Scissors, Film, Image, Calendar, DollarSign as DollarIcon,
  Columns, Smile as SmileIcon, BookMarked, TimerReset, Gauge, Lock, Fingerprint,
  ClockIcon, RatioIcon, TypeIcon,
} from "lucide-react";

export type ToolId =
  | "tiktok" | "voice" | "image_compress" | "qr" | "password"
  | "unit" | "currency" | "text_case" | "word_count" | "color"
  | "random" | "stopwatch" | "weather" | "hash" | "base64" | "ai_chat"
  | "bluetooth" | "wifi" | "ip_location" | "code_editor" | "image_pdf"
  | "calculator" | "bmi_calculator" | "age_calculator" | "typing_test"
  | "snake_game" | "lucky_wheel" | "todo_list" | "notes" | "pomodoro"
  | "json_formatter" | "gradient_generator" | "flip_coin" | "tip_calculator"
  | "loan_calculator" | "translator"
  | "markdown_preview" | "regex_tester" | "lorem_ipsum" | "emoji_picker"
  | "draw_board" | "barcode_gen" | "percentage_calc" | "date_diff"
  | "countdown_timer" | "color_palette" | "css_shadow" | "text_diff"
  | "url_encoder" | "binary_converter" | "roman_numeral" | "temperature"
  | "morse_code" | "dice_roller" | "rock_paper" | "memory_game"
  | "tic_tac_toe" | "quote_gen" | "screen_recorder" | "habit_tracker"
  | "character_map" | "image_to_text" | "bg_remover" | "ai_math"
  | "image_enhancer" | "quiz" | "meme_maker"
  | "audio_recorder" | "flashcard_maker" | "budget_planner" | "pixel_art"
  | "chess_game" | "sudoku" | "game_2048" | "pdf_merger"
  // 25 new tools
  | "whiteboard" | "mind_map" | "flashcard_quiz" | "music_player"
  | "color_blindness" | "json_to_csv" | "csv_editor" | "markdown_to_html"
  | "image_resizer" | "pdf_to_image" | "audio_trimmer" | "video_trimmer"
  | "gif_maker" | "calendar_tool" | "expense_tracker" | "kanban_board"
  | "mood_tracker" | "journal" | "timer_intervals" | "speed_test"
  | "text_encryptor" | "uuid_generator" | "cron_parser" | "aspect_ratio"
  | "font_preview"
  | "video_translator";

export interface ToolMeta {
  id: ToolId;
  icon: typeof Video;
  category: "media" | "productivity" | "utilities" | "games" | "finance" | "design" | "developer";
}

export const tools: ToolMeta[] = [
  // Media
  { id: "ai_chat", icon: MessageSquare, category: "media" },
  { id: "tiktok", icon: Video, category: "media" },
  { id: "voice", icon: Mic, category: "media" },
  { id: "image_compress", icon: ImageDown, category: "media" },
  { id: "image_pdf", icon: FileImage, category: "media" },
  { id: "translator", icon: Languages, category: "media" },
  { id: "image_to_text", icon: ScanText, category: "media" },
  { id: "bg_remover", icon: ImageMinus, category: "media" },
  { id: "image_enhancer", icon: SlidersHorizontal, category: "media" },
  { id: "screen_recorder", icon: MonitorPlay, category: "media" },
  { id: "audio_recorder", icon: MicIcon, category: "media" },
  { id: "pdf_merger", icon: FileUp, category: "media" },
  { id: "music_player", icon: Music, category: "media" },
  { id: "image_resizer", icon: Maximize, category: "media" },
  { id: "pdf_to_image", icon: FileOutput, category: "media" },
  { id: "audio_trimmer", icon: Scissors, category: "media" },
  { id: "video_trimmer", icon: Film, category: "media" },
  { id: "gif_maker", icon: Image, category: "media" },
  // Developer
  { id: "code_editor", icon: Code, category: "developer" },
  { id: "json_formatter", icon: Braces, category: "developer" },
  { id: "regex_tester", icon: Regex, category: "developer" },
  { id: "markdown_preview", icon: FileCode, category: "developer" },
  { id: "base64", icon: Binary, category: "developer" },
  { id: "hash", icon: Hash, category: "developer" },
  { id: "url_encoder", icon: Link2, category: "developer" },
  { id: "binary_converter", icon: BinaryIcon, category: "developer" },
  { id: "text_diff", icon: Diff, category: "developer" },
  { id: "lorem_ipsum", icon: Type, category: "developer" },
  { id: "css_shadow", icon: BoxSelect, category: "developer" },
  { id: "morse_code", icon: Radio, category: "developer" },
  { id: "json_to_csv", icon: FileSpreadsheet, category: "developer" },
  { id: "csv_editor", icon: Table2, category: "developer" },
  { id: "markdown_to_html", icon: CodeXml, category: "developer" },
  { id: "uuid_generator", icon: Fingerprint, category: "developer" },
  { id: "cron_parser", icon: Clock, category: "developer" },
  { id: "text_encryptor", icon: Lock, category: "developer" },
  // Productivity
  { id: "qr", icon: QrCode, category: "productivity" },
  { id: "password", icon: KeyRound, category: "productivity" },
  { id: "todo_list", icon: ListTodo, category: "productivity" },
  { id: "notes", icon: StickyNote, category: "productivity" },
  { id: "pomodoro", icon: Clock, category: "productivity" },
  { id: "typing_test", icon: Keyboard, category: "productivity" },
  { id: "habit_tracker", icon: CheckSquare, category: "productivity" },
  { id: "countdown_timer", icon: Hourglass, category: "productivity" },
  { id: "quote_gen", icon: Quote, category: "productivity" },
  { id: "flashcard_maker", icon: BookOpen, category: "productivity" },
  { id: "whiteboard", icon: Presentation, category: "productivity" },
  { id: "mind_map", icon: GitBranch, category: "productivity" },
  { id: "calendar_tool", icon: Calendar, category: "productivity" },
  { id: "kanban_board", icon: Columns, category: "productivity" },
  { id: "journal", icon: BookMarked, category: "productivity" },
  { id: "timer_intervals", icon: TimerReset, category: "productivity" },
  { id: "mood_tracker", icon: SmileIcon, category: "productivity" },
  { id: "expense_tracker", icon: DollarIcon, category: "productivity" },
  // Design
  { id: "color", icon: Palette, category: "design" },
  { id: "gradient_generator", icon: Paintbrush, category: "design" },
  { id: "color_palette", icon: SwatchBook, category: "design" },
  { id: "emoji_picker", icon: Smile, category: "design" },
  { id: "draw_board", icon: PenTool, category: "design" },
  { id: "character_map", icon: LayoutGrid, category: "design" },
  { id: "barcode_gen", icon: Barcode, category: "design" },
  { id: "meme_maker", icon: Laugh, category: "design" },
  { id: "pixel_art", icon: Grid2X2, category: "design" },
  { id: "color_blindness", icon: Eye, category: "design" },
  { id: "font_preview", icon: TypeIcon, category: "design" },
  { id: "aspect_ratio", icon: RatioIcon, category: "design" },
  // Games
  { id: "snake_game", icon: Gamepad2, category: "games" },
  { id: "lucky_wheel", icon: CircleDot, category: "games" },
  { id: "flip_coin", icon: Coins, category: "games" },
  { id: "random", icon: Dice5, category: "games" },
  { id: "dice_roller", icon: Dices, category: "games" },
  { id: "rock_paper", icon: Swords, category: "games" },
  { id: "memory_game", icon: Brain, category: "games" },
  { id: "tic_tac_toe", icon: Grid3X3, category: "games" },
  { id: "quiz", icon: HelpCircle, category: "games" },
  { id: "chess_game", icon: Crown, category: "games" },
  { id: "sudoku", icon: HashIcon, category: "games" },
  { id: "game_2048", icon: Layers, category: "games" },
  { id: "flashcard_quiz", icon: GraduationCap, category: "games" },
  // Finance
  { id: "calculator", icon: Calculator, category: "finance" },
  { id: "currency", icon: DollarSign, category: "finance" },
  { id: "tip_calculator", icon: Receipt, category: "finance" },
  { id: "loan_calculator", icon: Landmark, category: "finance" },
  { id: "bmi_calculator", icon: Scale, category: "finance" },
  { id: "age_calculator", icon: Cake, category: "finance" },
  { id: "percentage_calc", icon: Percent, category: "finance" },
  { id: "date_diff", icon: CalendarDays, category: "finance" },
  { id: "roman_numeral", icon: LetterText, category: "finance" },
  { id: "temperature", icon: Thermometer, category: "finance" },
  { id: "ai_math", icon: FunctionSquare, category: "finance" },
  { id: "budget_planner", icon: Wallet, category: "finance" },
  // Utilities
  { id: "bluetooth", icon: Bluetooth, category: "utilities" },
  { id: "wifi", icon: Wifi, category: "utilities" },
  { id: "ip_location", icon: MapPin, category: "utilities" },
  { id: "unit", icon: Ruler, category: "utilities" },
  { id: "text_case", icon: CaseSensitive, category: "utilities" },
  { id: "word_count", icon: FileText, category: "utilities" },
  { id: "stopwatch", icon: Timer, category: "utilities" },
  { id: "weather", icon: CloudSun, category: "utilities" },
  { id: "speed_test", icon: Gauge, category: "utilities" },
  { id: "video_translator", icon: Languages, category: "media" },
];
