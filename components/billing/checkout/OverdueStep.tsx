import { Alert, Button } from "antd";
import { CreditCardOutlined, ExclamationCircleFilled, ReloadOutlined } from "@ant-design/icons";
import { PixPaymentDisplay } from "@/components/billing/PixPaymentDisplay";
import type { PixData } from "@/types/billing";

interface OverdueStepProps {
  checkoutUrl?: string;
  pixData?: PixData;
  price?: number;
  onPayCard: () => void;
  onRefresh: () => void;
}

export function OverdueStep({ checkoutUrl, pixData, price = 0, onPayCard, onRefresh }: OverdueStepProps) {
  return (
    <div className="flex flex-col gap-4 font-sans antialiased">
      <Alert
        type="warning"
        message="Pagamento atrasado"
        description="Seu pagamento está atrasado. Regularize para continuar acessando a plataforma."
        icon={<ExclamationCircleFilled />}
        showIcon
        className="rounded-xl"
      />

      {checkoutUrl && (
        <Button
          type="primary"
          size="large"
          danger
          icon={<CreditCardOutlined />}
          onClick={onPayCard}
          htmlType="button"
          className="h-14 w-full rounded-xl"
        >
          Regularizar pagamento
        </Button>
      )}

      {!checkoutUrl && pixData && <PixPaymentDisplay pixData={pixData} price={price} />}

      {!checkoutUrl && !pixData && (
        <Button
          size="large"
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          htmlType="button"
          className="h-14 w-full rounded-xl"
        >
          Verificar status
        </Button>
      )}
    </div>
  );
}
