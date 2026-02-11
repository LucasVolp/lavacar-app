"use client";

import React from "react";
import { Table, Space, Button, Empty } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import { BlockedTime } from "@/types/blockedTime";
import { format, isBefore, isSameDay, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CustomTooltip, CustomPopconfirm } from "@/components/ui";

interface BlockedTimeListProps {
  blockedTimes: BlockedTime[];
  onEdit: (blockedTime: BlockedTime) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

/**
 * Status badge component for consistent theming
 */
interface StatusBadgeProps {
  type: "today" | "past" | "future";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type }) => {
  const config = {
    today: {
      label: "Hoje",
      className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
    },
    past: {
      label: "Passado",
      className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
    },
    future: {
      label: "Futuro",
      className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    }
  };

  const { label, className } = config[type];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
};

/**
 * Type badge for block type visualization
 */
interface TypeBadgeProps {
  type: "FULL_DAY" | "PARTIAL";
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const isFullDay = type === "FULL_DAY";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isFullDay
        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
        : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
    }`}>
      {isFullDay ? <StopOutlined /> : <ClockCircleOutlined />}
      {isFullDay ? "Dia Inteiro" : "Parcial"}
    </span>
  );
};

export const BlockedTimeList: React.FC<BlockedTimeListProps> = ({
  blockedTimes,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const today = startOfDay(new Date());

  const columns = [
    {
      title: <span className="text-zinc-600 dark:text-zinc-400">Data</span>,
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (dateStr: string) => {
        const d = parseISO(dateStr);
        const isPast = isBefore(d, today) && !isSameDay(d, today);
        return (
          <div className={isPast ? "opacity-50" : ""}>
            <div className="flex items-center gap-2">
              <CalendarOutlined className={`text-sm ${isPast ? "text-zinc-400" : "text-blue-500"}`} />
              <span className={`font-semibold ${isPast ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-800 dark:text-zinc-200"}`}>
                {format(d, "dd/MM/yyyy")}
              </span>
            </div>
            <span className={`text-xs capitalize ml-6 ${isPast ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"}`}>
              {format(d, "EEEE", { locale: ptBR })}
            </span>
          </div>
        );
      },
      sorter: (a: BlockedTime, b: BlockedTime) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: <span className="text-zinc-600 dark:text-zinc-400">Tipo</span>,
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: "FULL_DAY" | "PARTIAL") => <TypeBadge type={type} />,
      filters: [
        { text: "Dia Inteiro", value: "FULL_DAY" },
        { text: "Parcial", value: "PARTIAL" },
      ],
      onFilter: (value: React.Key | boolean, record: BlockedTime) => record.type === value,
    },
    {
      title: <span className="text-zinc-600 dark:text-zinc-400">Horário</span>,
      key: "time",
      width: 150,
      render: (_: unknown, record: BlockedTime) => {
        if (record.type === "FULL_DAY") {
          return (
            <span className="text-sm text-zinc-400 dark:text-zinc-500 italic">
              Todo o dia
            </span>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-orange-500 dark:text-orange-400" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {record.startTime} - {record.endTime}
            </span>
          </div>
        );
      },
    },
    {
      title: <span className="text-zinc-600 dark:text-zinc-400">Motivo</span>,
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => (
        reason ? (
          <CustomTooltip title={reason}>
            <span className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-1 max-w-[200px] cursor-default">
              {reason}
            </span>
          </CustomTooltip>
        ) : (
          <span className="text-sm text-zinc-400 dark:text-zinc-600 italic">
            Não informado
          </span>
        )
      ),
    },
    {
      title: <span className="text-zinc-600 dark:text-zinc-400">Status</span>,
      key: "status",
      width: 100,
      render: (_: unknown, record: BlockedTime) => {
        const d = parseISO(record.date);
        if (isSameDay(d, today)) {
          return <StatusBadge type="today" />;
        }
        if (isBefore(d, today)) {
          return <StatusBadge type="past" />;
        }
        return <StatusBadge type="future" />;
      },
    },
    {
      title: <span className="text-zinc-600 dark:text-zinc-400">Ações</span>,
      key: "actions",
      width: 100,
      render: (_: unknown, record: BlockedTime) => (
        <Space>
          <CustomTooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="!text-blue-500 hover:!text-blue-600 dark:!text-blue-400 dark:hover:!text-blue-300 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
              size="small"
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
                className="hover:!bg-red-50 dark:hover:!bg-red-900/20"
                size="small"
              />
            </CustomTooltip>
          </CustomPopconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-colors shadow-sm">
      {blockedTimes.length === 0 ? (
        <div className="py-16 px-4">
          <Empty
            description={
              <div className="text-center">
                <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Nenhum bloqueio cadastrado
                </p>
                <p className="text-zinc-400 dark:text-zinc-500 text-sm">
                  Bloqueie datas ou horários para impedir agendamentos
                </p>
              </div>
            }
            image={
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <StopOutlined className="text-3xl text-red-500" />
              </div>
            }
          >
            <Button
              type="primary"
              onClick={onAdd}
              className="!bg-red-600 hover:!bg-red-500 !border-0 !shadow-lg !shadow-red-600/20"
            >
              Criar primeiro bloqueio
            </Button>
          </Empty>
        </div>
      ) : (
        <Table
          dataSource={blockedTimes}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => (
              <span className="text-zinc-500 dark:text-zinc-400">
                {total} bloqueio(s)
              </span>
            ),
          }}
          rowClassName={(record) => {
            const d = parseISO(record.date);
            const isPast = isBefore(d, today) && !isSameDay(d, today);
            return isPast ? "opacity-50" : "";
          }}
          className="
            [&_.ant-table]:!bg-transparent
            [&_.ant-table-thead>tr>th]:!bg-zinc-50
            dark:[&_.ant-table-thead>tr>th]:!bg-zinc-800/50
            [&_.ant-table-thead>tr>th]:!border-b
            [&_.ant-table-thead>tr>th]:!border-zinc-200
            dark:[&_.ant-table-thead>tr>th]:!border-zinc-700
            [&_.ant-table-tbody>tr>td]:!border-b
            [&_.ant-table-tbody>tr>td]:!border-zinc-100
            dark:[&_.ant-table-tbody>tr>td]:!border-zinc-800
            [&_.ant-table-tbody>tr:hover>td]:!bg-zinc-50
            dark:[&_.ant-table-tbody>tr:hover>td]:!bg-zinc-800/30
            [&_.ant-pagination]:!mt-4
            [&_.ant-pagination-item]:!border-zinc-200
            dark:[&_.ant-pagination-item]:!border-zinc-700
            [&_.ant-pagination-item]:!bg-white
            dark:[&_.ant-pagination-item]:!bg-zinc-800
            [&_.ant-pagination-item>a]:!text-zinc-700
            dark:[&_.ant-pagination-item>a]:!text-zinc-300
            [&_.ant-pagination-item-active]:!bg-blue-500
            [&_.ant-pagination-item-active]:!border-blue-500
            [&_.ant-pagination-item-active>a]:!text-white
            [&_.ant-select-selector]:!bg-white
            dark:[&_.ant-select-selector]:!bg-zinc-800
            [&_.ant-select-selector]:!border-zinc-200
            dark:[&_.ant-select-selector]:!border-zinc-700
          "
        />
      )}
    </div>
  );
};
