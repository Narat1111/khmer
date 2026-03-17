import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ToolId } from "@/lib/tools";
import { toolIcons } from "@/lib/toolIcons";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ElementType;
  toolId?: ToolId;
  children: ReactNode;
}

export function ToolLayout({ title, description, icon: Icon, toolId, children }: ToolLayoutProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const customIcon = toolId ? toolIcons[toolId] : null;

  return (
    <div className="container max-w-2xl py-6 sm:py-8">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="mb-6 flex items-center gap-4">
          {customIcon ? (
            <motion.img
              src={customIcon}
              alt={title}
              className="h-14 w-14 object-contain drop-shadow-md"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-resting sm:p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
