"use client";

import React from "react";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";

interface ManagementCardProps {
  icon: React.ReactNode;
  title: string;
  summary: string;
  description?: string;
  href: string;
  actionLabel?: string;
  color?: "blue" | "purple" | "amber" | "emerald" | "red" | "zinc";
}

const colorConfig = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  red: {
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
  },
  zinc: {
    iconBg: "bg-zinc-100 dark:bg-zinc-800",
    iconColor: "text-zinc-600 dark:text-zinc-400",
    hoverBorder: "hover:border-zinc-300 dark:hover:border-zinc-600",
  },
};

export const ManagementCard: React.FC<ManagementCardProps> = ({
  icon,
  title,
  summary,
  description,
  href,
  actionLabel = "Gerenciar",
  color = "blue"
}) => {
  const colors = colorConfig[color];

  return (
    <div
      className={`
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl p-5
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        ${colors.hoverBorder}
        group
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.iconColor} text-xl`}>
          {icon}
        </div>
        <Link href={href}>
          <Button
            type="text"
            size="small"
            className="!text-zinc-400 group-hover:!text-indigo-500 dark:group-hover:!text-indigo-400 transition-colors"
            icon={<RightOutlined className="text-xs" />}
          />
        </Link>
      </div>

      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
        {title}
      </h3>

      <p className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-1">
        {summary}
      </p>

      {description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          {description}
        </p>
      )}

      <Link href={href} className="block mt-4">
        <Button
          type="default"
          block
          className="!rounded-xl !h-10 !border-zinc-200 dark:!border-zinc-700 !text-zinc-600 dark:!text-zinc-300 hover:!border-indigo-400 hover:!text-indigo-600 dark:hover:!border-indigo-500 dark:hover:!text-indigo-400 transition-colors"
        >
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
};
