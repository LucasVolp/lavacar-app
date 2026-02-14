"use client";

import React from "react";

export const ClientProfilePageHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 m-0">
          Meu Perfil
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Gerencie suas informações pessoais e segurança.
        </p>
      </div>
    </div>
  );
};
