import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { PixPaymentDisplay } from "@/components/billing/PixPaymentDisplay";
import type { PixData } from "@/types/billing";

interface PixStepProps {
  pixData: PixData;
  price: number;
  onVerify: () => void;
  onCancel: () => void;
}

export function PixStep({ pixData, price, onVerify, onCancel }: PixStepProps) {
  return (
    <div className="flex flex-col gap-4 font-sans antialiased">
      <PixPaymentDisplay pixData={pixData} price={price} />
      <Button type="link" icon={<ReloadOutlined />} onClick={onVerify} htmlType="button" className="text-zinc-500">
        Verificar pagamento manualmente
      </Button>
      <Button type="default" size="large" onClick={onCancel} htmlType="button" className="h-12 w-full rounded-xl" ghost>
        Alterar forma de pagamento
      </Button>
    </div>
  );
}
