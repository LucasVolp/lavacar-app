"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Avatar,
  Typography,
  Divider,
  Tag,
  Card,
  Empty,
  Timeline,
  Rate,
  Button,
  Popconfirm,
  message,
  Form,
  Input,
  Tooltip,
  Spin,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ShopClient, UpdateShopClientPayload } from "@/types/shopClient";
import { useDeleteShopClient, useUpdateShopClient } from "@/hooks/useShopClients";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ClientDetailDrawerProps {
  client: ShopClient | null;
  open: boolean;
  onClose: () => void;
  shopId: string;
}

interface EditFormValues {
  customName: string;
  customPhone: string;
  customEmail: string;
  notes: string;
}

export const ClientDetailDrawer: React.FC<ClientDetailDrawerProps> = ({
  client,
  open,
  onClose,
  shopId,
}) => {
  const router = useRouter();
  const [form] = Form.useForm<EditFormValues>();
  const [isEditing, setIsEditing] = useState(false);

  const deleteClient = useDeleteShopClient();
  const updateClient = useUpdateShopClient();

  const user = client?.user;

  const formatPhone = (value: string) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
    }
  };

  useEffect(() => {
    if (client && open) {
      form.setFieldsValue({
        customName: client.customName || "",
        customPhone: formatPhone(client.customPhone || ""),
        customEmail: client.customEmail || "",
        notes: client.notes || "",
      });
    }
  }, [client, open, form]);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    form.setFieldValue("customPhone", formatted);
  };

  const getVehicleTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      CAR: "Carro",
      MOTORCYCLE: "Moto",
      TRUCK: "Caminhão",
      SUV: "SUV",
      VAN: "Van",
    };
    return types[type] || type;
  };

  if (!client || !user) return null;

  const displayName = client.customName || `${user.firstName} ${user.lastName || ""}`.trim();
  const displayPhone = formatPhone(client.customPhone || user.phone || "");
  const displayEmail = client.customEmail || user.email;
  const originalName = `${user.firstName} ${user.lastName || ""}`.trim();
  const originalPhone = formatPhone(user.phone || "");
  const initials = `${displayName.split(" ")[0]?.[0] || ""}${displayName.split(" ")[1]?.[0] || ""}`.toUpperCase();

  const hasCustomData = !!(client.customName || client.customPhone || client.customEmail || client.notes);
  
  const vehicleCount = user.vehicles?.length || 0;
  const appointmentCount = user.appointments?.length || 0;
  const evaluationCount = user.evaluations?.length || 0;
  
  const avgRating =
    evaluationCount > 0
      ? user.evaluations!.reduce((acc, e) => acc + e.rating, 0) / evaluationCount
      : 0;

  const totalSpent =
    user.appointments
      ?.filter((a) => a.status === "COMPLETED")
      .reduce((acc, a) => acc + parseFloat(a.totalPrice), 0) || 0;

  const getAvatarColor = (name: string) => {
    const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#f5222d", "#52c41a", "#1890ff", "#eb2f96"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircleOutlined className="text-green-500" />;
      case "CANCELED":
        return <CloseCircleOutlined className="text-red-500" />;
      default:
        return <ClockCircleOutlined className="text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "CANCELED":
        return "error";
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "processing";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      COMPLETED: "Concluído",
      CANCELED: "Cancelado",
      PENDING: "Pendente",
      IN_PROGRESS: "Em andamento",
      CONFIRMED: "Confirmado",
      WAITING: "Aguardando",
      NO_SHOW: "Não compareceu",
    };
    return labels[status] || status;
  };

  const handleDelete = async () => {
    try {
      await deleteClient.mutateAsync(client.id);
      message.success("Cliente removido com sucesso");
      handleClose();
    } catch {
      message.error("Erro ao remover cliente");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: UpdateShopClientPayload = {};

      if (values.customName.trim()) {
        payload.customName = values.customName.trim();
      } else if (client.customName) {
        payload.customName = "";
      }

      if (values.customPhone.trim()) {
        payload.customPhone = values.customPhone.replace(/\D/g, "").trim();
      } else if (client.customPhone) {
        payload.customPhone = "";
      }

      if (values.customEmail.trim()) {
        payload.customEmail = values.customEmail.trim();
      } else if (client.customEmail) {
        payload.customEmail = "";
      }

      if (values.notes.trim()) {
        payload.notes = values.notes.trim();
      } else if (client.notes) {
        payload.notes = "";
      }

      await updateClient.mutateAsync({ id: client.id, payload });
      message.success("Cliente atualizado com sucesso");
      setIsEditing(false);
    } catch {
      message.error("Erro ao atualizar cliente");
    }
  };

  const handleCancelEdit = () => {
    form.setFieldsValue({
      customName: client.customName || "",
      customPhone: formatPhone(client.customPhone || ""),
      customEmail: client.customEmail || "",
      notes: client.notes || "",
    });
    setIsEditing(false);
  };

  const handleWhatsApp = () => {
    const phone = displayPhone?.replace(/\D/g, "");
    if (phone) {
      window.open(`https://wa.me/55${phone}`, "_blank");
    }
  };

  return (
    <Drawer
      title={null}
      placement="right"
      width={520}
      open={open}
      onClose={handleClose}
      className="client-detail-drawer"
      styles={{ body: { padding: 0 } }}
    >
      <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              size={72}
              src={user.picture}
              style={{ backgroundColor: !user.picture ? getAvatarColor(displayName) : undefined }}
              className="ring-4 ring-white/30"
            >
              {!user.picture && <span className="text-2xl">{initials}</span>}
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Title level={4} className="!text-white !mb-0">
                  {displayName}
                </Title>
                {hasCustomData && (
                  <Tooltip title="Este cliente possui dados personalizados">
                    <Tag color="gold" className="!m-0">
                      Personalizado
                    </Tag>
                  </Tooltip>
                )}
              </div>
              {client.customName && (
                <Text className="text-cyan-200 text-xs block">
                  Nome original: {originalName}
                </Text>
              )}
              <Text className="text-cyan-100 block mt-1">
                Cliente desde {dayjs(client.createdAt).format("DD/MM/YYYY")}
              </Text>
              {avgRating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Rate disabled value={avgRating} allowHalf className="text-sm text-amber-400" />
                  <Text className="text-white/80 text-sm">({avgRating.toFixed(1)})</Text>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold">{vehicleCount}</div>
            <div className="text-cyan-100 text-xs">Veículos</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold">{appointmentCount}</div>
            <div className="text-cyan-100 text-xs">Visitas</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
              }).format(totalSpent)}
            </div>
            <div className="text-cyan-100 text-xs">Total Gasto</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <Card
            size="small"
            title={
              <div className="flex items-center gap-2">
                <EditOutlined className="text-blue-500" />
                <span className="font-semibold">Editar Informações do Cliente</span>
              </div>
            }
            className="rounded-xl border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10"
            extra={
              <Tooltip title="Os dados personalizados sobrescrevem as informações originais do usuário apenas para este estabelecimento">
                <InfoCircleOutlined className="text-blue-500" />
              </Tooltip>
            }
          >
            <Spin spinning={updateClient.isPending}>
              <Form form={form} layout="vertical" className="space-y-0">
                <Form.Item
                  name="customName"
                  label={
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Nome personalizado
                      {user.firstName && (
                        <Text type="secondary" className="ml-2 text-xs">
                          Original: {originalName}
                        </Text>
                      )}
                    </span>
                  }
                >
                  <Input
                    prefix={<UserOutlined className="text-zinc-400" />}
                    placeholder="Deixe vazio para usar o nome original"
                    allowClear
                  />
                </Form.Item>

                <Form.Item
                  name="customPhone"
                  label={
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Telefone personalizado
                      {user.phone && (
                        <Text type="secondary" className="ml-2 text-xs">
                          Original: {originalPhone}
                        </Text>
                      )}
                    </span>
                  }
                >
                  <Input
                    prefix={<PhoneOutlined className="text-zinc-400" />}
                    placeholder="(00) 00000-0000"
                    allowClear
                    onChange={handlePhoneChange}
                    maxLength={15}
                  />
                </Form.Item>

                <Form.Item
                  name="customEmail"
                  label={
                    <span className="text-zinc-700 dark:text-zinc-300">
                      Email personalizado
                      {user.email && (
                        <Text type="secondary" className="ml-2 text-xs">
                          Original: {user.email}
                        </Text>
                      )}
                    </span>
                  }
                  rules={[{ type: "email", message: "Email inválido" }]}
                >
                  <Input
                    prefix={<MailOutlined className="text-zinc-400" />}
                    placeholder="email@exemplo.com"
                    allowClear
                  />
                </Form.Item>

                <Form.Item
                  name="notes"
                  label={<span className="text-zinc-700 dark:text-zinc-300">Observações internas</span>}
                >
                  <TextArea
                    placeholder="Anotações sobre o cliente (visível apenas para a equipe)"
                    rows={3}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={updateClient.isPending}
                    className="flex-1"
                  >
                    Salvar
                  </Button>
                  <Button icon={<CloseOutlined />} onClick={handleCancelEdit} disabled={updateClient.isPending}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Spin>
          </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Card
              size="small"
              title={<span className="font-semibold">Informações de Contato</span>}
              className="rounded-xl border-zinc-200 dark:border-zinc-800"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <MailOutlined className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <Text type="secondary" className="text-xs block">
                      Email
                      {client.customEmail && (
                        <Tag color="gold" className="ml-2 !text-xs !px-1 !py-0">
                          personalizado
                        </Tag>
                      )}
                    </Text>
                    <Text className="dark:text-white">{displayEmail || "Não informado"}</Text>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <PhoneOutlined className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <Text type="secondary" className="text-xs block">
                        Telefone
                        {client.customPhone && (
                          <Tag color="gold" className="ml-2 !text-xs !px-1 !py-0">
                            personalizado
                          </Tag>
                        )}
                      </Text>
                      <Text className="dark:text-white block">{displayPhone || "Não informado"}</Text>
                      {client.customPhone && user.phone && (
                        <Text type="secondary" className="text-xs opacity-70">
                          Original: {originalPhone}
                        </Text>
                      )}
                    </div>
                  </div>
                  {displayPhone && (
                    <Button
                      type="primary"
                      icon={<WhatsAppOutlined />}
                      size="small"
                      onClick={handleWhatsApp}
                      className="bg-green-600 hover:!bg-green-500 border-green-600"
                    >
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {client.notes && (
              <Card
                size="small"
                title={
                  <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-amber-500" />
                    <span className="font-semibold">Observações</span>
                  </div>
                }
                className="rounded-xl border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10"
              >
                <Paragraph className="!mb-0 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {client.notes}
                </Paragraph>
              </Card>
            )}

            <Card
              size="small"
              title={
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Veículos</span>
                  <Tag color="cyan">{vehicleCount}</Tag>
              </div>
            }
            className="rounded-xl border-zinc-200 dark:border-zinc-800"
          >
            {vehicleCount === 0 ? (
              <Empty description="Nenhum veículo cadastrado" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="space-y-2">
                {user.vehicles?.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <CarOutlined className="text-emerald-600 dark:text-emerald-400 text-lg" />
                      </div>
                      <div>
                        <Text strong className="block dark:text-white">
                          {vehicle.brand} {vehicle.model}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {vehicle.year && `${vehicle.year} • `}
                          {vehicle.color && `${vehicle.color} • `}
                          {getVehicleTypeLabel(vehicle.type)}
                        </Text>
                      </div>
                    </div>
                    {vehicle.plate && <Tag className="font-mono uppercase">{vehicle.plate}</Tag>}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            size="small"
            title={
              <div className="flex items-center justify-between">
                <span className="font-semibold">Histórico de Visitas</span>
                <Tag color="blue">{appointmentCount}</Tag>
              </div>
            }
            className="rounded-xl border-zinc-200 dark:border-zinc-800"
          >
            {appointmentCount === 0 ? (
              <Empty description="Nenhuma visita registrada" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Timeline
                items={user.appointments?.slice(0, 5).map((apt) => ({
                  dot: getStatusIcon(apt.status),
                  children: (
                    <div
                      key={apt.id}
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 -m-2 rounded-lg transition-colors"
                      onClick={() => router.push(`/admin/shop/${shopId}/appointments/${apt.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <Text strong className="dark:text-white">
                          {apt.services.map((s) => s.serviceName).join(", ")}
                        </Text>
                        <Tag 
                          className={`m-0 border-0 ${
                            apt.status === "PENDING" 
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500" 
                              : ""
                          }`}
                          color={apt.status === "PENDING" ? undefined : getStatusColor(apt.status)}
                        >
                          {getStatusLabel(apt.status)}
                        </Tag>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          {dayjs(apt.scheduledAt).format("DD/MM/YYYY HH:mm")}
                        </span>
                        <span className="text-emerald-600 font-medium">
                          R$ {parseFloat(apt.totalPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ),
                }))}
              />
            )}
            {appointmentCount > 5 && (
              <Button
                type="link"
                block
                className="mt-2"
                onClick={() => router.push(`/admin/shop/${shopId}/appointments?userId=${user.id}`)}
              >
                Ver todos os {appointmentCount} agendamentos
              </Button>
            )}
          </Card>

          <Card
            size="small"
            title={
              <div className="flex items-center justify-between">
                <span className="font-semibold">Avaliações do Cliente</span>
                <Tag color="gold">{evaluationCount}</Tag>
              </div>
            }
            className="rounded-xl border-zinc-200 dark:border-zinc-800"
          >
            {evaluationCount === 0 ? (
              <Empty description="Nenhuma avaliação realizada" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="space-y-3">
                {user.evaluations?.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Rate disabled value={evaluation.rating} className="text-sm" />
                      <Text type="secondary" className="text-xs">
                        {dayjs(evaluation.createdAt).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                    {evaluation.comment && (
                      <Paragraph className="!mb-0 text-zinc-600 dark:text-zinc-400 text-sm italic">
                        &ldquo;{evaluation.comment}&rdquo;
                      </Paragraph>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Divider />

          <div className="flex justify-end gap-3">
            <Button 
                icon={<EditOutlined />} 
                onClick={() => setIsEditing(true)}
                className="border-zinc-300 dark:border-zinc-700 hover:text-blue-500 hover:border-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400"
            >
                Editar Cliente
            </Button>
            
            <Popconfirm
              title="Remover cliente"
              description="Tem certeza que deseja remover este cliente da sua base?"
              onConfirm={handleDelete}
              okText="Sim, remover"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} loading={deleteClient.isPending}>
                Remover Cliente
              </Button>
            </Popconfirm>
          </div>
        </div>
        )}
      </div>
    </Drawer>
  );
};
