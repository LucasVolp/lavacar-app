"use client";

import React, { useState } from "react";
import { Row, Col, message } from "antd";
import {
  SettingsHeader,
  ShopInfoForm,
  AddressForm,
  NotificationSettingsForm,
  type ShopInfo,
  type AddressInfo,
  type NotificationSettings,
} from "@/components/owner/settings";

// Mock data
const initialShopInfo: ShopInfo = {
  name: "Auto Lavagem Central",
  description: "Lavagem automotiva de qualidade, com mais de 10 anos de experiência.",
  phone: "(11) 99999-1234",
  email: "contato@autolavagem.com",
};

const initialAddress: AddressInfo = {
  zipCode: "01310-100",
  street: "Avenida Paulista",
  number: "1000",
  complement: "Loja 1",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
};

const initialNotifications: NotificationSettings = {
  emailNewAppointment: true,
  emailCancellation: true,
  whatsappNewAppointment: true,
  whatsappReminder: false,
};

export default function OwnerSettingsPage() {
  const [shopInfo, setShopInfo] = useState<ShopInfo>(initialShopInfo);
  const [address, setAddress] = useState<AddressInfo>(initialAddress);
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleShopInfoChange = (values: ShopInfo) => {
    setShopInfo(values);
    setHasChanges(true);
  };

  const handleAddressChange = (values: AddressInfo) => {
    setAddress(values);
    setHasChanges(true);
  };

  const handleNotificationsChange = (values: NotificationSettings) => {
    setNotifications(values);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    message.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SettingsHeader
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <div className="space-y-4">
            <ShopInfoForm
              initialValues={shopInfo}
              onChange={handleShopInfoChange}
            />
            <AddressForm
              initialValues={address}
              onChange={handleAddressChange}
            />
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <NotificationSettingsForm
            settings={notifications}
            onChange={handleNotificationsChange}
          />
        </Col>
      </Row>
    </div>
  );
}
