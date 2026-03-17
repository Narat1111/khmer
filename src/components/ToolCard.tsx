import { useI18n } from "@/lib/i18n";
import { ToolMeta } from "@/lib/tools";
import { toolIcons } from "@/lib/toolIcons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ToolCardProps {
  tool: ToolMeta;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const meta = t.tools[tool.id];
  const iconSrc = toolIcons[tool.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.04,
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border bg-card p-5 shadow-resting transition-all duration-300 hover:border-primary/40 hover:shadow-elevated"
    >
      {/* Glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.08), transparent 70%)" }}
      />

      {/* Icon with bounce animation */}
      <div className="relative mb-4 flex justify-center">
        <motion.img
          src={iconSrc}
          alt={meta.name}
          className="h-16 w-16 object-contain drop-shadow-md sm:h-20 sm:w-20"
          whileHover={{
            rotate: [0, -8, 8, -4, 0],
            scale: [1, 1.1, 1.05, 1.08, 1],
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <h3 className="text-sm font-bold leading-tight sm:text-base">{meta.name}</h3>
        <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{meta.desc}</p>
      </div>
    </motion.div>
  );
}
