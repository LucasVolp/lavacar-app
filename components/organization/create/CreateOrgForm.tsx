"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { BankOutlined, NumberOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { brasilApiService } from "@/services/brasilApi";
import { formatDocument } from "@/utils/formatters";

interface CreateOrgFormProps {
  onFinish: (values: { name: string; document?: string }) => void;
  isLoading: boolean;
}

export const CreateOrgForm: React.FC<CreateOrgFormProps> = ({ onFinish, isLoading }) => {
  const [form] = Form.useForm();
  const [loadingCnpj, setLoadingCnpj] = useState(false);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("document", formatDocument(e.target.value));
  };

  const handleDocumentBlur = async () => {
    const document = String(form.getFieldValue("document") || "");
    const digits = document.replace(/\D/g, "");
    if (digits.length !== 14) {
      return;
    }

    setLoadingCnpj(true);
    try {
      const company = await brasilApiService.findCompanyByCnpj(digits);
      if (!form.getFieldValue("name")) {
        form.setFieldValue("name", company.nome_fantasia || company.razao_social || "");
      }
    } catch {
      // silently fallback to manual fill
    } finally {
      setLoadingCnpj(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-black/20 border border-zinc-100 dark:border-zinc-800 transition-all duration-300">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        size="large"
        className="flex flex-col gap-4"
      >
        <Form.Item
          name="name"
          label={<span className="text-zinc-700 dark:text-zinc-300 font-medium ml-1">Nome da Organização</span>}
          rules={[{ required: true, message: "Por favor, informe o nome da organização." }]}
          className="mb-2"
        >
          <Input 
            prefix={<BankOutlined className="text-zinc-400 mr-2" />}
            placeholder="Ex: Grupo Lavacar Premium" 
            className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 transition-all"
          />
        </Form.Item>

        <Form.Item
          name="document"
          label={<span className="text-zinc-700 dark:text-zinc-300 font-medium ml-1">CNPJ <span className="text-zinc-400 font-normal text-xs">(Opcional)</span></span>}
          className="mb-6"
        >
          <Input 
            prefix={<NumberOutlined className="text-zinc-400 mr-2" />}
            placeholder="00.000.000/0000-00" 
            onChange={handleDocumentChange}
            onBlur={handleDocumentBlur}
            suffix={loadingCnpj ? "Buscando..." : undefined}
            className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl hover:bg-white dark:hover:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-800 transition-all"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          icon={<ArrowRightOutlined />}
          className="h-14 w-full bg-blue-600 hover:bg-blue-500 border-none rounded-xl text-lg font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          Criar e Continuar
        </Button>
      </Form>
    </div>
  );
};
