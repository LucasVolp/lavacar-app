import { Alert, Button } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";

interface PendingStepProps {
  onPay: () => void;
  onCancel: () => void;
}

export function PendingStep({ onPay, onCancel }: PendingStepProps) {
  return (
    <div className="flex flex-col gap-4 font-sans antialiased">
      <Alert
        type="info"
        message="Pagamento pendente"
        description="Você tem um pagamento pendente. Clique abaixo para concluir."
        showIcon
        className="rounded-xl"
      />
      <Button
        type="primary"
        size="large"
        icon={<CreditCardOutlined />}
        onClick={onPay}
        htmlType="button"
        className="h-14 w-full rounded-xl"
      >
        Ir para o pagamento
      </Button>
      <Button type="default" size="large" onClick={onCancel} htmlType="button" className="h-12 w-full rounded-xl" ghost>
        Alterar forma de pagamento
      </Button>
    </div>
  );
}
