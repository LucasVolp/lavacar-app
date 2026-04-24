import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { PixPaymentDisplay } from "@/components/billing/PixPaymentDisplay";
import type { PixData } from "@/types/billing";

interface PixStepProps {
    pixData: PixData;
    price: number;
    onVerify: () => void;
}

export function PixStep({ pixData, price, onVerify }: PixStepProps) {
    return (
        <div className="flex flex-col gap-4">
            <PixPaymentDisplay pixData={pixData} price={price} />
            <Button
                type="link"
                icon={<ReloadOutlined />}
                onClick={onVerify}
                htmlType="button"
                className="text-zinc-400"
            >
                Verificar pagamento manualmente
            </Button>
        </div>
    );
}
