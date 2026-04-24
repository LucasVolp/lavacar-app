"use client";

import React from "react";
import Link from "next/link";
import { Button, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

interface ShopsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateShop?: () => void;
  createHref?: string;
}

export const ShopsHeader: React.FC<ShopsHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onCreateShop,
  createHref,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Estabelecimentos</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Gerencie as lojas da sua organização</p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar lojas..."
          prefix={<SearchOutlined className="text-zinc-400 dark:text-zinc-500" />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-64 !bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-700 !text-zinc-900 dark:!text-zinc-200 placeholder:!text-zinc-400 dark:placeholder:!text-zinc-600 focus:!border-indigo-500 hover:!border-zinc-300 dark:hover:!border-zinc-600"
          allowClear
        />
        {createHref ? (
          <Link href={createHref}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="bg-indigo-600 hover:!bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-900/20"
            >
              Novo Shop
            </Button>
          </Link>
        ) : onCreateShop ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="bg-indigo-600 hover:!bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-900/20"
            onClick={onCreateShop}
          >
            Novo Shop
          </Button>
        ) : null}
      </div>
    </div>
  );
};
