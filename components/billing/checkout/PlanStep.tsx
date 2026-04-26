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
    <div className="!font-sans antialiased text-zinc-900 dark:text-zinc-50 [&_*]:!font-sans">
      <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">Escolha seu plano</p>
        <div className="grid grid-cols-2 gap-3">
          {(Object.values(PLAN_CONFIG) as typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG][]).map((plan) => (
            <button
              key={plan.cycle}
              type="button"
              onClick={() => onCycleChange(plan.cycle)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                selectedCycle === plan.cycle
                  ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-500/20 dark:bg-indigo-500/10"
                  : "border-zinc-200 hover:border-indigo-300 dark:border-zinc-700 dark:hover:border-indigo-700"
              }`}
            >
              {"savings" in plan && (
                <Tag color="green" className="absolute -right-2 -top-2 text-xs">
                  {(plan as typeof PLAN_CONFIG.ANNUALLY).savings}
                </Tag>
              )}
              <p className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{plan.label}</p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">{fmt.format(plan.price)}</p>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">por mês</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-zinc-100 py-4 dark:border-zinc-800">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-200">
            <CheckCircleFilled className="text-sm text-green-500" />
            <span className="font-medium tracking-tight">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        type="primary"
        size="large"
        icon={<ArrowRightOutlined />}
        onClick={onContinue}
        htmlType="button"
        className="!h-14 !w-full !rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        Continuar
      </Button>
      </div>
    </div>
  );
}
