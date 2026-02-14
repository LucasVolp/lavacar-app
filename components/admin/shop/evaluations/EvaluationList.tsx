"use client";

import React from "react";
import { List, Avatar, Rate, Button, Popconfirm, Image } from "antd";
import { DeleteOutlined, CalendarOutlined, StarOutlined, PictureOutlined } from "@ant-design/icons";
import { EvaluationWithRelations } from "@/types/evaluation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { sanitizeText } from "@/lib/security";

interface EvaluationListProps {
  evaluations: EvaluationWithRelations[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const getDisplayName = (item: EvaluationWithRelations) =>
  sanitizeText(
    item.user
      ? [item.user.firstName, item.user.lastName].filter(Boolean).join(" ")
      : "Cliente"
  );

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "CL";

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 78%)`;
};

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
            {(() => {
              const displayName = getDisplayName(item);
              const initials = getInitials(displayName);
              const avatarColor = getAvatarColor(displayName);
              const comment = item.comment?.trim();
              const picture = item.user?.picture;
              const photos = item.photos ?? [];

              return (
            <div className="flex gap-4 w-full group min-w-0">
                <Avatar 
                    size={48} 
                    src={picture || undefined}
                    className="flex-shrink-0 text-zinc-700"
                    style={!picture ? { backgroundColor: avatarColor } : undefined}
                >
                  {!picture ? initials : null}
                </Avatar>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-base truncate">
                           {displayName}
                        </span>
                        <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                             <CalendarOutlined />
                             {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ptBR })}
                        </div>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                        <Rate disabled value={item.rating} className="text-sm text-yellow-500" />
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          {item.rating.toFixed(1)}
                        </span>
                    </div>

                    {comment ? (
                         <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm break-words">
                             {sanitizeText(comment)}
                         </p>
                    ) : (
                        <span className="italic text-zinc-500 dark:text-zinc-500 text-sm">Avaliação sem comentário</span>
                    )}

                    {/* Photos Gallery */}
                    {photos.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                          <PictureOutlined />
                          <span>{photos.length} foto{photos.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <Image.PreviewGroup>
                            {photos.map((photo, idx) => (
                              <Image
                                key={idx}
                                src={photo}
                                alt={`Foto ${idx + 1}`}
                                width={56}
                                height={56}
                                className="rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNjY2MiIGZvbnQtc2l6ZT0iMTAiPkVycm88L3RleHQ+PC9zdmc+"
                              />
                            ))}
                          </Image.PreviewGroup>
                        </div>
                      </div>
                    )}
                </div>
            </div>
              );
            })()}
        </List.Item>
      )}
      pagination={false}
    />
  );
};
