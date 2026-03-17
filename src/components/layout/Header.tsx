import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Header() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
          >
            <span className="text-lg font-bold text-primary-foreground">ស</span>
          </motion.div>
          <span className="text-xl font-bold">{t.title}</span>
        </Link>

        <button
          onClick={() => setLang(lang === "km" ? "en" : "km")}
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          <Globe className="h-4 w-4" />
          <span className="font-english">{lang === "km" ? "EN" : "ខ្មែរ"}</span>
        </button>
      </div>
    </header>
  );
}
