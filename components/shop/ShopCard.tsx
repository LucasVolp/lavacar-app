"use client";

import React from "react";
import { Card, Typography, Button, Tooltip, Space, Avatar, Tag } from "antd";
import {
  ShopOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Shop, SHOP_STATUS_MAP } from "@/types/shop";
import { maskPhone } from "@/lib/masks";

const { Title, Text, Paragraph } = Typography;

interface ShopCardProps {
  shop: Shop;
  onView?: (shop: Shop) => void;
  onEdit?: (shop: Shop) => void;
  onDelete?: (id: string) => void;
}

export default function ShopCard({ shop, onView, onEdit, onDelete }: ShopCardProps) {
  const statusInfo = SHOP_STATUS_MAP[shop.status];

  return (
    <Card
      className="h-full transition-all duration-300 relative group shadow-sm hover:shadow-lg border border-base-200 flex flex-col"
      hoverable
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "1.25rem",
        },
      }}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-1">
        {onView && (
          <Tooltip title="Visualizar">
            <Button
              size="small"
              type="text"
              className="hover:bg-base-200 text-base-content rounded-full"
              icon={<EyeOutlined />}
              onClick={() => onView(shop)}
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Editar">
            <Button
              size="small"
              type="text"
              className="hover:bg-base-200 text-base-content rounded-full"
              icon={<EditOutlined />}
              onClick={() => onEdit(shop)}
            />
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Excluir">
            <Button
              size="small"
              type="text"
              danger
              className="hover:bg-error/10 rounded-full"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(shop.id)}
            />
          </Tooltip>
        )}
      </div>

      <div className="flex items-start gap-4 mb-4">
        <Avatar
          size={56}
          icon={<ShopOutlined />}
          className="bg-gradient-to-br from-primary to-secondary shadow-md flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Title
              level={5}
              className="!mb-0 !text-base-content truncate"
              title={shop.name}
            >
              {shop.name}
            </Title>
          </div>
          <Tag color={statusInfo.color} className="mt-1">
            {statusInfo.label}
          </Tag>
        </div>
      </div>

      {shop.description && (
        <Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          className="mb-4 text-sm"
        >
          {shop.description}
        </Paragraph>
      )}

      <Space orientation="vertical" size="small" className="w-full mb-4 flex-grow">
        <div className="flex items-center gap-2 text-sm">
          <EnvironmentOutlined className="text-primary flex-shrink-0" />
          <Text type="secondary" className="truncate">
            {shop.city}, {shop.state}
          </Text>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <ShopOutlined className="text-base-content/40 flex-shrink-0" />
          <Text type="secondary" className="truncate" title={`${shop.street}, ${shop.number}`}>
            {shop.street}, {shop.number}
            {shop.complement && ` - ${shop.complement}`}
          </Text>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <PhoneOutlined className="text-success flex-shrink-0" />
          <Text className="text-base-content">{maskPhone(shop.phone)}</Text>
        </div>

        {shop.email && (
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-info flex-shrink-0" />
            <Text type="secondary" className="truncate">
              {shop.email}
            </Text>
          </div>
        )}
      </Space>

      <div className="border-t border-base-200 my-3" />

      <div className="flex items-center justify-between text-xs text-base-content/60">
        <Tooltip title="Intervalo entre slots">
          <div className="flex items-center gap-1">
            <ClockCircleOutlined />
            <span>{shop.slotInterval}min</span>
          </div>
        </Tooltip>
        <Tooltip title="Dias de antecedência máxima">
          <div className="flex items-center gap-1">
            <CalendarOutlined />
            <span>{shop.maxAdvanceDays} dias</span>
          </div>
        </Tooltip>
      </div>

      {onView && (
        <Button
          type="primary"
          ghost
          block
          className="mt-4"
          onClick={() => onView(shop)}
        >
          Ver detalhes
        </Button>
      )}
    </Card>
  );
}
