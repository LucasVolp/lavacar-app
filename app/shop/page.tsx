"use client";

import React, { useMemo, useState } from "react";
import { message, Modal as AntModal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  ShopFilters,
  ShopList,
  ShopPageHeader,
  ShopDetailModal,
} from "@/components/shop";
import { Shop, ShopStatus } from "@/types/shop";

const MOCK_SHOPS: Shop[] = [
  {
    id: "shop_1",
    name: "Auto Lavagem Central",
    slug: "auto-lavagem-central",
    description:
      "Lavagem completa, polimento profissional e cuidado especializado com seu veículo. Trabalhamos com os melhores produtos do mercado.",
    document: "12.345.678/0001-00",
    phone: "(11) 99999-0000",
    email: "contato@autolavagem.com",
    status: "ACTIVE",
    zipCode: "01000-000",
    street: "Rua Principal",
    number: "123",
    complement: "Loja A",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    slotInterval: 30,
    bufferBetweenSlots: 5,
    maxAdvanceDays: 30,
    minAdvanceMinutes: 60,
    organizationId: "org_1",
    ownerId: "user_1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "shop_2",
    name: "Brilho Rápido Express",
    slug: "brilho-rapido",
    description:
      "Lavagem express e enceramento de alta qualidade. Seu carro pronto em minutos!",
    document: "98.765.432/0001-99",
    phone: "(21) 98888-1111",
    email: "contato@brilhorapido.com",
    status: "INACTIVE",
    zipCode: "20000-000",
    street: "Avenida Secundária",
    number: "456",
    complement: undefined,
    neighborhood: "Bairro Alto",
    city: "Rio de Janeiro",
    state: "RJ",
    slotInterval: 20,
    bufferBetweenSlots: 10,
    maxAdvanceDays: 15,
    minAdvanceMinutes: 30,
    organizationId: "org_2",
    ownerId: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "shop_3",
    name: "Premium Car Wash",
    slug: "premium-car-wash",
    description:
      "Serviços premium para carros de luxo. Lavagem detalhada, polimento cristalizado e higienização completa.",
    document: "11.222.333/0001-44",
    phone: "(11) 97777-2222",
    email: "premium@carwash.com",
    status: "ACTIVE",
    zipCode: "04000-000",
    street: "Alameda dos Automóveis",
    number: "789",
    complement: "Galpão 2",
    neighborhood: "Jardim Paulista",
    city: "São Paulo",
    state: "SP",
    slotInterval: 45,
    bufferBetweenSlots: 15,
    maxAdvanceDays: 60,
    minAdvanceMinutes: 120,
    organizationId: "org_3",
    ownerId: "user_2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "shop_4",
    name: "Lava Jato do Zé",
    slug: "lava-jato-ze",
    description: "Atendimento familiar há mais de 20 anos. Qualidade e preço justo.",
    document: "55.666.777/0001-88",
    phone: "(31) 96666-3333",
    email: "lavajatodoze@email.com",
    status: "SUSPENDED",
    zipCode: "30000-000",
    street: "Rua das Flores",
    number: "321",
    complement: undefined,
    neighborhood: "Santa Efigênia",
    city: "Belo Horizonte",
    state: "MG",
    slotInterval: 30,
    bufferBetweenSlots: 0,
    maxAdvanceDays: 7,
    minAdvanceMinutes: 30,
    organizationId: "org_4",
    ownerId: "user_3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ShopPage() {
  const [query, setQuery] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<ShopStatus | undefined>();
  const [stateFilter, setStateFilter] = useState<string | undefined>();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredShops = useMemo(() => {
    return MOCK_SHOPS.filter((shop) => {
      if (query) {
        const searchLower = query.toLowerCase();
        const matchesSearch =
          shop.name.toLowerCase().includes(searchLower) ||
          shop.description?.toLowerCase().includes(searchLower) ||
          shop.city.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (statusFilter && shop.status !== statusFilter) return false;

      if (stateFilter && shop.state !== stateFilter) return false;

      return true;
    });
  }, [query, statusFilter, stateFilter]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.success("Lista atualizada!");
    }, 1000);
  };

  const handleCreate = () => {
    message.info("Funcionalidade de criação em desenvolvimento");
  };

  const handleEdit = (shop: Shop) => {
    message.info(`Editar loja: ${shop.name}`);
  };

  const handleDelete = (id: string) => {
    const shop = MOCK_SHOPS.find((s) => s.id === id);
    AntModal.confirm({
      title: "Confirmar exclusão",
      icon: <ExclamationCircleOutlined />,
      content: `Deseja realmente excluir a loja "${shop?.name}"? Esta ação não pode ser desfeita.`,
      okText: "Excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        message.success("Loja excluída com sucesso!");
      },
    });
  };

  const handleClearFilters = () => {
    setQuery(undefined);
    setStatusFilter(undefined);
    setStateFilter(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ShopPageHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        totalCount={filteredShops.length}
      />

      <ShopFilters
        onSearch={setQuery}
        onFilter={setStatusFilter}
        onStateFilter={setStateFilter}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
      />

      <ShopList
        shops={filteredShops}
        isLoading={isLoading}
        onView={setSelectedShop}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ShopDetailModal
        shop={selectedShop}
        open={!!selectedShop}
        onClose={() => setSelectedShop(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}
