import { useState, useMemo } from "react";
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
      return meta.name.toLowerCase().includes(q) || meta.desc.toLowerCase().includes(q) || tool.id.includes(q);
    });
  }, [query, t]);

  const categories = ["media", "productivity", "utilities"] as const;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-10 max-w-lg"
        >
          <div className="flex items-center gap-3 rounded-xl border bg-search-bg px-4 py-3 shadow-resting transition-shadow focus-within:ring-2 focus-within:ring-primary/30">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border px-1.5 py-0.5 font-english text-xs text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
          </div>
        </motion.div>

        {/* Tool Grid by Category */}
        {categories.map((cat) => {
          const catTools = filtered.filter((tool) => tool.category === cat);
          if (catTools.length === 0) return null;
          return (
            <section key={cat} className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
                {t.categories[cat]}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {catTools.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">
            {t.search} — 0 results
          </p>
        )}
      </main>
    </div>
  );
};

export default Index;
