import { Button, Spin } from "antd";
import { CreditCardOutlined, ReloadOutlined } from "@ant-design/icons";

interface AwaitingCCStepProps {
  checkoutUrl?: string;
  onVerify: () => void;
  onCancel: () => void;
}

export function AwaitingCCStep({ checkoutUrl, onVerify, onCancel }: AwaitingCCStepProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-6 font-sans antialiased">
      <Spin size="large" />

      <div className="text-center">
        <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Aguardando confirmação do pagamento</p>
        <p className="mt-1 text-sm tracking-tight text-zinc-500 dark:text-zinc-400">Verificando automaticamente a cada 5 segundos...</p>
      </div>

      <div className="flex w-full flex-col gap-2">
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
        <Button type="default" size="large" onClick={onCancel} htmlType="button" className="h-12 w-full rounded-xl" ghost>
          Alterar forma de pagamento
        </Button>
      </div>
    </div>
  );
}
