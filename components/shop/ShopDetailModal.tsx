"use client";

import React from "react";
import {
  Modal,
  Typography,
  Descriptions,
  Tag,
  Space,
  Button,
  Divider,
  Avatar,
} from "antd";
import {
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SettingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Shop, SHOP_STATUS_MAP } from "@/types/shop";
import { maskPhone } from "@/lib/masks";

const { Title, Text, Paragraph } = Typography;

interface ShopDetailModalProps {
  shop: Shop | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (shop: Shop) => void;
}

export default function ShopDetailModal({
  shop,
  open,
  onClose,
  onEdit,
}: ShopDetailModalProps) {
  if (!shop) return null;

  const statusInfo = SHOP_STATUS_MAP[shop.status];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={700}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Fechar</Button>
          {onEdit && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(shop)}>
              Editar Loja
            </Button>
          )}
        </div>
      }
      title={
        <div className="flex items-center gap-4">
          <Avatar
            size={48}
            icon={<ShopOutlined />}
            className="bg-gradient-to-br from-primary to-secondary"
          />
          <div>
            <Title level={4} className="!mb-0">
              {shop.name}
            </Title>
            <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
          </div>
        </div>
      }
    >
      <div className="py-4">
        {/* Description */}
        {shop.description && (
          <>
            <Paragraph type="secondary" className="mb-4">
              {shop.description}
            </Paragraph>
            <Divider />
          </>
        )}

        {/* Contact Information */}
        <div className="mb-6">
          <Title level={5} className="flex items-center gap-2 !mb-4">
            <PhoneOutlined className="text-primary" />
            Contato
          </Title>
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex items-center gap-3">
              <PhoneOutlined className="text-base-content/40" />
              <Text copyable={{ tooltips: ["Copiar", "Copiado!"] }}>
                {maskPhone(shop.phone)}
              </Text>
            </div>
            {shop.email && (
              <div className="flex items-center gap-3">
                <MailOutlined className="text-base-content/40" />
                <Text copyable={{ tooltips: ["Copiar", "Copiado!"] }}>
                  {shop.email}
                </Text>
              </div>
            )}
          </Space>
        </div>

        <Divider />

        {/* Address */}
        <div className="mb-6">
          <Title level={5} className="flex items-center gap-2 !mb-4">
            <EnvironmentOutlined className="text-primary" />
            Endereço
          </Title>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Logradouro">
              {shop.street}, {shop.number}
              {shop.complement && ` - ${shop.complement}`}
            </Descriptions.Item>
            <Descriptions.Item label="Bairro">{shop.neighborhood}</Descriptions.Item>
            <Descriptions.Item label="Cidade">
              {shop.city} / {shop.state}
            </Descriptions.Item>
            <Descriptions.Item label="CEP">{shop.zipCode}</Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Scheduling Settings */}
        <div>
          <Title level={5} className="flex items-center gap-2 !mb-4">
            <SettingOutlined className="text-primary" />
            Configurações de Agendamento
          </Title>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-base-200/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ClockCircleOutlined className="text-info" />
                <Text type="secondary" className="text-xs">Intervalo entre slots</Text>
              </div>
              <Text strong className="text-lg">{shop.slotInterval} minutos</Text>
            </div>
            <div className="p-4 bg-base-200/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ClockCircleOutlined className="text-warning" />
                <Text type="secondary" className="text-xs">Buffer entre slots</Text>
              </div>
              <Text strong className="text-lg">{shop.bufferBetweenSlots} minutos</Text>
            </div>
            <div className="p-4 bg-base-200/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarOutlined className="text-success" />
                <Text type="secondary" className="text-xs">Antecedência máxima</Text>
              </div>
              <Text strong className="text-lg">{shop.maxAdvanceDays} dias</Text>
            </div>
            <div className="p-4 bg-base-200/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ClockCircleOutlined className="text-error" />
                <Text type="secondary" className="text-xs">Antecedência mínima</Text>
              </div>
              <Text strong className="text-lg">{shop.minAdvanceMinutes} minutos</Text>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
