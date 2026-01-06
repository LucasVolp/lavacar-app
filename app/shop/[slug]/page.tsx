"use client";

import { use, useEffect } from "react";
import { Typography, Card, Spin, Alert, Tag, Button, Divider, Row, Col } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useShopBySlug } from "@/hooks/useShops";
import { useServicesByShop } from "@/hooks/useServices";
import { useShopSchedules } from "@/hooks/useSchedules";
import { useShop } from "@/contexts/ShopContext";
import { ServiceCard } from "@/components/booking";

const { Title, Text, Paragraph } = Typography;

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export default function ShopPage({ params }: ShopPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { setShopBySlug } = useShop();

  const {
    data: shop,
    isLoading: shopLoading,
    error: shopError,
  } = useShopBySlug(slug);

  const { data: services = [], isLoading: servicesLoading } = useServicesByShop(
    shop?.id || null,
    !!shop
  );

  const { data: schedules = [], isLoading: schedulesLoading } = useShopSchedules(
    shop?.id || null,
    !!shop
  );

  // Define o shop no contexto quando carregado
  useEffect(() => {
    if (slug) {
      setShopBySlug(slug);
    }
  }, [slug, setShopBySlug]);

  const weekdayLabels: Record<string, string> = {
    MONDAY: "Segunda",
    TUESDAY: "Terça",
    WEDNESDAY: "Quarta",
    THURSDAY: "Quinta",
    FRIDAY: "Sexta",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };

  const weekdayOrder = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const sortedSchedules = [...schedules].sort(
    (a, b) => weekdayOrder.indexOf(a.weekday) - weekdayOrder.indexOf(b.weekday)
  );

  const handleBooking = () => {
    router.push(`/shop/${slug}/booking`);
  };

  if (shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert
          type="error"
          message="Loja não encontrada"
          description="A loja que você está procurando não existe ou foi desativada."
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Loja */}
      <div className="bg-gradient-to-r from-primary to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Tag
                color={shop.status === "ACTIVE" ? "success" : "warning"}
                className="mb-2"
              >
                {shop.status === "ACTIVE" ? "Aberto" : "Fechado"}
              </Tag>
              <Title level={1} className="!text-white !mb-2">
                {shop.name}
              </Title>
              {shop.description && (
                <Paragraph className="text-white/80 text-lg max-w-2xl !mb-0">
                  {shop.description}
                </Paragraph>
              )}
            </div>
            <Button
              type="primary"
              size="large"
              icon={<CalendarOutlined />}
              onClick={handleBooking}
              className="bg-white !text-primary hover:!bg-gray-100 border-none shadow-lg"
            >
              Agendar Agora
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Coluna Principal - Serviços */}
          <Col xs={24} lg={16}>
            <Card className="mb-6">
              <Title level={3} className="!mb-6">
                Nossos Serviços
              </Title>

              {servicesLoading ? (
                <div className="flex justify-center py-8">
                  <Spin />
                </div>
              ) : services.length === 0 ? (
                <Alert
                  type="info"
                  message="Nenhum serviço disponível no momento"
                  showIcon
                />
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      showSelectButton={false}
                    />
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Coluna Lateral - Informações */}
          <Col xs={24} lg={8}>
            {/* Informações de Contato */}
            <Card className="mb-6">
              <Title level={4} className="!mb-4">
                Informações
              </Title>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-lg text-primary mt-1" />
                  <div>
                    <Text strong className="block">
                      Endereço
                    </Text>
                    <Text type="secondary">
                      {shop.street}, {shop.number}
                      {shop.complement && ` - ${shop.complement}`}
                      <br />
                      {shop.neighborhood} - {shop.city}/{shop.state}
                      <br />
                      CEP: {shop.zipCode}
                    </Text>
                  </div>
                </div>

                <Divider className="!my-3" />

                <div className="flex items-start gap-3">
                  <PhoneOutlined className="text-lg text-primary mt-1" />
                  <div>
                    <Text strong className="block">
                      Telefone
                    </Text>
                    <Text type="secondary">{shop.phone}</Text>
                  </div>
                </div>

                {shop.email && (
                  <>
                    <Divider className="!my-3" />
                    <div className="flex items-start gap-3">
                      <StarOutlined className="text-lg text-primary mt-1" />
                      <div>
                        <Text strong className="block">
                          Email
                        </Text>
                        <Text type="secondary">{shop.email}</Text>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Horários de Funcionamento */}
            <Card>
              <Title level={4} className="!mb-4">
                <ClockCircleOutlined className="mr-2" />
                Horários de Funcionamento
              </Title>

              {schedulesLoading ? (
                <div className="flex justify-center py-4">
                  <Spin />
                </div>
              ) : schedules.length === 0 ? (
                <Text type="secondary">
                  Horários não disponíveis
                </Text>
              ) : (
                <div className="space-y-2">
                  {sortedSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex justify-between items-center py-1"
                    >
                      <Text
                        className={
                          schedule.isOpen !== "ACTIVE"
                            ? "text-gray-400"
                            : ""
                        }
                      >
                        {weekdayLabels[schedule.weekday]}
                      </Text>
                      {schedule.isOpen === "ACTIVE" ? (
                        <Text type="secondary">
                          {schedule.startTime} - {schedule.endTime}
                        </Text>
                      ) : (
                        <Tag color="default">Fechado</Tag>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* CTA Mobile */}
            <div className="mt-6 lg:hidden">
              <Button
                type="primary"
                size="large"
                icon={<CalendarOutlined />}
                onClick={handleBooking}
                block
              >
                Agendar Agora
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
