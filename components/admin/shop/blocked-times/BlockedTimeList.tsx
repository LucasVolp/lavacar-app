"use client";

import React from "react";
import { Table, Tag, Space, Button, Typography, Empty } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  StopOutlined, 
  ClockCircleOutlined 
} from "@ant-design/icons";
import { BlockedTime } from "@/types/blockedTime";
import { format, isBefore, isSameDay, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CustomTooltip, CustomPopconfirm } from "@/components/ui";

const { Text } = Typography;

interface BlockedTimeListProps {
  blockedTimes: BlockedTime[];
  onEdit: (blockedTime: BlockedTime) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const BlockedTimeList: React.FC<BlockedTimeListProps> = ({
  blockedTimes,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const today = startOfDay(new Date());

  const columns = [
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (dateStr: string) => {
        const d = parseISO(dateStr);
        const isPast = isBefore(d, today);
        return (
          <div className={isPast ? "text-zinc-400 dark:text-zinc-600" : ""}>
            <Text strong className={`block ${isPast ? "text-zinc-400 dark:text-zinc-600" : "dark:text-zinc-200"}`}>
              {format(d, "dd/MM/yyyy")}
            </Text>
            <div className={`text-xs ${isPast ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"}`}>
              {format(d, "EEEE", { locale: ptBR })}
            </div>
          </div>
        );
      },
      sorter: (a: BlockedTime, b: BlockedTime) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: 130,
      render: (type: string) => (
        <Tag 
          color={type === "FULL_DAY" ? "red" : "orange"}
          icon={type === "FULL_DAY" ? <StopOutlined /> : <ClockCircleOutlined />}
          className="border-none"
        >
          {type === "FULL_DAY" ? "Dia Inteiro" : "Parcial"}
        </Tag>
      ),
      filters: [
        { text: "Dia Inteiro", value: "FULL_DAY" },
        { text: "Parcial", value: "PARTIAL" },
      ],
      onFilter: (value: React.Key | boolean, record: BlockedTime) => record.type === value,
    },
    {
      title: "Horário",
      key: "time",
      width: 150,
      render: (_: unknown, record: BlockedTime) => {
        if (record.type === "FULL_DAY") {
          return <Text type="secondary" className="dark:text-zinc-500">Todo o dia</Text>;
        }
        return (
          <Space>
            <ClockCircleOutlined className="text-orange-500" />
            <span className="dark:text-zinc-300">{record.startTime} - {record.endTime}</span>
          </Space>
        );
      },
    },
    {
      title: "Motivo",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => (
        reason ? (
          <CustomTooltip title={reason}>
            <Text className="line-clamp-1 max-w-[200px] dark:text-zinc-300">{reason}</Text>
          </CustomTooltip>
        ) : (
          <Text type="secondary" italic className="dark:text-zinc-600">Não informado</Text>
        )
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_: unknown, record: BlockedTime) => {
        const d = parseISO(record.date);
        // Note: isBefore compares timestamps. 
        // If d is exactly today's start, isBefore(d, today) is false.
        // We check isSameDay first.
        if (isSameDay(d, today)) {
          return <Tag color="blue" className="border-none">Hoje</Tag>;
        }
        if (isBefore(d, today)) {
          return <Tag className="dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">Passado</Tag>;
        }
        return <Tag color="green" className="border-none">Futuro</Tag>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_: unknown, record: BlockedTime) => (
        <Space>
          <CustomTooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            />
          </CustomTooltip>
          <CustomPopconfirm
            title="Excluir bloqueio"
            description="Tem certeza que deseja excluir este bloqueio?"
            onConfirm={() => onDelete(record.id)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ danger: true }}
          >
            <CustomTooltip title="Excluir">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                danger
                className="hover:bg-red-50 dark:hover:bg-red-900/20"
              />
            </CustomTooltip>
          </CustomPopconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-colors duration-300">
      {blockedTimes.length === 0 ? (
        <Empty
          description="Nenhum bloqueio cadastrado"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-12"
        >
          <Button type="primary" danger onClick={onAdd}>
            Criar primeiro bloqueio
          </Button>
        </Empty>
      ) : (
        <Table
          dataSource={blockedTimes}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `${total} bloqueio(s)`,
          }}
          rowClassName={(record) => 
            isBefore(parseISO(record.date), today) && !isSameDay(parseISO(record.date), today)
              ? "opacity-50 grayscale dark:grayscale-0" 
              : ""
          }
          className="dark:[&_.ant-table]:!bg-transparent dark:[&_.ant-table-thead_th]:!bg-zinc-800/50 dark:[&_.ant-table-thead_th]:!text-zinc-300 dark:[&_.ant-table-cell]:!border-zinc-800 dark:[&_.ant-table-tbody_tr:hover>td]:!bg-zinc-800/30 dark:[&_.ant-pagination-item-active]:bg-zinc-800 dark:[&_.ant-pagination-item-active_a]:text-zinc-100"
        />
      )}
    </div>
  );
};