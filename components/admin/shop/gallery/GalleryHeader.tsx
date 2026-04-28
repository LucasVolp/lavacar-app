"use client";

import React from "react";
import { PictureOutlined } from "@ant-design/icons";

interface GalleryHeaderProps {
  count: number;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({ count }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-purple-50 dark:bg-purple-900/20 p-2.5 rounded-lg shrink-0">
          <PictureOutlined className="text-purple-600 dark:text-purple-400 text-xl" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 m-0">
            Portfólio
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 m-0">
            Fotos exibidas na vitrine digital da loja
          </p>
        </div>
        <div className="ml-auto shrink-0 flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
          <PictureOutlined className="text-zinc-400 text-sm" />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{count}</span>
          <span className="text-xs text-zinc-500">foto{count !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
};
