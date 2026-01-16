"use client";

import React from "react";
import { Form, Switch, Divider, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const DangerZone = () => {
  return (
    <section className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 p-6 rounded-2xl">
      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
        <DeleteOutlined /> Zona de Perigo
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-zinc-900 dark:text-zinc-200 font-medium">Desativar Organização</h3>
          <p className="text-zinc-500 text-sm">
            Isso irá ocultar a organização e todas as suas lojas temporariamente.
          </p>
        </div>
        <Form.Item name="isActive" valuePropName="checked" noStyle>
          <Switch checkedChildren="Ativo" unCheckedChildren="Inativo" />
        </Form.Item>
      </div>

      <Divider className="border-red-100 dark:border-red-900/30 my-6" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-zinc-900 dark:text-zinc-200 font-medium">Excluir Organização</h3>
          <p className="text-zinc-500 text-sm">
            Esta ação é irreversível. Todos os dados serão perdidos.
          </p>
        </div>
        <Button danger type="primary" ghost>
          Excluir Organização
        </Button>
      </div>
    </section>
  );
};
