"use client";

import React from "react";
import { Button, Typography, Card, Row, Col, Space } from "antd";
import {
  ShopOutlined,
  UserOutlined,
  CarOutlined,
  CalendarOutlined,
  SettingOutlined,
  ArrowRightOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

const ownerFeatures = [
  { icon: <SettingOutlined />, text: "Gerencie seu estabelecimento" },
  { icon: <CalendarOutlined />, text: "Controle de agendamentos" },
  { icon: <StarOutlined />, text: "Acompanhe avaliações" },
];

const clientFeatures = [
  { icon: <CarOutlined />, text: "Cadastre seus veículos" },
  { icon: <CalendarOutlined />, text: "Agende serviços" },
  { icon: <CheckCircleOutlined />, text: "Acompanhe seus atendimentos" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24">
          <div className="text-center mb-16">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                <span className="text-white font-bold text-5xl">L</span>
              </div>
            </div>

            {/* Title */}
            <Title level={1} className="!text-4xl sm:!text-5xl !mb-4">
              Bem-vindo ao{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Lavacar
              </span>
            </Title>

            {/* Subtitle */}
            <Paragraph className="text-lg sm:text-xl text-base-content/70 max-w-2xl mx-auto">
              Sistema completo de agendamentos para lava-cars. 
              Escolha como deseja acessar:
            </Paragraph>
          </div>

          {/* Access Options */}
          <Row gutter={[32, 32]} justify="center">
            {/* Owner Card */}
            <Col xs={24} md={12} lg={10}>
              <Link href="/owner">
                <Card
                  hoverable
                  className="h-full border-2 border-transparent hover:border-primary transition-all duration-300 overflow-hidden group"
                  styles={{ body: { padding: 0 } }}
                >
                  {/* Header gradient */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ShopOutlined className="text-4xl text-white" />
                    </div>
                    <Title level={3} className="!text-white !mb-0">
                      Sou Dono de Estabelecimento
                    </Title>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Paragraph type="secondary" className="text-center mb-6">
                      Acesse o painel administrativo para gerenciar seu lava-car
                    </Paragraph>

                    <Space direction="vertical" className="w-full" size="middle">
                      {ownerFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg"
                        >
                          <span className="text-primary text-lg">{feature.icon}</span>
                          <Text>{feature.text}</Text>
                        </div>
                      ))}
                    </Space>

                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<ArrowRightOutlined />}
                      className="mt-6 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      Acessar Painel do Dono
                    </Button>
                  </div>
                </Card>
              </Link>
            </Col>

            {/* Client Card */}
            <Col xs={24} md={12} lg={10}>
              <Link href="/client">
                <Card
                  hoverable
                  className="h-full border-2 border-transparent hover:border-info transition-all duration-300 overflow-hidden group"
                  styles={{ body: { padding: 0 } }}
                >
                  {/* Header gradient */}
                  <div className="bg-gradient-to-r from-info to-cyan-500 p-6 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <UserOutlined className="text-4xl text-white" />
                    </div>
                    <Title level={3} className="!text-white !mb-0">
                      Sou Cliente
                    </Title>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Paragraph type="secondary" className="text-center mb-6">
                      Acesse sua conta para gerenciar veículos e agendamentos
                    </Paragraph>

                    <Space direction="vertical" className="w-full" size="middle">
                      {clientFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg"
                        >
                          <span className="text-info text-lg">{feature.icon}</span>
                          <Text>{feature.text}</Text>
                        </div>
                      ))}
                    </Space>

                    <Button
                      size="large"
                      block
                      icon={<ArrowRightOutlined />}
                      className="mt-6 h-12 border-info text-info hover:bg-info hover:text-white"
                    >
                      Acessar Área do Cliente
                    </Button>
                  </div>
                </Card>
              </Link>
            </Col>
          </Row>

          {/* Footer info */}
          <div className="text-center mt-16">
            <Text type="secondary" className="text-sm">
              © {new Date().getFullYear()} Lavacar - Sistema de Agendamentos para Lava-Cars
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
