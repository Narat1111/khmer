import { useState, useMemo, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { tools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";
import daraAvatar from "@/assets/dara-avatar.png";

const Index = () => {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query.toLowerCase();
    return tools.filter((tool) => {
      const meta = t.tools[tool.id];
      return meta?.name.toLowerCase().includes(q) || meta?.desc.toLowerCase().includes(q) || tool.id.includes(q);
    });
  }, [query, t]);

  const categories = ["media", "developer", "productivity", "design", "games", "finance", "utilities"] as const;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("tool-search")?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 sm:py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center sm:mb-10">
          <motion.h1 className="text-3xl font-bold sm:text-4xl" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            {t.title}
          </motion.h1>
          <motion.p className="mt-2 text-muted-foreground text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            🛠️ {tools.length} Free Tools
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mx-auto mb-6 max-w-lg sm:mb-10">
          <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-2.5 shadow-resting transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30 focus-within:shadow-hover-card sm:py-3">
            <Search className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
            <input id="tool-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <kbd className="hidden rounded-md border bg-muted px-2 py-0.5 font-english text-[10px] text-muted-foreground sm:inline-block">⌘K</kbd>
          </div>
        </motion.div>

        {/* Tool Grid by Category */}
        {categories.map((cat) => {
          const catTools = filtered.filter((tool) => tool.category === cat);
          if (catTools.length === 0) return null;
          return (
            <motion.section key={cat} className="mb-6 sm:mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <motion.div className="h-1 w-5 rounded-full bg-primary sm:w-6" initial={{ width: 0 }} animate={{ width: 24 }} transition={{ delay: 0.3, duration: 0.4 }} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm">{t.categories[cat]}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{catTools.length}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-3">
                {catTools.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
              </div>
            </motion.section>
          );
        })}

        {filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-muted-foreground">
            🔍 No matching tools found
          </motion.p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {/* About */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <motion.img
                  src={daraAvatar}
                  alt="DaraTool"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
                  whileHover={{ rotate: 10, scale: 1.15 }}
                />
                <span className="text-sm font-bold">DaraTool</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your trusted platform for free online tools. Fast, reliable, and easy to use.
              </p>
              {/* Social icons with animation */}
              <div className="mt-4 flex gap-2">
                {[
                  { href: "https://t.me/DaraStore123", label: "Telegram", icon: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
                  { href: "https://www.tiktok.com/@kirajaksloy", label: "TikTok", icon: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.24 8.24 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.13z"/></svg> },
                  { href: "https://www.facebook.com/share/18V7gK6LpS/?mibextid=wwXIfr", label: "Facebook", icon: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { href: "https://t.me/nyxvibecode", label: "Channel", icon: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
                ].map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    title={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Free Tools */}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Free Tools</h4>
              <ul className="space-y-2 text-xs">
                {["translator", "code_editor", "image_pdf", "tiktok", "voice", "qr", "bg_remover", "random"].map((id) => (
                  <li key={id}><a href={`/tool/${id}`} className="text-muted-foreground transition-colors hover:text-foreground">{t.tools[id as keyof typeof t.tools]?.name}</a></li>
                ))}
              </ul>
            </div>

            {/* More Tools */}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">More Tools</h4>
              <ul className="space-y-2 text-xs">
                {["calculator", "weather", "password", "json_formatter", "chess_game", "sudoku", "game_2048", "pixel_art"].map((id) => (
                  <li key={id}><a href={`/tool/${id}`} className="text-muted-foreground transition-colors hover:text-foreground">{t.tools[id as keyof typeof t.tools]?.name}</a></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Support</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://t.me/DaraStore123" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">Contact Us</a></li>
                <li><a href="https://t.me/nyxvibecode" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">Channel</a></li>
                <li><span className="text-muted-foreground">FAQ</span></li>
                <li><span className="text-muted-foreground">Terms of Service</span></li>
                <li><span className="text-muted-foreground">Privacy Policy</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-xs text-muted-foreground">© 2026 DaraTool • {tools.length} Free Tools</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
