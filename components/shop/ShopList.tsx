"use client";

import React from "react";
import { Empty, Row, Col, Spin, Typography } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import { Shop } from "@/types/shop";
import ShopCard from "./ShopCard";

const { Text } = Typography;

interface ShopListProps {
  shops: Shop[];
  isLoading?: boolean;
  onView?: (shop: Shop) => void;
  onEdit?: (shop: Shop) => void;
  onDelete?: (id: string) => void;
}

export default function ShopList({
  shops,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: ShopListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spin size="large" />
        <Text type="secondary" className="mt-4">
          Carregando lojas...
        </Text>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body py-16">
          <Empty
            image={
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center">
                  <ShopOutlined className="text-4xl text-base-content/30" />
                </div>
              </div>
            }
            description={
              <div className="text-center">
                <Text strong className="text-lg block mb-2">
                  Nenhuma loja encontrada
                </Text>
                <Text type="secondary">
                  Tente ajustar os filtros ou crie uma nova loja
                </Text>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {shops.map((shop, index) => (
        <Col
          key={shop.id}
          xs={24}
          sm={24}
          md={12}
          lg={8}
          xl={6}
          className="animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ShopCard
            shop={shop}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Col>
      ))}
    </Row>
  );
}
