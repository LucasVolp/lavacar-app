"use client";

import React from "react";
import { InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

type InfoBoxVariant = "info" | "success" | "warning" | "error";

interface InfoBoxProps {
  title: string;
  description?: string;
  variant?: InfoBoxVariant;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<InfoBoxVariant, { container: string; icon: string; title: string; description: string }> = {
  info: {
    container: "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700",
    icon: "text-zinc-500 dark:text-zinc-400",
    title: "text-zinc-800 dark:text-zinc-100",
    description: "text-zinc-600 dark:text-zinc-400",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50",
    icon: "text-emerald-500 dark:text-emerald-400",
    title: "text-emerald-800 dark:text-emerald-200",
    description: "text-emerald-700 dark:text-emerald-300/80",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50",
    icon: "text-amber-500 dark:text-amber-400",
    title: "text-amber-800 dark:text-amber-200",
    description: "text-amber-700 dark:text-amber-300/80",
  },
  error: {
    container: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50",
    icon: "text-red-500 dark:text-red-400",
    title: "text-red-800 dark:text-red-200",
    description: "text-red-700 dark:text-red-300/80",
  },
};

const defaultIcons: Record<InfoBoxVariant, React.ReactNode> = {
  info: <InfoCircleOutlined className="text-lg" />,
  success: <CheckCircleOutlined className="text-lg" />,
  warning: <ExclamationCircleOutlined className="text-lg" />,
  error: <CloseCircleOutlined className="text-lg" />,
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  description,
  variant = "info",
  icon,
  className = "",
  children,
}) => {
  const styles = variantStyles[variant];
  const displayIcon = icon ?? defaultIcons[variant];

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${styles.container} ${className}`}>
      <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
        {displayIcon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${styles.title}`}>
          {title}
        </p>
        {description && (
          <p className={`text-sm mt-1 ${styles.description}`}>
            {description}
          </p>
        )}
        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
