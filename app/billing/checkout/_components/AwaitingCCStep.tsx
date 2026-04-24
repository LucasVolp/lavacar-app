import { Button, Spin } from "antd";
import { CreditCardOutlined, ReloadOutlined } from "@ant-design/icons";

interface AwaitingCCStepProps {
    checkoutUrl?: string;
    onVerify: () => void;
}

export function AwaitingCCStep({ checkoutUrl, onVerify }: AwaitingCCStepProps) {
    return (
        <div className="flex flex-col items-center gap-5 py-6">
            <Spin size="large" />

            <div className="text-center">
                <p className="text-base font-semibold text-zinc-900 dark:text-white">
                    Aguardando confirmação do pagamento
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Verificando automaticamente a cada 5 segundos...
                </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
                <Button
                    type="primary"
                    size="large"
                    icon={<ReloadOutlined />}
                    onClick={onVerify}
                    htmlType="button"
                    className="h-12 w-full rounded-xl"
                >
                    Já paguei — verificar agora
                </Button>
                {checkoutUrl && (
                    <Button
                        size="large"
                        icon={<CreditCardOutlined />}
                        onClick={() => window.open(checkoutUrl, "_blank")}
                        htmlType="button"
                        className="h-12 w-full rounded-xl"
                    >
                        Reabrir página de pagamento
                    </Button>
                )}
            </div>
        </div>
    );
}
