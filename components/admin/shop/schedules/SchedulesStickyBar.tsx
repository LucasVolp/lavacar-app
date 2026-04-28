"use client";

import React from "react";

interface SchedulesStickyBarProps {
  hasChanges: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const SchedulesStickyBar: React.FC<SchedulesStickyBarProps> = ({
  hasChanges,
  saving,
  onSave,
  onDiscard,
}) => {
  if (!hasChanges) return null;

  return (
    <div className="sticky top-16 z-40 pt-2 pb-6 w-full bg-zinc-50 dark:bg-[#0a0a0a]">
      <div className="bg-white dark:bg-zinc-900 border border-amber-500/40 dark:border-amber-500/30 shadow-xl rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <span className="text-amber-600 dark:text-amber-500 text-lg">⚠️</span>
          </div>
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Você tem alterações de horários não salvas.
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors disabled:opacity-40"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-black text-sm font-bold px-6 py-2 rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {saving ? "Salvando…" : "Salvar Alterações"}
          </button>
        </div>

      </div>
    </div>
  );
};
