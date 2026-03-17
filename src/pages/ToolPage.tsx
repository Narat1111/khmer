import { useParams, Navigate } from "react-router-dom";
import { tools, ToolId } from "@/lib/tools";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { lazy, Suspense } from "react";

const toolComponents: Record<ToolId, React.LazyExoticComponent<React.FC>> = {
  ai_chat: lazy(() => import("@/components/tools/AIChatTool")),
  tiktok: lazy(() => import("@/components/tools/TikTokDownloader")),
  voice: lazy(() => import("@/components/tools/VoiceAI")),
  image_compress: lazy(() => import("@/components/tools/ImageCompressor")),
  qr: lazy(() => import("@/components/tools/QRCodeGenerator")),
  password: lazy(() => import("@/components/tools/PasswordGenerator")),
  unit: lazy(() => import("@/components/tools/UnitConverter")),
  currency: lazy(() => import("@/components/tools/CurrencyConverter")),
  text_case: lazy(() => import("@/components/tools/TextCaseConverter")),
  word_count: lazy(() => import("@/components/tools/WordCounter")),
  color: lazy(() => import("@/components/tools/ColorPicker")),
  random: lazy(() => import("@/components/tools/RandomNumber")),
  stopwatch: lazy(() => import("@/components/tools/StopwatchTimer")),
  weather: lazy(() => import("@/components/tools/WeatherApp")),
  hash: lazy(() => import("@/components/tools/FileHashGenerator")),
  base64: lazy(() => import("@/components/tools/Base64Encoder")),
  bluetooth: lazy(() => import("@/components/tools/BluetoothChecker")),
  wifi: lazy(() => import("@/components/tools/WifiChecker")),
  ip_location: lazy(() => import("@/components/tools/IPLocation")),
  code_editor: lazy(() => import("@/components/tools/CodeEditor")),
  image_pdf: lazy(() => import("@/components/tools/ImageToPdf")),
  calculator: lazy(() => import("@/components/tools/Calculator")),
  bmi_calculator: lazy(() => import("@/components/tools/BMICalculator")),
  age_calculator: lazy(() => import("@/components/tools/AgeCalculator")),
  typing_test: lazy(() => import("@/components/tools/TypingTest")),
  snake_game: lazy(() => import("@/components/tools/SnakeGame")),
  lucky_wheel: lazy(() => import("@/components/tools/LuckyWheel")),
  todo_list: lazy(() => import("@/components/tools/TodoList")),
  notes: lazy(() => import("@/components/tools/Notes")),
  pomodoro: lazy(() => import("@/components/tools/Pomodoro")),
  json_formatter: lazy(() => import("@/components/tools/JSONFormatter")),
  gradient_generator: lazy(() => import("@/components/tools/GradientGenerator")),
  flip_coin: lazy(() => import("@/components/tools/CoinFlip")),
  tip_calculator: lazy(() => import("@/components/tools/TipCalculator")),
  loan_calculator: lazy(() => import("@/components/tools/LoanCalculator")),
  translator: lazy(() => import("@/components/tools/Translator")),
  // New tools
  markdown_preview: lazy(() => import("@/components/tools/MarkdownPreview")),
  regex_tester: lazy(() => import("@/components/tools/RegexTester")),
  lorem_ipsum: lazy(() => import("@/components/tools/LoremIpsum")),
  emoji_picker: lazy(() => import("@/components/tools/EmojiPicker")),
  draw_board: lazy(() => import("@/components/tools/DrawBoard")),
  barcode_gen: lazy(() => import("@/components/tools/BarcodeGenerator")),
  percentage_calc: lazy(() => import("@/components/tools/PercentageCalc")),
  date_diff: lazy(() => import("@/components/tools/DateDiff")),
  countdown_timer: lazy(() => import("@/components/tools/CountdownTimer")),
  color_palette: lazy(() => import("@/components/tools/ColorPaletteGen")),
  css_shadow: lazy(() => import("@/components/tools/CSSShadowGen")),
  text_diff: lazy(() => import("@/components/tools/TextDiff")),
  url_encoder: lazy(() => import("@/components/tools/URLEncoderDecoder")),
  binary_converter: lazy(() => import("@/components/tools/BinaryConverter")),
  roman_numeral: lazy(() => import("@/components/tools/RomanNumeral")),
  temperature: lazy(() => import("@/components/tools/TemperatureConverter")),
  morse_code: lazy(() => import("@/components/tools/MorseCode")),
  dice_roller: lazy(() => import("@/components/tools/DiceRoller")),
  rock_paper: lazy(() => import("@/components/tools/RockPaperScissors")),
  memory_game: lazy(() => import("@/components/tools/MemoryGame")),
  tic_tac_toe: lazy(() => import("@/components/tools/TicTacToe")),
  quote_gen: lazy(() => import("@/components/tools/QuoteGenerator")),
  screen_recorder: lazy(() => import("@/components/tools/ScreenRecorder")),
  habit_tracker: lazy(() => import("@/components/tools/HabitTracker")),
  character_map: lazy(() => import("@/components/tools/CharacterMap")),
  image_to_text: lazy(() => import("@/components/tools/ImageToText")),
  bg_remover: lazy(() => import("@/components/tools/BGRemover")),
  ai_math: lazy(() => import("@/components/tools/AIMath")),
  image_enhancer: lazy(() => import("@/components/tools/ImageEnhancer")),
  quiz: lazy(() => import("@/components/tools/Quiz")),
};

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { t } = useI18n();

  const tool = tools.find((tl) => tl.id === toolId);
  if (!tool) return <Navigate to="/" replace />;

  const Component = toolComponents[tool.id];
  const meta = t.tools[tool.id];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ToolLayout title={meta?.name || tool.id} description={meta?.desc || ""} icon={tool.icon} toolId={tool.id}>
        <Suspense fallback={<div className="py-10 text-center text-muted-foreground">{t.loading}</div>}>
          <Component />
        </Suspense>
      </ToolLayout>
    </div>
  );
};

export default ToolPage;
