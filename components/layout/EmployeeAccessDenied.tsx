"use client";

import React from "react";
import { Result, Button } from "antd";
import { useRouter } from "next/navigation";

interface EmployeeAccessDeniedProps {
  shopId?: string;
  organizationId?: string;
}

export const EmployeeAccessDenied: React.FC<EmployeeAccessDeniedProps> = ({ shopId, organizationId }) => {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Result
        status="403"
        title="Acesso Restrito"
        subTitle="Funcionários não têm acesso a esta área. Solicite permissão ao gerente ou proprietário do estabelecimento."
        extra={
          <div className="flex gap-4 justify-center">
            {shopId && organizationId && (
              <Button type="primary" onClick={() => router.push(`/organization/${organizationId}/shop/${shopId}`)}>
                Voltar ao Dashboard
              </Button>
            )}
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        }
      />
    </div>
  );
};
