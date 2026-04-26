"use client";

import React from "react";
import { ToolOutlined } from "@ant-design/icons";

export const ServicesHeader: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-6 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-1">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg flex items-center justify-center shrink-0">
          <ToolOutlined className="text-xl text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 m-0 truncate">
          Serviços & Grupos
        </h1>
      </div>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:ml-[52px] mt-1">
        Gerencie os serviços oferecidos e organize-os em grupos para seus clientes.
      </p>
    </div>
  );
};