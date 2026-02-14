"use client";

import React from "react";
import { Button, Card, Input, Typography } from "antd";
import { SaveOutlined, HeartOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ClientPreferencesTabProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export const ClientPreferencesTab: React.FC<ClientPreferencesTabProps> = ({
  value,
  onChange,
  onSave,
  saving,
}) => {
  return (
    <Card className="!rounded-2xl !shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center">
          <HeartOutlined className="text-pink-500" />
        </span>
        <Title level={5} className="!m-0 dark:!text-zinc-100">
          Preferências e Manhas
        </Title>
      </div>

      <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 p-3 mb-4 flex items-start gap-2">
        <InfoCircleOutlined className="text-blue-500 mt-0.5 shrink-0" />
        <Text className="text-xs text-blue-700 dark:text-blue-300">
          Registre informações úteis como: &quot;Gosta de café sem açúcar&quot;, &quot;Não gosta de perfume forte&quot;,
          &quot;Prefere aguardar fora&quot;. Essas anotações ajudam a personalizar o atendimento.
        </Text>
      </div>

      <TextArea
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Preferências e observações internas do cliente..."
        className="!rounded-xl !resize-none"
        showCount
        maxLength={1000}
      />
      <div className="flex justify-end mt-4">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          loading={saving}
          size="large"
          className="!rounded-xl !px-8"
        >
          Salvar Preferências
        </Button>
      </div>
    </Card>
  );
};
