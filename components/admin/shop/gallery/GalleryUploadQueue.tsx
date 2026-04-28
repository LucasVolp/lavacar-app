"use client";

import React from "react";
import { Spin } from "antd";

export interface UploadingFile {
  id: string;
  name: string;
  progress: "uploading" | "done" | "error";
}

interface GalleryUploadQueueProps {
  items: UploadingFile[];
}

export const GalleryUploadQueue: React.FC<GalleryUploadQueueProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((u) => (
        <div
          key={u.id}
          className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 transition-colors duration-300"
        >
          {u.progress === "uploading" && <Spin size="small" />}
          {u.progress === "done" && (
            <span className="h-4 w-4 rounded-full bg-emerald-500 shrink-0" />
          )}
          {u.progress === "error" && (
            <span className="h-4 w-4 rounded-full bg-red-500 shrink-0" />
          )}
          <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate flex-1">
            {u.name}
          </span>
          <span className="text-xs text-zinc-500 shrink-0">
            {u.progress === "uploading" && "Enviando…"}
            {u.progress === "done" && "Concluído"}
            {u.progress === "error" && "Erro"}
          </span>
        </div>
      ))}
    </div>
  );
};
