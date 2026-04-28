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
import { CustomTooltip, StatusBadge } from "@/components/ui";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useShopAdmin } from "@/contexts/ShopAdminContext";

import { formatPhone } from "@/utils/formatters";
import { formatVehiclePlate } from "@/utils/vehiclePlate";
import { getApiImageUrl } from "@/utils/image";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ClientDetailDrawerProps {
  client: ShopClient | null;
  open: boolean;
  onClose: () => void;
  shopId: string;
  initialEditing?: boolean;
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
  initialEditing = false,
}) => {
  const router = useRouter();
  const { organizationId } = useShopAdmin();
  const [form] = Form.useForm<EditFormValues>();
  const [isEditing, setIsEditing] = useState(false);

  const deleteClient = useDeleteShopClient();
  const updateClient = useUpdateShopClient();

  const user = client?.user;

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

  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        setIsEditing(initialEditing);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open, initialEditing]);

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
      window.open(`https://wa.me/${phone}`, "_blank");
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
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 transition-colors duration-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                size={72}
                src={user.picture ? getApiImageUrl(user.picture) : undefined}
                style={{ backgroundColor: !user.picture ? getAvatarColor(displayName) : undefined }}
                className="!border-3 !border-indigo-100 dark:!border-indigo-900/50 shadow-lg"
              >
                {!user.picture && <span className="text-2xl">{initials}</span>}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 m-0">
                  {displayName}
                </h3>
              </div>
              {client.customName && (
                <Text className="!text-zinc-400 dark:!text-zinc-500 text-xs block">
                  Nome original: {originalName}
                </Text>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {hasCustomData && (
                  <CustomTooltip title="Este cliente possui dados personalizados">
                    <Tag className="!bg-indigo-50 dark:!bg-indigo-900/20 !border-indigo-200 dark:!border-indigo-800 !text-indigo-700 dark:!text-indigo-300 !rounded-full !px-2.5 !text-xs">
                      Personalizado
                    </Tag>
                  </CustomTooltip>
                )}
                <Tag
                  icon={<CalendarOutlined />}
                  className="!bg-indigo-50 dark:!bg-indigo-900/20 !border-indigo-200 dark:!border-indigo-800 !text-indigo-700 dark:!text-indigo-300 !rounded-full !px-2.5 !text-xs"
                >
                  Desde {dayjs(client.createdAt).format("DD/MM/YYYY")}
                </Tag>
              </div>
              {avgRating > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Rate disabled value={avgRating} allowHalf className="text-sm text-amber-400" />
                  <Text className="!text-zinc-500 dark:!text-zinc-400 text-sm">({avgRating.toFixed(1)})</Text>
                </div>
              )}
            </div>
          </div>
          <Button
            type="text"
            icon={<EditOutlined className="text-lg" />}
            onClick={() => setIsEditing(true)}
            className="!text-zinc-500 dark:!text-zinc-400 hover:!text-indigo-600 dark:hover:!text-indigo-400 hover:!bg-indigo-50 dark:hover:!bg-indigo-900/20 flex items-center justify-center !rounded-lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="text-center bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{vehicleCount}</div>
            <div className="text-indigo-500 dark:text-indigo-400 text-xs font-medium">Veículos</div>
          </div>
          <div className="text-center bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{appointmentCount}</div>
            <div className="text-indigo-500 dark:text-indigo-400 text-xs font-medium">Visitas</div>
          </div>
          <div className="text-center bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
              }).format(totalSpent)}
            </div>
            <div className="text-emerald-500 dark:text-emerald-400 text-xs font-medium">Total Gasto</div>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          onClick={() => router.push(`/organization/${organizationId}/shop/${shopId}/clients/${client.id}`)}
          className="w-full !bg-indigo-600 hover:!bg-indigo-700 !border-indigo-600 !font-semibold !rounded-xl !h-11 !shadow-sm transition-all mt-4"
        >
          Ver Perfil Completo & Histórico ↗
        </Button>
      </div>

      <div className="p-6 dark:bg-zinc-900">
        {isEditing ? (
          <div className="space-y-4">
            <Card
              size="small"
              title={
                <div className="flex items-center gap-2">
                  <EditOutlined className="text-blue-500 dark:text-blue-400" />
                  <span className="font-semibold dark:text-white">Editar Informações do Cliente</span>
                </div>
              }
              className="rounded-xl border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10"
            extra={
              <CustomTooltip title="Os dados personalizados sobrescrevem as informações originais do usuário apenas para este estabelecimento">
                <InfoCircleOutlined className="text-blue-500" />
              </CustomTooltip>
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
                        <Text type="secondary" className="ml-2 text-xs dark:text-zinc-500">
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
                        <Text type="secondary" className="ml-2 text-xs dark:text-zinc-500">
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
                        <Text type="secondary" className="ml-2 text-xs dark:text-zinc-500">
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
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancelEdit}
                    disabled={updateClient.isPending}
                    className="dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white dark:hover:border-zinc-500"
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Spin>
          </Card>
          </div>
        ) : (
          <div className="space-y-4">

            <div className="space-y-4">
              <Card
                size="small"
                title={<span className="font-semibold dark:text-white">Informações de Contato</span>}
                className="rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <MailOutlined className="text-blue-600 dark:text-blue-400 text-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Text type="secondary" className="text-xs dark:text-zinc-400">
                          Email
                        </Text>
                        {client.customEmail && (
                          <Tag className="!text-xs !px-1.5 !py-0 !bg-amber-100 dark:!bg-amber-900/30 !text-amber-700 dark:!text-amber-400 !border-0 rounded-sm">
                            personalizado
                          </Tag>
                        )}
                      </div>
                      <Text className="dark:text-white block">{displayEmail || "Não informado"}</Text>
                      {client.customEmail && user.email && (
                        <Text type="secondary" className="text-xs opacity-70 block dark:text-zinc-500">
                          Original: {user.email}
                        </Text>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <PhoneOutlined className="text-green-600 dark:text-green-400 text-lg" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Text type="secondary" className="text-xs dark:text-zinc-400">
                            Telefone
                          </Text>
                          {client.customPhone && (
                            <Tag className="!text-xs !px-1.5 !py-0 !bg-amber-100 dark:!bg-amber-900/30 !text-amber-700 dark:!text-amber-400 !border-0 rounded-sm">
                              personalizado
                            </Tag>
                          )}
                        </div>
                        <Text className="dark:text-white block">{displayPhone || "Não informado"}</Text>
                        {client.customPhone && user.phone && (
                          <Text type="secondary" className="text-xs opacity-70 block dark:text-zinc-500">
                            Original: {originalPhone}
                          </Text>
                        )}
                      </div>
                    </div>
                    {displayPhone && (
                      <Button
                        type="primary"
                        icon={<WhatsAppOutlined className="text-lg" />}
                        onClick={handleWhatsApp}
                        className="bg-green-600 hover:!bg-green-500 border-green-600 h-10 px-4 flex items-center gap-2"
                      >
                        WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              {client.notes && (
                <Card
                  size="small"
                  title={
                    <div className="flex items-center gap-2">
                      <FileTextOutlined className="text-amber-500" />
                      <span className="font-semibold dark:text-white">Observações</span>
                    </div>
                  }
                  className="rounded-xl border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10"
                >
                  <Paragraph className="!mb-0 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {client.notes}
                  </Paragraph>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card
                size="small"
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-semibold dark:text-white">Veículos</span>
                    <Tag className="!bg-indigo-100 dark:!bg-indigo-900/30 !text-indigo-700 dark:!text-indigo-400 !border-0">{vehicleCount}</Tag>
                  </div>
                }
                className="rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900"
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
                        {vehicle.plate && <Tag className="font-mono uppercase !bg-zinc-100 dark:!bg-zinc-800 !text-zinc-600 dark:!text-zinc-400 border-0">{formatVehiclePlate(vehicle.plate)}</Tag>}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-4">
              <Card
                size="small"
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-semibold dark:text-white">Histórico de Visitas</span>
                    <Tag className="!bg-blue-100 dark:!bg-blue-900/30 !text-blue-700 dark:!text-blue-400 !border-0">{appointmentCount}</Tag>
                  </div>
                }
                className="rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900"
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
                          onClick={() => router.push(`/organization/${organizationId}/shop/${shopId}/appointments/${apt.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <Text strong className="dark:text-white">
                              {apt.services.map((s) => s.serviceName).join(", ")}
                            </Text>
                            <StatusBadge status={apt.status} className="m-0" />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            <span className="flex items-center gap-1">
                              <CalendarOutlined />
                              {dayjs(apt.scheduledAt).format("DD/MM/YYYY HH:mm")}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
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
                    onClick={() => router.push(`/organization/${organizationId}/shop/${shopId}/clients/${client.id}?tab=timeline`)}
                  >
                    Ver todos os {appointmentCount} agendamentos
                  </Button>
                )}
              </Card>
            </div>

            <Card
              size="small"
              title={
                <div className="flex items-center justify-between">
                  <span className="font-semibold dark:text-white">Avaliações do Cliente</span>
                  <Tag className="!bg-amber-100 dark:!bg-amber-900/30 !text-amber-700 dark:!text-amber-400 !border-0">{evaluationCount}</Tag>
                </div>
              }
              className="rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900"
            >
            {evaluationCount === 0 ? (
              <Empty description="Nenhuma avaliação realizada" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="space-y-4">
                {user.evaluations?.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Rate disabled value={evaluation.rating} className="text-sm" />
                      <Text type="secondary" className="text-xs dark:text-zinc-400">
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

            <Divider className="dark:border-zinc-700" />

            <div className="flex justify-end gap-3">
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                className="border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 hover:!text-indigo-500 hover:!border-indigo-500 dark:hover:!text-indigo-400 dark:hover:!border-indigo-400"
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
