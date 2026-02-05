"use client";

import React from "react";
import { List, Avatar, Rate, Button, Popconfirm } from "antd";
import { UserOutlined, DeleteOutlined, CalendarOutlined, StarOutlined } from "@ant-design/icons";
import { Evaluation } from "@/types/evaluation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EvaluationListProps {
  evaluations: Evaluation[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export const EvaluationList: React.FC<EvaluationListProps> = ({ evaluations, loading, onDelete }) => {
  return (
    <List
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden"
      loading={loading}
      itemLayout="horizontal"
      dataSource={evaluations}
      locale={{
        emptyText: (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400">
                <StarOutlined className="text-4xl mb-3 opacity-30" />
                <p>Nenhuma avaliação recebida ainda.</p>
            </div>
        )
      }}
      renderItem={(item) => (
        <List.Item
          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors px-6 py-6"
          actions={[
            <Popconfirm
              key="delete"
              title="Excluir avaliação?"
              description="Esta ação não pode ser desfeita."
              onConfirm={() => onDelete(item.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Popconfirm>
          ]}
        >
            <div className="flex gap-4 w-full group">
                {/* Avatar Placeholder */}
                <Avatar 
                    size={48} 
                    icon={<UserOutlined />} 
                    className="flex-shrink-0 bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                />
                
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                           Cliente {/* Nome do usuário não está na interface Evaluation, usando placeholder */}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                             <CalendarOutlined />
                             {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ptBR })}
                        </div>
                    </div>

                    <div className="mb-2">
                        <Rate disabled defaultValue={item.rating} className="text-sm text-yellow-500" />
                    </div>

                    {item.comment ? (
                         <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm">
                             {item.comment}
                         </p>
                    ) : (
                        <span className="italic text-zinc-400 text-sm">Sem comentário escrito</span>
                    )}
                </div>
            </div>
        </List.Item>
      )}
      pagination={{
        pageSize: 10,
        align: "center",
        className: "!mb-6"
      }}
    />
  );
};
