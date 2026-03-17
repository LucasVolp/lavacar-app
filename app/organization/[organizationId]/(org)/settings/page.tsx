"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button, Form, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useOrganization } from "@/hooks/useOrganizations";
import { organizationService } from "@/services/organizations";
import { SettingsHeader } from "@/components/organization/settings/SettingsHeader";
import { OrganizationInfoForm } from "@/components/organization/settings/OrganizationInfoForm";
import { DangerZone } from "@/components/organization/settings/DangerZone";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { data: organization, isLoading } = useOrganization(organizationId);
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentLogo, setCurrentLogo] = React.useState<string | undefined>(undefined);

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

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="space-y-8"
      >
        <OrganizationInfoForm
          organizationId={organizationId}
          logoUrl={currentLogo}
          onLogoUpdated={setCurrentLogo}
        />

        <DangerZone />

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950/80 backdrop-blur border-t border-zinc-900 flex justify-end gap-3 z-40 md:pl-80">
           <div className="max-w-4xl w-full mx-auto flex justify-end gap-3">
              <Button size="large" className="text-zinc-400 hover:text-white border-zinc-700 bg-transparent">
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
    </div>
  );
}
