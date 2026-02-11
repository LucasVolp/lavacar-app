"use client";

import React, { useState } from "react";
import { Spin, message } from "antd";
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

/**
 * Settings Command Center - Dashboard Administrativa da Loja
 * Visual style: Professional profile interface with quick management cards
 */
export default function SettingsPage() {
  const { shop, shopId, isLoading } = useShopAdmin();
  const updateShop = useUpdateShop();
  const [saving, setSaving] = useState(false);

  // Fetch related data for management cards
  const { data: schedulesData } = useShopSchedules(shopId);
  const { data: blockedTimesData } = useShopBlockedTimes(shopId);
  const { data: membersData } = useOrganizationMembers(shop?.organizationId || "");

  // Normalize data - services return arrays directly
  const schedules = schedulesData ?? [];
  const blockedTimes = blockedTimesData ?? [];
  const memberCount = membersData?.length ?? 0;

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

  if (isLoading || !shop) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando configurações..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Shop Header Profile - View/Edit Mode */}
      <ShopHeaderProfile
        shop={shop}
        onSave={handleSaveProfile}
        isSaving={saving}
      />

      {/* Management Grid - Quick access cards */}
      <ManagementGrid
        shopId={shopId}
        schedules={schedules}
        blockedTimes={blockedTimes}
        employeeCount={memberCount}
      />

      {/* Address Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Informações Adicionais
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Scheduling Config Summary */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-2">
              Intervalo de Slots
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {shop.slotInterval} <span className="text-sm font-normal text-zinc-500">min</span>
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-2">
              Agendamento Antecipado
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {shop.maxAdvanceDays} <span className="text-sm font-normal text-zinc-500">dias</span>
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium mb-2">
              Antecedência Mínima
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {shop.minAdvanceMinutes} <span className="text-sm font-normal text-zinc-500">min</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
          Para alterar estas configurações, acesse{" "}
          <a
            href={`/admin/shop/${shopId}/settings/advanced`}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Configurações Avançadas
          </a>.
        </p>
      </div>
    </div>
  );
}
