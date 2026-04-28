"use client";

import React from "react";
import { Button, Input } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";

interface MembersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onInvite?: () => void;
}

export const MembersHeader: React.FC<MembersHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onInvite,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Membros da Organização</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Gerencie quem tem acesso à sua organização e suas permissões.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar membros..."
          prefix={<SearchOutlined className="text-zinc-400 dark:text-zinc-500" />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:max-w-xs !bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-700 !text-zinc-900 dark:!text-zinc-200 placeholder:!text-zinc-400 dark:placeholder:!text-zinc-600 focus:!border-indigo-500 hover:!border-zinc-300 dark:hover:!border-zinc-600"
          allowClear
        />
        {onInvite && (
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            className="bg-indigo-600 hover:!bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-900/20 min-h-[44px] w-full sm:w-auto"
            onClick={onInvite}
          >
            Convidar
          </Button>
        )}
      </div>
    </div>
  );
};
