import { LucideIcon } from "lucide-react";
import Button from "./button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "large" | "compact";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
}: EmptyStateProps) {
  const variants = {
    default: "py-12",
    large: "py-16",
    compact: "py-8",
  };

  const iconSizes = {
    default: "w-16 h-16",
    large: "w-20 h-20",
    compact: "w-12 h-12",
  };

  const textSizes = {
    default: "text-lg",
    large: "text-xl",
    compact: "text-base",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center ${variants[variant]}`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Icon */}
        <div
          className={`${iconSizes[variant]} p-4 rounded-full bg-neutral-800/50 border border-neutral-700/30`}
        >
          <Icon className="w-full h-full text-neutral-400" />
        </div>

        {/* Text Content */}
        <div className="space-y-2 max-w-md">
          <h3 className={`font-semibold text-white ${textSizes[variant]}`}>
            {title}
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
