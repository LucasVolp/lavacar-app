"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button, Form, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useOrganization } from "@/hooks/useOrganizations";
import { SettingsHeader } from "@/components/organization/settings/SettingsHeader";
import { OrganizationInfoForm } from "@/components/organization/settings/OrganizationInfoForm";
import { DangerZone } from "@/components/organization/settings/DangerZone";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const organizationId = params?.organizationId as string;
  const { data: organization, isLoading } = useOrganization(organizationId);
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (organization) {
      form.setFieldsValue({
        name: organization.name,
        slug: organization.slug,
        document: organization.document,
        isActive: organization.isActive ?? true,
      });
    }
  }, [organization, form]);

  const onFinish = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      message.success("Configurações salvas com sucesso!");
    }, 1000);
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
        <OrganizationInfoForm logoUrl={organization?.logoUrl} />

        <DangerZone />

        {/* Footer Actions */}
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