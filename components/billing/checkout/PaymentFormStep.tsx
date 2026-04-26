import { Button, Form, Input, Spin } from "antd";
import {
  ArrowRightOutlined,
  BankOutlined,
  CreditCardOutlined,
  NumberOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { BillingType, BillingCycle } from "@/types/billing";
import { PLAN_CONFIG } from "@/types/billing";

interface PaymentFormValues {
  orgName: string;
  document: string;
}

interface PaymentFormStepProps {
  form: FormInstance<PaymentFormValues>;
  selectedBillingType: BillingType;
  selectedCycle: BillingCycle;
  loadingCnpj: boolean;
  onBillingTypeChange: (type: BillingType) => void;
  onDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDocumentBlur: () => void;
  onBack: () => void;
  onSubmit: (values: PaymentFormValues) => void;
}

export function PaymentFormStep({
  form,
  selectedBillingType,
  selectedCycle,
  loadingCnpj,
  onBillingTypeChange,
  onDocumentChange,
  onDocumentBlur,
  onBack,
  onSubmit,
}: PaymentFormStepProps) {
  const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const stepPills = ["Plano", "Dados da Empresa", "Pagamento"];

  return (
    <div className="!font-sans antialiased text-zinc-900 dark:text-zinc-50 [&_*]:!font-sans">
      <div className="mb-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          {stepPills.map((label, index) => {
            const isCurrent = index === 1;
            return (
              <div
                key={label}
                className={`flex-1 rounded-xl px-3 py-2 text-center text-xs font-semibold tracking-tight sm:text-sm ${
                  isCurrent
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs font-medium tracking-tight text-zinc-500 dark:text-zinc-400">Etapa 2 de 3: Dados da Empresa</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        size="large"
        className="flex flex-col gap-4"
      >
        <Form.Item
          name="document"
          label={<span className="mb-1.5 text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">CPF ou CNPJ</span>}
          rules={[
            { required: true, message: "Informe seu CPF ou CNPJ" },
            {
              validator: (_, value) => {
                const digits = (value || "").replace(/\D/g, "");
                if (digits.length !== 11 && digits.length !== 14) {
                  return Promise.reject("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            prefix={<NumberOutlined className="mr-2 text-zinc-400" />}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            onChange={onDocumentChange}
            onBlur={onDocumentBlur}
            suffix={loadingCnpj ? <Spin size="small" /> : null}
            className="!h-14 !rounded-xl !border-zinc-200 !bg-zinc-50 text-lg transition-all focus:!bg-white focus:!border-brand-500 focus:!ring-2 focus:!ring-brand-500/20 dark:!border-zinc-700 dark:!bg-zinc-900"
          />
        </Form.Item>

        <Form.Item
          name="orgName"
          label={<span className="mb-1.5 text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">Nome da empresa</span>}
          rules={[{ required: true, message: "Informe o nome da sua empresa" }]}
        >
          <Input
            prefix={<BankOutlined className="mr-2 text-zinc-400" />}
            placeholder="Ex: Lavacar do João"
            className="!h-14 !rounded-xl !border-zinc-200 !bg-zinc-50 text-lg transition-all focus:!bg-white focus:!border-brand-500 focus:!ring-2 focus:!ring-brand-500/20 dark:!border-zinc-700 dark:!bg-zinc-900"
          />
        </Form.Item>

        <Form.Item
          label={<span className="mb-1.5 text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">Forma de pagamento</span>}
          className="mb-0"
        >
          <div className="grid grid-cols-2 gap-3">
            {(["PIX", "CREDIT_CARD"] as BillingType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onBillingTypeChange(type)}
                className={`flex h-14 items-center justify-center gap-2 rounded-xl border-2 text-base font-semibold tracking-tight transition-all duration-200 ${
                  selectedBillingType === type
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "border-zinc-200 text-zinc-700 hover:border-indigo-300 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-indigo-700"
                }`}
              >
                {type === "CREDIT_CARD" && <CreditCardOutlined />}
                {type === "PIX" && <QrcodeOutlined />}
                {type === "PIX" ? "PIX" : "Cartão"}
              </button>
            ))}
          </div>
        </Form.Item>

        <div className="mt-1 flex items-center justify-between border-t border-zinc-100 py-3 dark:border-zinc-800">
          <span className="text-sm font-medium tracking-tight text-zinc-500 dark:text-zinc-400">Total por mês</span>
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{fmt.format(PLAN_CONFIG[selectedCycle].price)}</span>
        </div>

        <div className="flex gap-3">
          <Button size="large" onClick={onBack} htmlType="button" className="!h-14 flex-1 !rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform">
            Voltar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<ArrowRightOutlined />}
            className="!h-14 flex-1 !rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            {selectedBillingType === "PIX" ? "Gerar PIX" : "Ir para pagamento"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
