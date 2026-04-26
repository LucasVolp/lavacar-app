import { Button, Tag } from "antd";
import { ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";
import type { BillingCycle } from "@/types/billing";
import { PLAN_CONFIG } from "@/types/billing";

const FEATURES = [
    "Painel de controle completo",
    "Agendamentos ilimitados",
    "Múltiplas filiais",
    "Suporte prioritário",
];

interface PlanStepProps {
    selectedCycle: BillingCycle;
    onCycleChange: (cycle: BillingCycle) => void;
    onContinue: () => void;
}

export function PlanStep({ selectedCycle, onCycleChange, onContinue }: PlanStepProps) {
    const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-3 tracking-wide">
                    Escolha seu plano
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {(Object.values(PLAN_CONFIG) as typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG][]).map((plan) => (
                        <button
                            key={plan.cycle}
                            type="button"
                            onClick={() => onCycleChange(plan.cycle)}
                            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                selectedCycle === plan.cycle
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm shadow-indigo-500/20"
                                    : "border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                            }`}
                        >
                            {"savings" in plan && (
                                <Tag color="green" className="absolute -top-2 -right-2 text-xs">
                                    {(plan as typeof PLAN_CONFIG.ANNUALLY).savings}
                                </Tag>
                            )}
                            <p className="font-bold text-zinc-900 dark:text-white text-sm">{plan.label}</p>
                            <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 tracking-tight">
                                {fmt.format(plan.price)}
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">por mês</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2.5 py-4 border-t border-zinc-100 dark:border-zinc-800">
                {FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <CheckCircleFilled className="text-green-500 text-sm flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                    </div>
                ))}
            </div>

            <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={onContinue}
                htmlType="button"
                className="h-14 w-full rounded-xl text-base"
            >
                Continuar
            </Button>
        </div>
    );
}
