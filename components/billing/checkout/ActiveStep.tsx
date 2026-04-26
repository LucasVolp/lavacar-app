import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import type { SubscriptionInfo } from "@/types/billing";

interface ActiveStepProps {
  subscription?: SubscriptionInfo;
  onNavigate: () => void;
}

export function ActiveStep({ subscription, onNavigate }: ActiveStepProps) {
  const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex flex-col gap-5 font-sans antialiased">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-1.5 text-sm font-semibold tracking-tight text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Assinatura ativa
        </span>
      </div>

      {subscription && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700/60 dark:bg-zinc-800/60">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Mensalidade</p>
            <p className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{fmt.format(subscription.price)}</p>
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">por mês</p>
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700/60 dark:bg-zinc-800/60">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Próx. cobrança</p>
            <p className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {subscription.nextDueDate
                ? new Date(subscription.nextDueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
                : "—"}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              {subscription.nextDueDate ? new Date(subscription.nextDueDate).getFullYear() : ""}
            </p>
          </div>
        </div>
      )}

      <Button
        type="primary"
        size="large"
        icon={<ArrowRightOutlined />}
        onClick={onNavigate}
        htmlType="button"
        className="h-14 w-full rounded-xl"
      >
        Acessar organização
      </Button>
    </div>
  );
}
