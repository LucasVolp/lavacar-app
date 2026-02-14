"use client";

import React from "react";
import { Table, Space, Button, Dropdown, Empty, Typography, Card } from "antd";
import { ClockCircleOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Appointment, AppointmentService } from "@/types/appointment";
import { format, isBefore, isSameDay, startOfDay, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { CustomTooltip } from "@/components/ui";
import { sanitizeText, formatCurrency } from "@/lib/security";

const { Text } = Typography;

interface AppointmentsTableProps {
  appointments: Appointment[];
  shopId: string;
  statusConfig: Record<
    string,
    { color: string; label: string; icon: React.ReactNode }
  >;
  getStatusActions: (
    record: Appointment
  ) => { key: string; label: string; danger?: boolean }[];
  onStatusChange: (id: string, status: string) => void;
  onCancel: (record: Appointment) => void;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  WAITING: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  IN_PROGRESS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  NO_SHOW: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
};

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  shopId,
  statusConfig,
  getStatusActions,
  onStatusChange,
  onCancel
}) => {
  const router = useRouter();
  const today = startOfDay(new Date());

  const columns = [
    {
      title: "Data/Hora",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      render: (date: string, record: Appointment) => {
        const d = parseISO(date);
        const isToday = isSameDay(d, today);
        const isPast = isBefore(d, today);
        const isOverdue =
          isPast && !["COMPLETED", "CANCELED", "NO_SHOW"].includes(record.status);

        return (
          <div className={isOverdue ? "text-red-500" : ""}>
            <div className="flex items-center gap-2">
              <Text
                strong
                className={
                  isToday
                    ? "text-blue-600 dark:text-blue-400"
                    : "dark:text-zinc-100"
                }
              >
                {format(d, "dd/MM/yyyy")}
              </Text>
              {isToday && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Hoje
                </span>
              )}
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center gap-1">
              <ClockCircleOutlined />
              {format(d, "HH:mm")} - {format(parseISO(record.endTime), "HH:mm")}
            </div>
          </div>
        );
      },
      sorter: (a: Appointment, b: Appointment) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      width: 160
    },
    {
      title: "Serviços",
      dataIndex: "services",
      key: "services",
      render: (services: AppointmentService[]) => (
        <div className="flex flex-wrap gap-1">
          {services.map((service, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            >
              {sanitizeText(service.serviceName)}
            </span>
          ))}
        </div>
      )
    },
    {
      title: "Duração",
      dataIndex: "totalDuration",
      key: "totalDuration",
      render: (duration: number) => (
        <Space>
          <ClockCircleOutlined className="text-zinc-400 dark:text-zinc-500" />
          <span className="dark:text-zinc-300">{duration} min</span>
        </Space>
      ),
      width: 100
    },
    {
      title: "Valor",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: string) => (
        <Text strong className="text-emerald-600 dark:text-emerald-400 text-base">
          {formatCurrency(parseFloat(price))}
        </Text>
      ),
      sorter: (a: Appointment, b: Appointment) =>
        parseFloat(a.totalPrice) - parseFloat(b.totalPrice),
      width: 120
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = statusConfig[status];
        const styleClass = STATUS_STYLES[status] || STATUS_STYLES.PENDING;

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${styleClass}`}
          >
            {config.icon}
            {config.label}
          </span>
        );
      },
      width: 150
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: Appointment) => {
        const actions = getStatusActions(record);

        return (
          <Space>
            <CustomTooltip title="Ver Detalhes">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() =>
                  router.push(`/admin/shop/${shopId}/appointments/${record.id}`)
                }
                className="text-blue-500 hover:text-blue-600"
              />
            </CustomTooltip>
            {actions.length > 0 && (
              <Dropdown
                menu={{
                  items: actions.map((action) => ({
                    key: action.key,
                    label: action.label,
                    danger: action.danger,
                    onClick: () => {
                      if (action.key === "CANCEL") {
                        onCancel(record);
                      } else {
                        onStatusChange(record.id, action.key);
                      }
                    }
                  }))
                }}
                trigger={["click"]}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  className="dark:text-zinc-400"
                />
              </Dropdown>
            )}
          </Space>
        );
      },
      width: 100
    }
  ];

  return (
    <Card className="dark:bg-zinc-900 dark:border-zinc-800">
      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="id"
        locale={{
          emptyText: (
            <Empty
              description="Nenhum agendamento encontrado"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        }}
        pagination={false}
        rowClassName={(record) => {
          if (record.status === "CANCELED" || record.status === "NO_SHOW") {
            return "opacity-50";
          }
          if (isSameDay(parseISO(record.scheduledAt), today)) {
            return "bg-blue-50 dark:bg-blue-900/10";
          }
          return "";
        }}
        className="dark:[&_.ant-table]:!bg-transparent dark:[&_.ant-table-thead_th]:!bg-zinc-800/50 dark:[&_.ant-table-thead_th]:!text-zinc-300 dark:[&_.ant-table-cell]:!border-zinc-800 dark:[&_.ant-table-tbody_tr:hover>td]:!bg-zinc-800/30"
      />
    </Card>
  );
};
