import React from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color: "indigo" | "emerald" | "amber" | "zinc";
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subtitle, color }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30",
    zinc: "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  };

  const iconBgClasses = {
    indigo: "bg-indigo-100 dark:bg-indigo-800/30",
    emerald: "bg-emerald-100 dark:bg-emerald-800/30",
    amber: "bg-amber-100 dark:bg-amber-800/30",
    zinc: "bg-zinc-200 dark:bg-zinc-700",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${iconBgClasses[color]} p-2.5 rounded-xl`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {subtitle && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};
