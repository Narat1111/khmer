import { useState, useMemo, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { tools } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";

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
      <main className="container py-8 sm:py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center sm:mb-10">
          <motion.h1 className="text-3xl font-bold sm:text-4xl" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            {t.title}
          </motion.h1>
          <motion.p className="mt-2 text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {t.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            🛠️ {tools.length} Free Tools
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mx-auto mb-8 max-w-lg sm:mb-10">
          <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-resting transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30 focus-within:shadow-hover-card">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input id="tool-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <kbd className="hidden rounded-md border bg-muted px-2 py-0.5 font-english text-[10px] text-muted-foreground sm:inline-block">⌘K</kbd>
          </div>
        </motion.div>

        {/* Tool Grid by Category */}
        {categories.map((cat) => {
          const catTools = filtered.filter((tool) => tool.category === cat);
          if (catTools.length === 0) return null;
          return (
            <motion.section key={cat} className="mb-8 sm:mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="mb-4 flex items-center gap-3">
                <motion.div className="h-1 w-6 rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: 24 }} transition={{ delay: 0.3, duration: 0.4 }} />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.categories[cat]}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{catTools.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
      <footer className="border-t bg-card/50 py-6">
        <div className="container text-center">
          <p className="text-sm font-bold">DaraTool</p>
          <p className="mt-1 text-xs text-muted-foreground">© 2026 DaraTool — Version 0.3</p>
          <p className="mt-1 text-xs text-muted-foreground">{tools.length} Free Tools • Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
