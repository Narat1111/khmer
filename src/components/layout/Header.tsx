import { useI18n } from "@/lib/i18n";
import { Globe, Sun, Moon, Heart, LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import daraAvatar from "@/assets/dara-avatar.png";
import bakongIcon from "@/assets/icons/bakong-icon.png";
import type { User as SupaUser } from "@supabase/supabase-js";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<SupaUser | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);


  const handleAppleSignIn = async () => {
    await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
          {/* Google Sign In / User */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="flex h-8 items-center gap-1.5 rounded-lg border bg-muted/50 px-2 sm:h-9 sm:px-3">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="h-5 w-5 rounded-full" />
                ) : (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="hidden max-w-[100px] truncate text-xs font-medium sm:inline">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSignOut}
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-destructive/10 hover:text-destructive sm:h-9 sm:w-9"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAppleSignIn}
              className="flex h-8 w-8 items-center justify-center rounded-lg border bg-card transition-colors hover:bg-accent sm:h-9 sm:w-9"
              aria-label="Sign in with Apple"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </motion.button>
          )}

          <Link to="/support">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 sm:h-9 sm:px-3 sm:text-sm"
            >
              <img src={bakongIcon} alt="Bakong" className="h-4 w-4 object-contain sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{lang === "km" ? "គាំទ្រ" : "Support"}</span>
              <Heart className="h-3 w-3 sm:hidden" />
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