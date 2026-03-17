import { useI18n } from "@/lib/i18n";
import { ToolMeta } from "@/lib/tools";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ToolCardProps {
  tool: ToolMeta;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const Icon = tool.icon;
  const meta = t.tools[tool.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group cursor-pointer rounded-2xl border bg-tool-card p-5 shadow-resting transition-colors hover:border-primary/50 hover:shadow-hover-card"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-tool-icon transition-colors group-hover:bg-tool-icon-hover">
        <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <h3 className="font-bold leading-tight">{meta.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{meta.desc}</p>
    </motion.div>
  );
}
