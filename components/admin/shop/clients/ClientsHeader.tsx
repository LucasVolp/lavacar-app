"use client";

import React from "react";
import { ContactsOutlined, TeamOutlined } from "@ant-design/icons";

interface ClientsHeaderProps {
  totalClients: number;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({ totalClients }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg flex items-center justify-center">
              <ContactsOutlined className="text-xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 m-0">
              Clientes
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm ml-[52px]">
            Gerencie sua base de clientes e acompanhe o histórico
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2.5 rounded-xl">
          <TeamOutlined className="text-indigo-500 dark:text-indigo-400 text-lg" />
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalClients}</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">clientes</span>
        </div>
      </div>
    </div>
  );
};
