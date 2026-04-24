"use client";

import React from "react";
import { Button } from "antd";
import { LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface ShopAccessDeniedProps {
  organizationId?: string;
}

export const ShopAccessDenied: React.FC<ShopAccessDeniedProps> = ({ organizationId }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <LockOutlined className="text-4xl text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Acesso Negado
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 mb-2 leading-relaxed">
          Você não tem permissão para acessar este estabelecimento.
        </p>

        <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-8 leading-relaxed">
          Solicite acesso ao gerente ou proprietário do estabelecimento para ser vinculado como funcionário.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {organizationId && (
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push(`/organization/${organizationId}`)}
              className="h-10 px-6 rounded-xl"
            >
              Voltar à Organização
            </Button>
          )}
          <Button
            onClick={() => router.push("/")}
            className="h-10 px-6 rounded-xl"
          >
            Ir para Início
          </Button>
        </div>
      </div>
    </div>
  );
};
