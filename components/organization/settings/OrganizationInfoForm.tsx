"use client";

import React from "react";
import { Form, Input, Upload, Button } from "antd";
import {
  BankOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Image from "next/image";

interface OrganizationInfoFormProps {
  logoUrl?: string;
}

export const OrganizationInfoForm: React.FC<OrganizationInfoFormProps> = ({
  logoUrl,
}) => {
  return (
    <>
      {/* Basic Info Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
          <BankOutlined /> Informações Básicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label={<span className="text-zinc-600 dark:text-zinc-400">Nome da Organização</span>}
            name="name"
            rules={[{ required: true, message: "Por favor insira o nome" }]}
          >
            <Input
              size="large"
              className="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-zinc-600 dark:text-zinc-400">Documento (CNPJ/CPF)</span>}
            name="document"
          >
            <Input
              size="large"
              className="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-zinc-600 dark:text-zinc-400">Slug (URL)</span>}
            name="slug"
            tooltip="Identificador único usado na URL"
          >
            <Input
              size="large"
              prefix={<GlobalOutlined className="text-zinc-400 dark:text-zinc-500" />}
              className="bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600"
              disabled
            />
          </Form.Item>
        </div>
      </section>

      {/* Branding Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
          <SafetyCertificateOutlined /> Marca e Aparência
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 relative overflow-hidden">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                className="object-cover rounded-xl"
              />
            ) : (
              <span className="text-zinc-400 dark:text-zinc-500 text-xs">Sem Logo</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-zinc-900 dark:text-zinc-200 font-medium mb-2">
              Logo da Organização
            </h3>
            <p className="text-zinc-500 dark:text-zinc-500 text-sm mb-4">
              Faça upload de uma imagem (JPG, PNG) para ser usada como ícone da
              sua organização. Recomendado: 512x512px.
            </p>
            <Upload>
              <Button
                icon={<UploadOutlined />}
                className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 dark:hover:border-zinc-600"
              >
                Alterar Logo
              </Button>
            </Upload>
          </div>
        </div>
      </section>
    </>
  );
};
