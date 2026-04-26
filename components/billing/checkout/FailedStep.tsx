import { Alert, Button } from "antd";
import { ArrowRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";

interface FailedStepProps {
  onRetry: () => void;
  onCancel: () => void;
}

export function FailedStep({ onRetry, onCancel }: FailedStepProps) {
  return (
    <div className="flex flex-col gap-4 font-sans antialiased">
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20">
          <ExclamationCircleFilled className="text-2xl text-red-500 dark:text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Pagamento não confirmado</p>
          <p className="mt-1 text-sm tracking-tight text-zinc-500 dark:text-zinc-400">Seu pagamento foi recusado ou cancelado pela operadora.</p>
        </div>
      </div>

      <Alert
        type="error"
        message="O que pode ter acontecido?"
        description={
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm">
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
      <Button type="default" size="large" onClick={onCancel} htmlType="button" className="h-12 w-full rounded-xl" ghost>
        Alterar forma de pagamento
      </Button>
    </div>
  );
}
