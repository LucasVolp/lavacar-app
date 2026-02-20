"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "antd";
import { CheckCircleFilled, DashboardOutlined, GlobalOutlined } from "@ant-design/icons";

interface StepSuccessProps {
  organizationId: string;
  shopSlug: string;
}

const SECTION_CONTAINER_CLASS =
  "bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200";

export const StepSuccess: React.FC<StepSuccessProps> = ({
  organizationId,
  shopSlug,
}) => {
  const router = useRouter();

  return (
    <div className={SECTION_CONTAINER_CLASS}>
      <Card bordered={false} className="bg-transparent" styles={{ body: { padding: 48 } }}>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircleFilled className="text-5xl text-emerald-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Sua loja está pronta!
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
              O estabelecimento foi configurado com sucesso. Agora você pode gerenciar tudo
              pelo dashboard ou compartilhar a página pública com seus clientes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="primary"
              size="large"
              icon={<DashboardOutlined />}
              onClick={() => router.push(`/organization/${organizationId}/shops`)}
            >
              Ir para Dashboard
            </Button>
            {shopSlug && (
              <Button
                size="large"
                icon={<GlobalOutlined />}
                onClick={() => router.push(`/shop/${shopSlug}`)}
                className="text-zinc-600 dark:text-zinc-300"
              >
                Ver Página Pública
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
