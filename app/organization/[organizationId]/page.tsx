"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Row, Col, Button, Tag, Spin, Empty, Typography, Statistic } from "antd";
import { ShopOutlined, EnvironmentOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useOrganization } from "@/hooks/useOrganizations";
import { SHOP_STATUS_MAP, Shop } from "@/types/shop";

const { Title, Text } = Typography;

/**
 * Dashboard da Organization
 * 
 * Rota: /organization/[organizationId]
 * 
 * Exibe informações da organization e lista de shops vinculados.
 * Se houver apenas um shop, redireciona automaticamente para ele.
 */
export default function OrganizationDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string;

  const { data: organization, isLoading, error } = useOrganization(organizationId);

  // Redirecionar automaticamente se houver apenas um shop
  useEffect(() => {
    if (organization?.shops?.length === 1) {
      const singleShop = organization.shops[0];
      router.replace(`/shop/${singleShop.id}`);
    }
  }, [organization, router]);

  const handleManageShop = (shop: Shop) => {
    router.push(`/admin/shop/${shop.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando organização..." />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <Card>
        <Empty
          description="Organização não encontrada"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => router.push("/")}>
            Voltar ao Início
          </Button>
        </Empty>
      </Card>
    );
  }

  const shops = organization.shops || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header da Organization */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {organization.logoUrl && (
            <Image
              src={organization.logoUrl}
              alt={organization.name}
              width={64}
              height={64}
              className="rounded-lg object-cover"
            />
          )}
          <div>
            <Title level={2} className="!mb-1">
              {organization.name}
            </Title>
            <Text type="secondary">
              Gerencie seus estabelecimentos e visualize o desempenho geral
            </Text>
          </div>
        </div>

        {/* Stats da Organization */}
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Estabelecimentos"
              value={shops.length}
              prefix={<ShopOutlined />}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Ativos"
              value={shops.filter((s) => s.status === "ACTIVE").length}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
        </Row>
      </Card>

      {/* Lista de Shops */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <ShopOutlined />
            <span>Estabelecimentos ({shops.length})</span>
          </div>
        }
      >
        {shops.length === 0 ? (
          <Empty
            description="Nenhum estabelecimento cadastrado"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {shops.map((shop) => {
              const statusInfo = SHOP_STATUS_MAP[shop.status];

              return (
                <Col xs={24} md={12} lg={8} key={shop.id}>
                  <Card
                    hoverable
                    className="h-full"
                    actions={[
                      <Button
                        key="manage"
                        type="primary"
                        icon={<RightOutlined />}
                        onClick={() => handleManageShop(shop)}
                      >
                        Gerenciar Loja
                      </Button>,
                    ]}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ShopOutlined className="text-xl text-blue-500" />
                        <Title level={5} className="!m-0">
                          {shop.name}
                        </Title>
                      </div>

                      <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                      <EnvironmentOutlined />
                      <Text type="secondary">
                        {shop.city}, {shop.state}
                      </Text>
                    </div>

                    {shop.description && (
                      <Text
                        type="secondary"
                        className="block mt-3 text-sm line-clamp-2"
                      >
                        {shop.description}
                      </Text>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>
    </div>
  );
}
