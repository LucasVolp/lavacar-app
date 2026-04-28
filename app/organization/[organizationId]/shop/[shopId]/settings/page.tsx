"use client";

import React, { useEffect, useState } from "react";
import { Spin, message, Form, Tabs, Tooltip } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useShopAdmin } from "@/contexts/ShopAdminContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateShop } from "@/hooks/useShops";
import { EmployeeAccessDenied } from "@/components/layout/EmployeeAccessDenied";
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
  const { shop, shopId, organizationId, isLoading } = useShopAdmin();
  const { user } = useAuth();

  const isEmployee = (() => {
    if (!user || !organizationId) return false;
    if (user.id === shop?.ownerId) return false;
    if (user.role === "ADMIN") return false;
    if (user.organizations?.some((org: { id: string }) => org.id === organizationId)) return false;
    const membership = user.organizationMembers?.find((m: { organizationId: string; role: string }) => m.organizationId === organizationId);
    return membership?.role === "EMPLOYEE";
  })();
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

  if (isEmployee) {
    return <EmployeeAccessDenied shopId={shopId} organizationId={organizationId} />;
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
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Configurações</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{shop.name}</p>
        </div>
        {shop.slug && (
          <Tooltip title="Abrir vitrine digital em nova aba">
            <Link
              href={`/shop/${shop.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors min-h-[44px]"
            >
              <GlobalOutlined />
              Ver Vitrine
            </Link>
          </Tooltip>
        )}
      </div>
      <Tabs defaultActiveKey={activeTab} items={items} />
    </div>
  );
}
