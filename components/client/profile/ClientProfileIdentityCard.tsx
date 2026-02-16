"use client";

import React from "react";
import { Avatar, Button, Card, Tag, Upload, message } from "antd";
import {
  CalendarOutlined,
  CameraOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { PublicUser } from "@/types/user";
import type { UploadProps } from "antd";
import { usersService } from "@/services/users";

interface ClientProfileIdentityCardProps {
  user: PublicUser;
  memberSince: string;
  onAvatarUpdated?: () => Promise<void> | void;
}

export const ClientProfileIdentityCard: React.FC<ClientProfileIdentityCardProps> = ({
  user,
  memberSince,
  onAvatarUpdated,
}) => {
  const handleAvatarUpload: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
    try {
      await usersService.uploadAvatar(user.id, file as File);
      await onAvatarUpdated?.();
      message.success("Avatar atualizado com sucesso");
      onSuccess?.("ok");
    } catch {
      message.error("Erro ao atualizar avatar");
      onError?.(new Error("Upload failed"));
    }
  };

  return (
    <div className="space-y-4">
      <Card
        className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-zinc-900"
        styles={{ body: { padding: 0 } }}
      >
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative"></div>
        <div className="px-6 pb-6 text-center relative">
          <div className="relative inline-block -mt-12 mb-3">
            <Avatar
              size={96}
              src={user.picture}
              icon={<UserOutlined />}
              className="border-4 border-white dark:border-zinc-900 bg-indigo-100 dark:bg-indigo-900 text-indigo-500 shadow-md"
            />
            <Upload showUploadList={false} customRequest={handleAvatarUpload} accept="image/*">
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                size="small"
                className="absolute bottom-0 right-0 shadow-sm"
              />
            </Upload>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 m-0">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
            {user.email}
          </p>
          <Tag
            icon={<CalendarOutlined />}
            className="rounded-full px-3 py-1 border-0 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          >
            Membro desde {memberSince}
          </Tag>
        </div>
      </Card>
    </div>

  );
};
