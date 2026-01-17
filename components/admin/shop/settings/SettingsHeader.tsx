"use client";

import React from "react";
import { SettingOutlined } from "@ant-design/icons";

export const SettingsHeader: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full flex items-center justify-center">
          <SettingOutlined className="text-xl text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 m-0">
            Configurações
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie as informações e preferências do estabelecimento
          </p>
        </div>
      </div>
    </div>
  );
};
