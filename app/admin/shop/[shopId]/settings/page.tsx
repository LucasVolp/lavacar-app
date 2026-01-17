"use client";

import React, { useEffect, useState } from "react";
import { Spin, Form, message } from "antd";
import { ShopOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useUpdateShop } from "@/hooks/useShops";
import { UpdateShopDto } from "@/types/shop";
import {
  SettingsHeader,
  SettingsInfoForm,
  SettingsAddressForm,
  SettingsConfigForm,
} from "@/components/admin/shop/settings";

/**
 * Configurações do Shop - Edição completa
 */
export default function SettingsPage() {
  const { shop, shopId, isLoading } = useShopAdmin();
  const updateShop = useUpdateShop();

  const [infoForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [configForm] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "address" | "scheduling">("info");

  // Carregar dados do shop nos formulários
  useEffect(() => {
    if (shop) {
      infoForm.setFieldsValue({
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        phone: shop.phone,
        email: shop.email,
        document: shop.document,
        status: shop.status,
      });

      addressForm.setFieldsValue({
        zipCode: shop.zipCode,
        street: shop.street,
        number: shop.number,
        complement: shop.complement,
        neighborhood: shop.neighborhood,
        city: shop.city,
        state: shop.state,
      });

      configForm.setFieldsValue({
        slotInterval: shop.slotInterval,
        bufferBetweenSlots: shop.bufferBetweenSlots,
        maxAdvanceDays: shop.maxAdvanceDays,
        minAdvanceMinutes: shop.minAdvanceMinutes,
      });
    }
  }, [shop, infoForm, addressForm, configForm]);

  const handleSaveInfo = async (values: UpdateShopDto) => {
    setSaving(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values,
      });
      message.success("Informações atualizadas com sucesso!");
    } catch {
      message.error("Erro ao atualizar informações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (values: UpdateShopDto) => {
    setSaving(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values,
      });
      message.success("Endereço atualizado com sucesso!");
    } catch {
      message.error("Erro ao atualizar endereço. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

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

  const tabs = [
    { id: "info", label: "Informações", icon: <ShopOutlined /> },
    { id: "address", label: "Endereço", icon: <EnvironmentOutlined /> },
    { id: "scheduling", label: "Agendamento", icon: <ClockCircleOutlined /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <SettingsHeader />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Navegação */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 shadow-sm sticky top-24">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "info" | "address" | "scheduling")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className={activeTab === tab.id ? "text-blue-500 dark:text-blue-400" : "text-zinc-400"}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            {activeTab === "info" && (
              <div className="animate-fade-in">
                <SettingsInfoForm form={infoForm} onFinish={handleSaveInfo} saving={saving} />
              </div>
            )}
            {activeTab === "address" && (
              <div className="animate-fade-in">
                <SettingsAddressForm form={addressForm} onFinish={handleSaveAddress} saving={saving} />
              </div>
            )}
            {activeTab === "scheduling" && (
              <div className="animate-fade-in">
                <SettingsConfigForm form={configForm} onFinish={handleSaveConfig} saving={saving} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}