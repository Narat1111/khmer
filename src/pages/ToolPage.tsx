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
      <ToolLayout title={meta.name} description={meta.desc} icon={tool.icon} toolId={tool.id}>
        <Suspense fallback={<div className="py-10 text-center text-muted-foreground">{t.loading}</div>}>
          <Component />
        </Suspense>
      </ToolLayout>
    </div>
  );
};

export default ToolPage;
