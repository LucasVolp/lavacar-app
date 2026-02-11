"use client";

import React, { useEffect, useState } from "react";
import { Spin, Form, message, Button } from "antd";
import { ArrowLeftOutlined, SettingOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useUpdateShop } from "@/hooks/useShops";
import { UpdateShopDto } from "@/types/shop";
import { SettingsConfigForm } from "@/components/admin/shop/settings";
import Link from "next/link";

/**
 * Advanced Settings Page - Scheduling configuration
 */
export default function AdvancedSettingsPage() {
  const { shop, shopId, isLoading } = useShopAdmin();
  const updateShop = useUpdateShop();

  const [configForm] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shop) {
      configForm.setFieldsValue({
        slotInterval: shop.slotInterval,
        bufferBetweenSlots: shop.bufferBetweenSlots,
        maxAdvanceDays: shop.maxAdvanceDays,
        minAdvanceMinutes: shop.minAdvanceMinutes,
      });
    }
  }, [shop, configForm]);

  const handleSaveConfig = async (values: UpdateShopDto) => {
    setSaving(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values,
      });
      message.success("Configurações atualizadas com sucesso!");
    } catch {
      message.error("Erro ao atualizar configurações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando configurações..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/shop/${shopId}/settings`}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="!text-zinc-500 hover:!text-zinc-700 dark:hover:!text-zinc-300"
          />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            <SettingOutlined className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Configurações Avançadas
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Parâmetros de agendamento e sistema
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
        <SettingsConfigForm
          form={configForm}
          onFinish={handleSaveConfig}
          saving={saving}
        />
      </div>
    </div>
  );
}
