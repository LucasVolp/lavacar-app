"use client";

import React, { useState } from "react";
import { Table, Tag, Avatar, Tooltip, Button, Modal, Form, Select, message, Popconfirm } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { OrganizationMember } from "@/types/organization";
import { useUpdateOrganizationMember, useDeleteOrganizationMember } from "@/hooks/useOrganizations";

export interface ExtendedMember extends OrganizationMember {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

interface MembersListProps {
  members: ExtendedMember[];
}

const ROLE_MAP: Record<string, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  EMPLOYEE: "Funcionário",
  USER: "Usuário",
};

export const MembersList: React.FC<MembersListProps> = ({ members }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ExtendedMember | null>(null);
  const [form] = Form.useForm();

  const updateMember = useUpdateOrganizationMember();
  const deleteMember = useDeleteOrganizationMember();

  const handleEdit = (member: ExtendedMember) => {
    setEditingMember(member);
    form.setFieldsValue({ role: member.role });
    setIsModalOpen(true);
  };

  const handleUpdate = async (values: { role: string }) => {
    if (!editingMember) return;

    try {
      await updateMember.mutateAsync({
        id: editingMember.id,
        payload: { role: values.role },
      });
      message.success("Permissões atualizadas com sucesso!");
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error(error);
      message.error("Erro ao atualizar permissões.");
    }
  };

  const handleDelete = async (memberId: string) => {
    try {
      await deleteMember.mutateAsync(memberId);
      message.success("Membro removido com sucesso!");
    } catch (error) {
      console.error(error);
      message.error("Erro ao remover membro.");
    }
  };

  const columns = [
    {
      title: "Membro",
      key: "user",
      render: (_: unknown, record: ExtendedMember) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.user?.avatarUrl}
            icon={<UserOutlined />}
            className="bg-indigo-600"
          />
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {record.user?.name || `Usuário ${record.userId.substring(0, 8)}...`}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {record.user?.email || "Email não disponível"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Função",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color = "default";
        if (role === "OWNER") color = "gold";
        if (role === "ADMIN") color = "purple";
        if (role === "MANAGER") color = "blue";

        return (
          <Tag
            color={color}
            className="font-medium border-0 px-3 py-1 bg-opacity-20"
          >
            {ROLE_MAP[role] || role}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "error"} variant="filled">
          {isActive ? "Ativo" : "Inativo"}
        </Tag>
      ),
    },
    {
      title: "Data de Entrada",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-zinc-500 dark:text-zinc-400">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: ExtendedMember) => {
        const isOwner = record.role === "OWNER";
        
        return (
          <div className="flex gap-2">
            <Tooltip title="Editar Permissões" color="blue">
              <Button
                type="text"
                icon={<EditOutlined />}
                className="text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            {!isOwner && (
              <Popconfirm
                title="Remover membro"
                description="Tem certeza que deseja remover este membro da organização?"
                onConfirm={() => handleDelete(record.id)}
                okText="Sim"
                cancelText="Não"
                okButtonProps={{ loading: deleteMember.isPending }}
              >
                <Tooltip title="Remover Membro" color="red">
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                  />
                </Tooltip>
              </Popconfirm>
            )}
            {isOwner && (
              <Tooltip title="Não é possível remover o proprietário">
                <Button 
                   type="text" 
                   disabled 
                   icon={<DeleteOutlined />} 
                   className="text-zinc-300 dark:text-zinc-700 opacity-50 cursor-not-allowed"
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <Table
          dataSource={members}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="custom-table"
          locale={{
            emptyText: (
              <div className="py-8 text-zinc-500">Nenhum membro encontrado</div>
            ),
          }}
        />
      </div>

      <Modal
        title="Editar Permissões"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingMember(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{ role: editingMember?.role }}
        >
          <Form.Item
            name="role"
            label="Função"
            rules={[{ required: true, message: "Selecione uma função" }]}
          >
            <Select>
              {Object.entries(ROLE_MAP).map(([value, label]) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateMember.isPending}
            >
              Salvar Alterações
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};