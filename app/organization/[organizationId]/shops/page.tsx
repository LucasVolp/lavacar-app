"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Row, Col, Button, Tag, Spin, Empty, Typography, Input } from "antd";
import { ShopOutlined, EnvironmentOutlined, RightOutlined, SearchOutlined, LeftOutlined } from "@ant-design/icons";
import { useOrganization } from "@/hooks/useOrganizations";
import { SHOP_STATUS_MAP, Shop } from "@/types/shop";

const { Title, Text } = Typography;

/**
 * Lista de Shops da Organization
 * 
 * Rota: /organization/[organizationId]/shops
 * 
 * Exibe todos os shops vinculados à organization em formato de grid.
 */
export default function OrganizationShopsPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.organizationId as string;

  const { data: organization, isLoading, error } = useOrganization(organizationId);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleManageShop = (shop: Shop) => {
    router.push(`/shop/${shop.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Carregando shops..." />
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
  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6">
        <Button
          type="link"
          icon={<LeftOutlined />}
          onClick={() => router.push(`/organization/${organizationId}`)}
          className="!pl-0 mb-3"
        >
          Voltar para {organization.name}
        </Button>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Title level={3} className="!mb-1">
              Estabelecimentos
            </Title>
            <Text type="secondary">
              {shops.length} {shops.length === 1 ? "estabelecimento" : "estabelecimentos"} cadastrados
            </Text>
          </div>

          <Input
            placeholder="Buscar por nome ou cidade..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
            allowClear
          />
        </div>
      </Card>

      {/* Grid de Shops */}
      {filteredShops.length === 0 ? (
        <Card>
          <Empty
            description={searchTerm ? "Nenhum resultado encontrado" : "Nenhum estabelecimento cadastrado"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredShops.map((shop) => {
            const statusInfo = SHOP_STATUS_MAP[shop.status];

            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={shop.id}>
                <Card
                  hoverable
                  className="h-full"
                  onClick={() => handleManageShop(shop)}
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShopOutlined className="text-xl text-blue-500" />
                      <Title level={5} className="!m-0 truncate">
                        {shop.name}
                      </Title>
                    </div>

                    <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <EnvironmentOutlined />
                    <Text type="secondary" className="truncate">
                      {shop.city}, {shop.state}
                    </Text>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button
                      type="primary"
                      icon={<RightOutlined />}
                      block
                    >
                      Gerenciar
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
