"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Avatar,
  Radio,
} from "antd";
import {
  UserAddOutlined,
  MailOutlined,
  UserOutlined,
  IdcardOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { InfoBox } from "@/components/ui";

interface InviteEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  shopName?: string;
}

const ROLE_OPTIONS = [
  {
    value: "EMPLOYEE",
    label: "Funcionário",
    description: "Acesso ao painel do shop, pode atender clientes e ver agendamentos",
    icon: <UserOutlined className="text-zinc-500" />
  },
  {
    value: "MANAGER",
    label: "Gerente",
    description: "Pode gerenciar funcionários, serviços e configurações do shop",
    icon: <IdcardOutlined className="text-blue-500" />
  },
];

export const InviteEmployeeModal: React.FC<InviteEmployeeModalProps> = ({
  open,
  onClose,
  shopName,
}) => {
  const [form] = Form.useForm();
  const selectedRole = Form.useWatch("role", form);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");

  const handleSubmit = async (values: { name: string; email: string; role: string }) => {
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setInvitedEmail(values.email);
    setInviteSent(true);
    setIsSubmitting(false);
    message.success("Convite enviado com sucesso!");
  };

  const handleClose = () => {
    setInviteSent(false);
    setInvitedEmail("");
    form.resetFields();
    onClose();
  };

  const handleSendAnother = () => {
    setInviteSent(false);
    setInvitedEmail("");
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
      centered
      destroyOnClose
      className="[&_.ant-modal-content]:dark:bg-zinc-900 [&_.ant-modal-header]:dark:bg-zinc-900 [&_.ant-modal-close]:dark:text-zinc-400"
      title={null}
    >
      {!inviteSent ? (
        <div className="py-2">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/25">
              <UserAddOutlined className="text-3xl text-white" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Convidar Funcionário
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs mx-auto">
              Envie um convite por email para adicionar um novo membro à equipe
              {shopName && <span className="font-medium text-zinc-700 dark:text-zinc-300"> do {shopName}</span>}
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ role: "EMPLOYEE" }}
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label={
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Nome completo
                </span>
              }
              rules={[{ required: true, message: "Informe o nome do funcionário" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-zinc-400" />}
                placeholder="Ex: João Silva"
                className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Email
                </span>
              }
              rules={[
                { required: true, message: "Informe o email" },
                { type: "email", message: "Email inválido" }
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined className="text-zinc-400" />}
                placeholder="joao@email.com"
                className="rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </Form.Item>

            <Form.Item
              name="role"
              label={
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Função
                </span>
              }
              rules={[{ required: true, message: "Selecione uma função" }]}
            >
              <Radio.Group className="w-full flex flex-col gap-3">
                {ROLE_OPTIONS.map((option) => (
                  <Radio key={option.value} value={option.value} className="!flex !items-start !p-0 !m-0 w-full [&>.ant-radio]:hidden">
                    <div
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full ${
                        selectedRole === option.value
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800/50"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedRole === option.value
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}>
                        {selectedRole === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {option.label}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <InfoBox
              title="Como funciona o convite?"
              description="O funcionário receberá um email com um link para criar sua conta e ter acesso ao painel do estabelecimento."
              variant="warning"
              icon={<MailOutlined className="text-lg" />}
              className="mb-6"
            />

            <div className="flex gap-3 pt-2">
              <Button
                size="large"
                onClick={handleClose}
                className="flex-1 h-12 rounded-xl font-medium text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SendOutlined />}
                className="flex-1 h-12 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-purple-500"
              >
                Enviar Convite
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-6 shadow-lg shadow-emerald-500/30">
            <CheckCircleOutlined className="text-4xl text-white" />
          </div>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Convite Enviado!
          </h2>

          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            Um email foi enviado para{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {invitedEmail}
            </span>{" "}
            com instruções para acessar o sistema.
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6 max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
              />
              <div className="text-left">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                  Convite pendente
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {invitedEmail}
                </p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Pendente
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 max-w-sm mx-auto">
            <Button
              size="large"
              onClick={handleSendAnother}
              icon={<UserAddOutlined />}
              className="flex-1 h-11 rounded-xl font-medium"
            >
              Convidar Outro
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleClose}
              className="flex-1 h-11 rounded-xl font-medium bg-zinc-900 dark:bg-zinc-700 border-none hover:bg-zinc-800 dark:hover:bg-zinc-600"
            >
              Concluir
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
