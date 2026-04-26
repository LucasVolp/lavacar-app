import { Alert, Button } from "antd";
import { ArrowRightOutlined, ExclamationCircleFilled } from "@ant-design/icons";

interface CancelledStepProps {
  onResubscribe: () => void;
}

export function CancelledStep({ onResubscribe }: CancelledStepProps) {
  return (
    <div className="flex flex-col gap-4 font-sans antialiased">
      <Alert
        type="error"
        message="Assinatura cancelada"
        description="Sua assinatura foi cancelada. Assine novamente para reativar sua conta."
        icon={<ExclamationCircleFilled />}
        showIcon
        className="rounded-xl"
      />
      <Button
        type="primary"
        size="large"
        icon={<ArrowRightOutlined />}
        onClick={onResubscribe}
        htmlType="button"
        className="h-14 w-full rounded-xl"
      >
        Assinar novamente
      </Button>
    </div>
  );
}
