import { forwardRef } from "react";
import { useI18n } from "@/lib/i18n";
import { ToolMeta } from "@/lib/tools";
import { toolIcons } from "@/lib/toolIcons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ToolCardProps {
  tool: ToolMeta;
  index: number;
}

export const ToolCard = forwardRef<HTMLDivElement, ToolCardProps>(({ tool, index }, ref) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const meta = t.tools[tool.id];
  const iconSrc = toolIcons[tool.id];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.03,
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border bg-card p-3 shadow-resting transition-all duration-300 hover:border-primary/40 hover:shadow-elevated sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.08), transparent 70%)" }}
      />

      <div className="relative mb-2 flex justify-center sm:mb-4">
        <motion.img
          src={iconSrc}
          alt={meta.name}
          className="h-12 w-12 object-contain drop-shadow-md sm:h-16 sm:w-16"
          whileHover={{
            rotate: [0, -8, 8, -4, 0],
            scale: [1, 1.1, 1.05, 1.08, 1],
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="text-center">
        <h3 className="text-[11px] font-bold leading-tight sm:text-sm">{meta.name}</h3>
        <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">{meta.desc}</p>
      </div>
    </motion.div>
  );
});

ToolCard.displayName = "ToolCard";
