"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button, Form, message, Tabs } from "antd";
import { SaveOutlined, CreditCardOutlined, SettingOutlined } from "@ant-design/icons";
import { useOrganization } from "@/hooks/useOrganizations";
import { organizationService } from "@/services/organizations";
import { SettingsHeader } from "@/components/organization/settings/SettingsHeader";
import { OrganizationInfoForm } from "@/components/organization/settings/OrganizationInfoForm";
import { DangerZone } from "@/components/organization/settings/DangerZone";
import { SubscriptionManagement } from "@/components/organization/settings/SubscriptionManagement";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { data: organization, isLoading } = useOrganization(organizationId);
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentLogo, setCurrentLogo] = React.useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = React.useState("general");

  React.useEffect(() => {
    if (organization) {
      form.setFieldsValue({
        name: organization.name,
        slug: organization.slug,
        document: organization.document,
        isActive: organization.isActive ?? true,
      });
      setCurrentLogo(organization.logoUrl);
    }
  }, [organization, form]);

  const onFinish = async (values: { name: string; document?: string }) => {
    if (!organizationId) return;
    setIsSaving(true);
    try {
      await organizationService.update(organizationId, {
        name: values.name,
        document: values.document?.trim() || undefined,
      });
      message.success("Configurações salvas com sucesso!");
    } catch {
      message.error("Erro ao salvar configurações da organização");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
     return <div className="p-8 text-center text-zinc-500">Carregando configurações...</div>;
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8 pb-20">
      
      <SettingsHeader />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "general",
            label: (
              <span className="flex items-center gap-2">
                <SettingOutlined /> Geral
              </span>
            ),
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                className="space-y-8 pt-6"
              >
                <OrganizationInfoForm
                  organizationId={organizationId}
                  logoUrl={currentLogo}
                  onLogoUpdated={setCurrentLogo}
                />

                <DangerZone />

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100/85 backdrop-blur border-t border-base-content/10 flex justify-end gap-3 z-40 md:pl-80">
                   <div className="max-w-4xl w-full mx-auto flex justify-end gap-3">
                      <Button size="large" className="text-base-content/70 hover:text-base-content border-base-content/20 bg-transparent">
                        Cancelar
                      </Button>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        icon={<SaveOutlined />} 
                        loading={isSaving}
                        className="bg-indigo-600 hover:!bg-indigo-500 border-indigo-500"
                      >
                        Salvar Alterações
                      </Button>
                   </div>
                </div>
              </Form>
            ),
          },
          {
            key: "subscription",
            label: (
              <span className="flex items-center gap-2">
                <CreditCardOutlined /> Assinatura
              </span>
            ),
            children: (
              <div className="pt-6">
                <SubscriptionManagement organizationId={organizationId} />
              </div>
            ),
          },
        ]}
        className="[&_.ant-tabs-nav]:bg-transparent [&_.ant-tabs-nav]:border-b [&_.ant-tabs-nav]:border-base-content/10 [&_.ant-tabs-tab-btn]:text-base-content/70 [&_.ant-tabs-tab:hover_.ant-tabs-tab-btn]:text-base-content [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-base-content [&_.ant-tabs-ink-bar]:!bg-indigo-500"
      />
    </div>
  );
}
