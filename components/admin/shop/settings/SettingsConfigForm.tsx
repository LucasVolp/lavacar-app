"use client";

import React from "react";
import { Form, InputNumber, Button, Row, Col, Divider, type FormInstance } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { UpdateShopDto } from "@/types/shop";
import { InfoBox } from "@/components/ui";

interface SettingsConfigFormProps {
  form: FormInstance;
  onFinish: (values: UpdateShopDto) => void;
  saving: boolean;
}

export const SettingsConfigForm: React.FC<SettingsConfigFormProps> = ({
  form,
  onFinish,
  saving,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-4xl"
    >
      <div className="mb-8">
        <InfoBox
          title="Configurações de Agendamento"
          description="Estas configurações definem como os slots de horário são gerados para os clientes. Alterações aqui afetam a disponibilidade futura."
          variant="info"
        />
      </div>

      <div className="mb-6 space-y-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Regras de Horário
        </h3>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="slotInterval"
              label={<span className="text-zinc-600 dark:text-zinc-400 font-medium">Intervalo entre Slots</span>}
              extra={<span className="text-xs text-zinc-500">Tempo entre o início de cada horário disponível</span>}
              rules={[{ required: true, message: "Informe o intervalo" }]}
            >
              <InputNumber 
                min={5} 
                max={120} 
                step={5}
                className="w-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                addonAfter={<span className="dark:text-zinc-400">min</span>}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="bufferBetweenSlots"
              label={<span className="text-zinc-600 dark:text-zinc-400 font-medium">Buffer entre Agendamentos</span>}
              extra={<span className="text-xs text-zinc-500">Tempo de folga entre um atendimento e outro</span>}
              rules={[{ required: true, message: "Informe o buffer" }]}
            >
              <InputNumber 
                min={0} 
                max={60} 
                step={5}
                className="w-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                addonAfter={<span className="dark:text-zinc-400">min</span>}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Restrições de Agendamento
        </h3>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxAdvanceDays"
              label={<span className="text-zinc-600 dark:text-zinc-400 font-medium">Máximo de dias para agendar</span>}
              extra={<span className="text-xs text-zinc-500">Quantos dias no futuro o cliente pode agendar</span>}
              rules={[{ required: true, message: "Informe o máximo" }]}
            >
              <InputNumber 
                min={1} 
                max={365} 
                className="w-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                addonAfter={<span className="dark:text-zinc-400">dias</span>}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="minAdvanceMinutes"
              label={<span className="text-zinc-600 dark:text-zinc-400 font-medium">Antecedência mínima</span>}
              extra={<span className="text-xs text-zinc-500">Tempo mínimo de antecedência para agendar</span>}
              rules={[{ required: true, message: "Informe a antecedência" }]}
            >
              <InputNumber 
                min={0} 
                max={1440} 
                step={15}
                className="w-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                addonAfter={<span className="dark:text-zinc-400">min</span>}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700/50 mb-6">
        <div className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2 text-sm">Exemplo prático:</div>
        <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
          <li><span className="font-medium">Intervalo de 30 min:</span> Agenda mostra horários às 8:00, 8:30, 9:00...</li>
          <li><span className="font-medium">Buffer de 10 min:</span> Se um serviço termina às 8:30, o próximo só pode começar às 8:40.</li>
          <li><span className="font-medium">Antecedência de 60 min:</span> Agora são 14:00, cliente só vê horários a partir das 15:00.</li>
        </ul>
      </div>

      <Divider className="dark:border-zinc-800" />

      <div className="flex justify-end">
        <Button 
          type="primary" 
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={saving}
          className="bg-blue-600 hover:bg-blue-500 border-none h-10 px-6 font-medium shadow-md shadow-blue-500/20"
        >
          Salvar Configurações
        </Button>
      </div>
    </Form>
  );
};
