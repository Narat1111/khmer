import { useI18n } from "@/lib/i18n";
import { Globe, Sun, Moon, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import daraAvatar from "@/assets/dara-avatar.png";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between sm:h-16">
        <Link to="/" className="flex items-center gap-2">
          <motion.img
            src={daraAvatar}
            alt="DaraTool"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30"
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <span className="text-lg font-bold sm:text-xl">DaraTool</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link to="/support">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-8 items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 sm:h-9 sm:px-3 sm:text-sm"
            >
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{lang === "km" ? "គាំទ្រ" : "Support"}</span>
            </motion.div>
          </Link>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-accent sm:h-9 sm:w-9"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div key="sun" initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-4 w-4 text-yellow-400" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={() => setLang(lang === "km" ? "en" : "km")}
            className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors hover:bg-accent sm:gap-2 sm:px-3 sm:text-sm"
          >
            <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="font-english">{lang === "km" ? "EN" : "ខ្មែរ"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
