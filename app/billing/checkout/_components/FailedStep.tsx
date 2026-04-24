import { Alert, Button } from "antd";
import { ArrowRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";

interface FailedStepProps {
    onRetry: () => void;
}

export function FailedStep({ onRetry }: FailedStepProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 flex items-center justify-center">
                    <ExclamationCircleFilled className="text-2xl text-red-500 dark:text-red-400" />
                </div>
                <div className="text-center">
                    <p className="text-base font-semibold text-zinc-900 dark:text-white">
                        Pagamento não confirmado
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Seu pagamento foi recusado ou cancelado pela operadora.
                    </p>
                </div>
            </div>

            <Alert
                type="error"
                message="O que pode ter acontecido?"
                description={
                    <ul className="text-sm space-y-1 mt-1 list-disc list-inside">
                        <li>Cartão sem limite suficiente</li>
                        <li>Dados do cartão incorretos</li>
                        <li>Transação bloqueada pelo banco emissor</li>
                    </ul>
                }
                showIcon
                className="rounded-xl"
            />

            <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={onRetry}
                htmlType="button"
                className="h-14 w-full rounded-xl"
            >
                Tentar novamente
            </Button>
        </div>
    );
}
