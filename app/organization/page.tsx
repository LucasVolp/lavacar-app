"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Spin, Button, Card, Typography, Row, Col } from "antd";
import { ShopOutlined, PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganizationByOwner } from "@/hooks/useOrganizations";

const { Title, Text } = Typography;

export default function OrganizationIndexPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const { 
    data: organizations = [], 
    isLoading: orgLoading 
  } = useOrganizationByOwner(user?.id);

  const isLoading = authLoading || (isAuthenticated && orgLoading);

  const orgList = useMemo(() => Array.isArray(organizations) ? organizations : [], [organizations]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/organization");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && orgList.length === 1) {
      router.push(`/organization/${orgList[0].id}`);
    }
  }, [isLoading, orgList, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Carregando seus negócios..." />
      </div>
    );
  }

  if (orgList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
        <Card className="w-full max-w-md shadow-lg rounded-2xl border-0 text-center py-8">
          <div className="mb-6 inline-flex p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-4xl">
            <ShopOutlined />
          </div>
          <Title level={3} className="!mb-2 dark:!text-white">Nenhuma Organização</Title>
          <Text className="text-zinc-500 dark:text-zinc-400 block mb-8">
            Você ainda não possui nenhuma organização cadastrada. Crie uma agora para começar a gerenciar seus estabelecimentos.
          </Text>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />}
            onClick={() => router.push("/organization/create")}
            className="bg-blue-600 hover:bg-blue-500 h-12 px-8 rounded-xl"
          >
            Criar Organização
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={2} className="!mb-1 dark:!text-white">Meus Negócios</Title>
            <Text className="text-zinc-500 dark:text-zinc-400">Selecione uma organização para gerenciar</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => router.push("/organization/create")}
            className="bg-blue-600"
          >
            Nova Organização
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {orgList.map(org => (
            <Col xs={24} sm={12} md={8} key={org.id}>
              <Card 
                hoverable
                className="h-full rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden group cursor-pointer transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg"
                onClick={() => router.push(`/organization/${org.id}`)}
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                        {org.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${org.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                        {org.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                    <Title level={4} className="!mb-1 !text-lg dark:!text-white group-hover:text-blue-500 transition-colors">
                      {org.name}
                    </Title>
                    <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                      {org.document || "Sem documento"}
                    </Text>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 group-hover:translate-x-1 transition-transform">
                    Acessar Painel <ArrowRightOutlined />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
