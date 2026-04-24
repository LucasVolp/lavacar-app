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
        <div className="flex flex-col gap-5">
            <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Assinatura ativa
                </span>
            </div>

            {subscription && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700/60">
                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1.5">
                            Mensalidade
                        </p>
                        <p className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            {fmt.format(subscription.price)}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">por mês</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700/60">
                        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1.5">
                            Próx. cobrança
                        </p>
                        <p className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                            {subscription.nextDueDate
                                ? new Date(subscription.nextDueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
                                : "—"}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                            {subscription.nextDueDate
                                ? new Date(subscription.nextDueDate).getFullYear()
                                : ""}
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
                className="h-14 w-full rounded-xl mt-1"
            >
                Acessar organização
            </Button>
        </div>
    );
}
