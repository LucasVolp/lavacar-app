"use client";

import React from "react";
import { Table, Tag, Space, Button, Dropdown, Empty, Typography, Card } from "antd";
import {
  ClockCircleOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Appointment, AppointmentService } from "@/types/appointment";
import { format, isBefore, isSameDay, startOfDay, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { CustomTooltip } from "@/components/ui";

const { Text } = Typography;

interface AppointmentsTableProps {
  appointments: Appointment[];
  shopId: string;
  statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }>;
  getStatusActions: (record: Appointment) => { key: string; label: string; danger?: boolean }[];
  onStatusChange: (id: string, status: string) => void;
  onCancel: (record: Appointment) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  shopId,
  statusConfig,
  getStatusActions,
  onStatusChange,
  onCancel,
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

        return (
          <div className={isPast && !["COMPLETED", "CANCELED"].includes(record.status) ? "text-red-500" : ""}>
            <div className="flex items-center gap-2">
              <Text strong className={isToday ? "text-blue-600" : ""}>
                {format(d, "dd/MM/yyyy")}
              </Text>
              {isToday && <Tag color="blue" className="text-xs">Hoje</Tag>}
            </div>
            <div className="text-gray-500 text-sm flex items-center gap-1">
              <ClockCircleOutlined />
              {format(d, "HH:mm")} - {format(parseISO(record.endTime), "HH:mm")}
            </div>
          </div>
        );
      },
      sorter: (a: Appointment, b: Appointment) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      width: 160,
    },
    {
      title: "Serviços",
      dataIndex: "services",
      key: "services",
      render: (services: AppointmentService[]) => (
        <div className="flex flex-wrap gap-1">
          {services.map((service, idx) => (
            <Tag key={idx} color="blue" className="mr-0">
              {service.serviceName}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Duração",
      dataIndex: "totalDuration",
      key: "totalDuration",
      render: (duration: number) => (
        <Space>
          <ClockCircleOutlined className="text-gray-400" />
          <span>{duration} min</span>
        </Space>
      ),
      width: 100,
    },
    {
      title: "Valor",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: string) => (
        <Text strong className="text-green-600 text-base">
          R$ {parseFloat(price).toFixed(2)}
        </Text>
      ),
      sorter: (a: Appointment, b: Appointment) =>
        parseFloat(a.totalPrice) - parseFloat(b.totalPrice),
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
      width: 140,
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
                onClick={() => router.push(`/admin/shop/${shopId}/appointments/${record.id}`)}
                className="text-blue-500"
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
                    },
                  })),
                }}
                trigger={["click"]}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            )}
          </Space>
        );
      },
      width: 100,
    },
  ];

  return (
    <Card>
      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="id"
        locale={{
          emptyText: <Empty description="Nenhum agendamento encontrado" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
        }}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showTotal: (total) => `${total} agendamento(s)`,
        }}
        rowClassName={(record) => {
          if (record.status === "CANCELED" || record.status === "NO_SHOW") {
            return "opacity-50";
          }
          if (isSameDay(parseISO(record.scheduledAt), today)) {
            return "bg-blue-50";
          }
          return "";
        }}
      />
    </Card>
  );
};