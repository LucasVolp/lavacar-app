"use client";

import React from "react";
import { ShopOutlined } from "@ant-design/icons";

export const CreateOrgHeader: React.FC = () => {
  return (
    <div className="text-center mb-10">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
        <ShopOutlined className="text-4xl" />
      </div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">
        Vamos criar sua Organização
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-lg leading-relaxed">
        Este será o centro de controle para todos os seus estabelecimentos. Você poderá adicionar lojas e membros depois.
      </p>
    </div>
  );
};
