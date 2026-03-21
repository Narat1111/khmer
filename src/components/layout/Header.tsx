import { useI18n } from "@/lib/i18n";
import { Globe, Sun, Moon, Heart, LogIn, LogOut, User, Menu, X, Home, Wrench, Info, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import naratAvatar from "@/assets/narat-avatar.png";
import bakongIcon from "@/assets/icons/bakong-icon.png";
import type { User as SupaUser } from "@supabase/supabase-js";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleAppleSignIn = async () => {
    await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navItems = [
    { to: "/", label: lang === "km" ? "ទំព័រដើម" : "Home", icon: <Home className="h-4 w-4" /> },
    { to: "/support", label: lang === "km" ? "គាំទ្រ" : "Support", icon: <Heart className="h-4 w-4" /> },
    { href: "https://t.me/Naratkh168", label: "Telegram", icon: <MessageCircle className="h-4 w-4" />, external: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-14 items-center justify-between sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img
              src={naratAvatar}
              alt="Hinarat"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all"
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold sm:text-lg bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Hinarat
              </span>
              <span className="text-[9px] text-muted-foreground hidden sm:block">Free Tools</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.external ? (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  {item.label}
                </motion.a>
              ) : (
                <motion.div key={item.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.to!}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      location.pathname === item.to
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </motion.div>
              )
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* User Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-1.5">
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
                className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border bg-card transition-colors hover:bg-accent sm:h-9 sm:w-9"
                aria-label="Sign in with Apple"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </motion.button>
            )}

            {/* Support (Bakong) */}
            <Link to="/support" className="hidden sm:block">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 sm:h-9 sm:px-3 sm:text-sm"
              >
                <img src={bakongIcon} alt="Bakong" className="h-4 w-4 object-contain sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{lang === "km" ? "គាំទ្រ" : "Support"}</span>
              </motion.div>
            </Link>

            {/* Theme Toggle */}
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

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "km" ? "en" : "km")}
              className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors hover:bg-accent sm:gap-2 sm:px-3 sm:text-sm"
            >
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="font-english">{lang === "km" ? "EN" : "ខ្មែរ"}</span>
            </button>

            {/* Hamburger Menu Button (mobile) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-accent sm:h-9 sm:w-9"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="md:hidden fixed top-14 sm:top-16 inset-x-0 z-40 border-b bg-background/95 backdrop-blur-md shadow-lg"
          >
            <nav className="container py-3 space-y-1">
              {navItems.map((item, i) =>
                item.external ? (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {item.icon}
                    </span>
                    {item.label}
                  </motion.a>
                ) : (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={item.to!}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        location.pathname === item.to
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${location.pathname === item.to ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </motion.div>
                )
              )}

              {/* Support button in mobile menu */}
              <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navItems.length * 0.06 }}>
                <Link
                  to="/support"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                    <img src={bakongIcon} alt="Bakong" className="h-5 w-5 object-contain" />
                  </span>
                  {lang === "km" ? "គាំទ្រ Bakong" : "Support Bakong"}
                </Link>
              </motion.div>

              {/* Auth in mobile */}
              {user ? (
                <motion.button
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.06 }}
                  onClick={() => { handleSignOut(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <LogOut className="h-4 w-4" />
                  </span>
                  {lang === "km" ? "ចាកចេញ" : "Sign Out"}
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.06 }}
                  onClick={() => { handleAppleSignIn(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <LogIn className="h-4 w-4" />
                  </span>
                  {lang === "km" ? "ចូលគណនី" : "Sign In"}
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 top-14 sm:top-16 z-30 bg-black/20"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}