import { Button, Form, Input, Spin, Steps } from "antd";
import { ArrowRightOutlined, BankOutlined, CreditCardOutlined, NumberOutlined, QrcodeOutlined } from "@ant-design/icons";
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

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            requiredMark={false}
            size="large"
            className="flex flex-col gap-4"
            style={{ fontFamily: "var(--font-sans)" }}
        >
            <div className="mb-2">
                <Steps
                    current={1}
                    size="small"
                    items={[{ title: "Plano" }, { title: "Dados" }, { title: "Pagamento" }]}
                    style={{ fontFamily: "var(--font-sans)" }}
                />
            </div>

            <Form.Item
                name="document"
                label={
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                        CPF ou CNPJ
                    </span>
                }
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
                    prefix={<NumberOutlined className="text-zinc-400 mr-2" />}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    onChange={onDocumentChange}
                    onBlur={onDocumentBlur}
                    suffix={loadingCnpj ? <Spin size="small" /> : null}
                    className="h-12 rounded-xl"
                    style={{ fontFamily: "var(--font-sans)" }}
                />
            </Form.Item>

            <Form.Item
                name="orgName"
                label={
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                        Nome da empresa
                    </span>
                }
                rules={[{ required: true, message: "Informe o nome da sua empresa" }]}
            >
                <Input
                    prefix={<BankOutlined className="text-zinc-400 mr-2" />}
                    placeholder="Ex: Lavacar do João"
                    className="h-12 rounded-xl"
                    style={{ fontFamily: "var(--font-sans)" }}
                />
            </Form.Item>

            <Form.Item
                label={
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                        Forma de pagamento
                    </span>
                }
                className="mb-0"
            >
                <div className="grid grid-cols-2 gap-3">
                    {(["PIX", "CREDIT_CARD"] as BillingType[]).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => onBillingTypeChange(type)}
                            className={`h-14 rounded-xl flex items-center justify-center gap-2 border-2 text-base font-semibold transition-all duration-200 ${
                                selectedBillingType === type
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm shadow-indigo-500/20"
                                    : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                            }`}
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            {type === "CREDIT_CARD" && <CreditCardOutlined />}
                            {type === "PIX" && <QrcodeOutlined />}
                            {type === "PIX" ? "PIX" : "Cartão"}
                        </button>
                    ))}
                </div>
            </Form.Item>

            <div className="flex items-center justify-between py-3 border-t border-zinc-100 dark:border-zinc-800 mt-1" style={{ fontFamily: "var(--font-sans)" }}>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total por mês</span>
                <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    {fmt.format(PLAN_CONFIG[selectedCycle].price)}
                </span>
            </div>

            <div className="flex gap-3">
                <Button 
                    size="large" 
                    onClick={onBack} 
                    htmlType="button"
                    className="h-14 rounded-xl flex-1"
                    style={{ fontFamily: "var(--font-sans)" }}
                >
                    Voltar
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    className="h-14 rounded-xl flex-1"
                    style={{ fontFamily: "var(--font-sans)" }}
                >
                    {selectedBillingType === "PIX" ? "Gerar PIX" : "Ir para pagamento"}
                </Button>
            </div>
        </Form>
    );
}
