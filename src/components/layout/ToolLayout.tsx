import { ArrowLeft, Info, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolId } from "@/lib/tools";
import { toolIcons } from "@/lib/toolIcons";
import { Button } from "@/components/ui/button";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ElementType;
  toolId?: ToolId;
  children: ReactNode;
}

const howToUse: Partial<Record<ToolId, { km: string[]; en: string[] }>> = {
  qr: {
    km: ["វាយអត្ថបទ ឬ URL នៅក្នុងប្រអប់", "QR Code នឹងបង្កើតដោយស្វ័យប្រវត្តិ", "ចុច 'ទាញយក' ដើម្បីរក្សាទុក", "ប្រើ Tab ស្កេន ដើម្បីស្កេន QR ពីកាមេរ៉ា"],
    en: ["Type text or URL in the input box", "QR Code generates automatically", "Click 'Download' to save", "Use Scan tab to scan QR from camera"],
  },
  calculator: {
    km: ["ចុចលេខ និងប្រមាណវិធីដើម្បីគណនា", "ចុច = ដើម្បីមើលលទ្ធផល", "ចុច C ដើម្បីសម្អាត", "ចម្លង ឬទាញយកប្រវត្តិគណនា"],
    en: ["Press numbers and operators to calculate", "Press = to see result", "Press C to clear", "Copy or download calculation history"],
  },
  translator: {
    km: ["វាយអត្ថបទដែលចង់បកប្រែ", "ជ្រើសរើសភាសាប្រភព និងគោលដៅ", "ចុចបកប្រែ", "ចម្លង ឬទាញយកលទ្ធផល"],
    en: ["Type text to translate", "Select source and target language", "Click translate", "Copy or download result"],
  },
  ai_chat: {
    km: ["វាយសំណួរក្នុងប្រអប់ជជែក", "AI នឹងឆ្លើយជាភាសាខ្មែរ ឬអង់គ្លេស", "អាចសួរអ្វីក៏បាន!", "ចម្លងចម្លើយដោយចុច Copy"],
    en: ["Type your question in the chat box", "AI responds in Khmer or English", "Ask anything!", "Copy answers by clicking Copy"],
  },
  pdf_to_image: {
    km: ["ចុចបង្ហោះឯកសារ PDF", "PDF នឹងបំប្លែងជារូបភាព PNG គុណភាពខ្ពស់", "ទាញយកម្តង ឬទាំងអស់", "រហូតដល់ 20 ទំព័រ"],
    en: ["Click to upload PDF file", "PDF converts to high-quality PNG images", "Download one or all pages", "Up to 20 pages supported"],
  },
};

// Generic how-to for tools without specific instructions
const genericHowTo = {
  km: ["បើកឧបករណ៍ និងបញ្ចូលទិន្នន័យ", "ចុចប៊ូតុងដើម្បីដំណើរការ", "ចម្លង ឬទាញយកលទ្ធផល", "ទិន្នន័យរក្សាទុកក្នុងទូរស័ព្ទរបស់អ្នក"],
  en: ["Open the tool and enter data", "Click the button to process", "Copy or download results", "Data saved on your device"],
};

export function ToolLayout({ title, description, icon: Icon, toolId, children }: ToolLayoutProps) {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const customIcon = toolId ? toolIcons[toolId] : null;
  const [showGuide, setShowGuide] = useState(false);

  const guide = toolId && howToUse[toolId] ? howToUse[toolId] : genericHowTo;

  return (
    <div className="container max-w-2xl py-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition-colors hover:bg-accent"
        >
          <Info className="h-3.5 w-3.5" />
          {lang === "km" ? "របៀបប្រើ" : "How to use"}
        </motion.button>
      </div>

      {/* How to Use Guide */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-xl border bg-primary/5 p-4 space-y-2">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                {lang === "km" ? `របៀបប្រើ ${title}` : `How to use ${title}`}
              </h3>
              <ol className="space-y-1.5">
                {(guide as any)[lang]?.map((step: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {step}
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="mb-6 flex items-center gap-4">
          {customIcon ? (
            <motion.img
              src={customIcon}
              alt={title}
              className="h-14 w-14 object-contain drop-shadow-md"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
            />
          ) : (
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
          )}
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-resting sm:p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
