"use client";

import React, { useState } from "react";
import { Button, Card, Input, InputNumber, Row, Col, message, Tooltip } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export interface ServiceRow {
  name: string;
  description?: string;
  price: number;
  duration: number;
}

interface StepServicesProps {
  shopId: string;
  isSubmitting: boolean;
  onSubmit: (services: ServiceRow[]) => Promise<void>;
  onSkip: () => void;
  onBack: () => void;
}

const SECTION_CONTAINER_CLASS =
  "bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200";

const SUGGESTIONS: ServiceRow[] = [
  { name: "Lavagem Simples", description: "Lavagem externa completa do veículo", price: 40, duration: 30 },
  { name: "Lavagem Completa", description: "Lavagem interna e externa com aspiração", price: 70, duration: 60 },
  { name: "Polimento", description: "Polimento profissional da pintura", price: 150, duration: 120 },
  { name: "Higienização Interna", description: "Limpeza profunda dos estofados e painel", price: 120, duration: 90 },
  { name: "Enceramento", description: "Aplicação de cera protetora", price: 80, duration: 45 },
  { name: "Lavagem de Motor", description: "Limpeza e desengraxe do motor", price: 60, duration: 40 },
];

export const StepServices: React.FC<StepServicesProps> = ({
  isSubmitting,
  onSubmit,
  onSkip,
  onBack,
}) => {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<{ price: number; duration: number }>({
    price: 0,
    duration: 30,
  });
  const [newService, setNewService] = useState<ServiceRow>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
  });

  const addService = (service: ServiceRow) => {
    if (!service.name.trim()) {
      message.warning("Informe o nome do serviço.");
      return;
    }
    if (service.price <= 0) {
      message.warning("Informe um preço válido.");
      return;
    }
    if (service.duration <= 0) {
      message.warning("Informe uma duração válida.");
      return;
    }
    if (services.some((s) => s.name.toLowerCase() === service.name.toLowerCase())) {
      message.warning("Serviço com esse nome já foi adicionado.");
      return;
    }

    setServices((prev) => [...prev, { ...service }]);
    setNewService({ name: "", description: "", price: 0, duration: 30 });
  };

  const addSuggestion = (suggestion: ServiceRow) => {
    if (services.some((s) => s.name.toLowerCase() === suggestion.name.toLowerCase())) {
      message.info("Este serviço já foi adicionado.");
      return;
    }
    setServices((prev) => [...prev, { ...suggestion }]);
  };

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const openEditService = (index: number) => {
    const service = services[index];
    if (!service) return;
    setEditingDraft({ price: service.price, duration: service.duration });
    setEditingIndex(index);
  };

  const cancelEditService = () => {
    setEditingIndex(null);
  };

  const saveEditService = (index: number) => {
    if (editingDraft.price <= 0) {
      message.warning("Informe um preço válido.");
      return;
    }
    if (editingDraft.duration <= 0) {
      message.warning("Informe uma duração válida.");
      return;
    }

    setServices((prev) =>
      prev.map((service, i) =>
        i === index
          ? {
              ...service,
              price: editingDraft.price,
              duration: editingDraft.duration,
            }
          : service
      )
    );
    setEditingIndex(null);
  };

  const handleSubmit = async () => {
    if (services.length === 0) {
      message.warning("Adicione ao menos um serviço ou clique em 'Pular'.");
      return;
    }
    await onSubmit(services);
  };

  const isSuggestionAdded = (name: string) =>
    services.some((s) => s.name.toLowerCase() === name.toLowerCase());

  return (
    <>
      <div className={SECTION_CONTAINER_CLASS}>
        <Card
          bordered={false}
          title={<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Catálogo de Serviços</span>}
          className="bg-transparent"
          styles={{ header: { padding: "24px 32px 0", borderBottom: "none" }, body: { padding: 32 } }}
        >
          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4">
                <ThunderboltOutlined className="mr-1" />
                Sugestões rápidas — clique para adicionar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTIONS.map((s) => {
                  const added = isSuggestionAdded(s.name);
                  return (
                    <div
                      key={s.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => !added && addSuggestion(s)}
                      onKeyDown={(e) => e.key === "Enter" && !added && addSuggestion(s)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none ${
                        added
                          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10 opacity-70"
                          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md"
                      }`}
                    >
                      {added && (
                        <div className="absolute top-3 right-3">
                          <CheckOutlined className="text-emerald-500 text-base" />
                        </div>
                      )}
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                        {s.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-1">
                        {s.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          <DollarOutlined className="text-xs" />
                          R$ {s.price.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <ClockCircleOutlined className="text-xs" />
                          {s.duration} min
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 md:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800/40 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-0">
                  Adicionar manualmente
                </p>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Crie um serviço personalizado
                </span>
              </div>

              <Row gutter={[16, 16]} align="bottom">
                <Col span={24} md={8}>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Nome do serviço</label>
                  <Input
                    size="large"
                    placeholder="Ex: Lavagem técnica"
                    value={newService.name}
                    onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </Col>
                <Col span={24} md={8}>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Descrição</label>
                  <Input
                    size="large"
                    placeholder="Opcional"
                    value={newService.description}
                    onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </Col>
                <Col span={12} md={3}>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Preço</label>
                  <InputNumber
                    size="large"
                    placeholder="0,00"
                    prefix="R$"
                    min={0}
                    step={5}
                    value={newService.price || undefined}
                    onChange={(v) => setNewService((prev) => ({ ...prev, price: v || 0 }))}
                    className="!w-full"
                    formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "")}
                    parser={(value) => Number(String(value || "").replace(/[^\d]/g, ""))}
                  />
                </Col>
                <Col span={12} md={3}>
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Duração</label>
                  <InputNumber
                    size="large"
                    placeholder="30"
                    suffix="min"
                    min={1}
                    step={15}
                    value={newService.duration || undefined}
                    onChange={(v) => setNewService((prev) => ({ ...prev, duration: v || 30 }))}
                    className="!w-full"
                  />
                </Col>
                <Col span={24} className="flex justify-end">
                  <div className="pt-2">
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => addService(newService)}
                      className="h-11 px-7 font-medium"
                    >
                      Adicionar Serviço
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>

            {services.length > 0 && (
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
                  Serviços adicionados ({services.length})
                </p>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                            {service.name}
                          </p>
                          {service.description && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                              {service.description}
                            </p>
                          )}

                          {editingIndex === index ? (
                            <div className="space-y-3 mt-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/40">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                    Preço
                                  </label>
                                  <InputNumber
                                    size="middle"
                                    min={0}
                                    step={5}
                                    value={editingDraft.price}
                                    onChange={(v) => setEditingDraft((prev) => ({ ...prev, price: v || 0 }))}
                                    prefix="R$"
                                    className="!w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                    Duração
                                  </label>
                                  <InputNumber
                                    size="middle"
                                    min={1}
                                    step={15}
                                    value={editingDraft.duration}
                                    onChange={(v) => setEditingDraft((prev) => ({ ...prev, duration: v || 30 }))}
                                    suffix="min"
                                    className="!w-full"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <Button size="small" icon={<CloseOutlined />} onClick={cancelEditService}>
                                  Cancelar
                                </Button>
                                <Button size="small" type="primary" onClick={() => saveEditService(index)}>
                                  Salvar alterações
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap mt-2">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 text-sm font-semibold">
                                <DollarOutlined className="text-xs" />
                                R$ {service.price.toFixed(2)}
                              </span>
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 text-sm font-medium">
                                <ClockCircleOutlined className="text-xs" />
                                {service.duration} min
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {editingIndex !== index && (
                            <Tooltip title="Editar preço e duração">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => openEditService(index)}
                                className="hover:!text-indigo-500"
                              />
                            </Tooltip>
                          )}
                          <Tooltip title="Remover serviço">
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => removeService(index)}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-2">
          <Button size="large" onClick={onBack} className="text-zinc-600 dark:text-zinc-300">
            Voltar
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="large" onClick={onSkip} className="text-zinc-500 dark:text-zinc-400">
            Pular por agora
          </Button>
          <Button
            type="primary"
            size="large"
            loading={isSubmitting}
            onClick={handleSubmit}
            disabled={services.length === 0}
          >
            Salvar Serviços e Finalizar
          </Button>
        </div>
      </div>
    </>
  );
};
