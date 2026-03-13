"use client";

import React, { useEffect, useState } from "react";
import { Spin, message, Form, Tabs } from "antd";
import { useSearchParams } from "next/navigation";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useUpdateShop } from "@/hooks/useShops";
import { useShopSchedules } from "@/hooks/useSchedules";
import { useShopBlockedTimes } from "@/hooks/useBlockedTimes";
import { useOrganizationMembers } from "@/hooks/useOrganizations";
import { UpdateShopDto } from "@/types/shop";
import {
  ShopHeaderProfile,
  ManagementGrid
} from "@/components/admin/shop/settings/components";
import { SettingsConfigForm } from "@/components/admin/shop/settings";

export default function SettingsPage() {
  const { shop, shopId, isLoading } = useShopAdmin();
  const searchParams = useSearchParams();
  const updateShop = useUpdateShop();
  const [saving, setSaving] = useState(false);
  const [savingAdvanced, setSavingAdvanced] = useState(false);
  const [configForm] = Form.useForm();

  const { data: schedulesData } = useShopSchedules(shopId);
  const { data: blockedTimesData } = useShopBlockedTimes(shopId);
  const { data: membersData } = useOrganizationMembers(shop?.organizationId || "");

  const schedules = schedulesData ?? [];
  const blockedTimes = blockedTimesData ?? [];
  const memberCount = membersData?.length ?? 0;
  const activeTab = searchParams.get("tab") === "advanced" ? "advanced" : "overview";

  useEffect(() => {
    if (!shop) return;
    configForm.setFieldsValue({
      slotInterval: shop.slotInterval,
      bufferBetweenSlots: shop.bufferBetweenSlots,
      maxAdvanceDays: shop.maxAdvanceDays,
      minAdvanceMinutes: shop.minAdvanceMinutes,
    });
  }, [shop, configForm]);

  const handleSaveProfile = async (values: UpdateShopDto) => {
    setSaving(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values,
      });
    } catch {
      message.error("Erro ao atualizar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdvanced = async (values: UpdateShopDto) => {
    setSavingAdvanced(true);
    try {
      await updateShop.mutateAsync({
        id: shopId,
        payload: values,
      });
      message.success("Configurações avançadas atualizadas com sucesso!");
    } catch {
      message.error("Erro ao atualizar configurações avançadas.");
    } finally {
      setSavingAdvanced(false);
    }
  };

  if (isLoading || !shop) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando configurações..." />
      </div>
    );
  }

  const items = [
    {
      key: "overview",
      label: "Perfil da Loja",
      children: (
        <div className="space-y-8">
          <ShopHeaderProfile
            shop={shop}
            onSave={handleSaveProfile}
            isSaving={saving}
          />
          <ManagementGrid
            shopId={shopId}
            schedules={schedules}
            blockedTimes={blockedTimes}
            employeeCount={memberCount}
          />
        </div>
      ),
    },
    {
      key: "advanced",
      label: "Avançado",
      children: (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <SettingsConfigForm
            form={configForm}
            onFinish={handleSaveAdvanced}
            saving={savingAdvanced}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <Tabs defaultActiveKey={activeTab} items={items} />
    </div>
  );
}
