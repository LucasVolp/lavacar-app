"use client";

import {
  CarOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

interface Step {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BookingStepsProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    key: "vehicle",
    title: "Veículo",
    description: "Selecione o veículo",
    icon: <CarOutlined />,
  },
  {
    key: "services",
    title: "Serviços",
    description: "Escolha os serviços",
    icon: <AppstoreOutlined />,
  },
  {
    key: "datetime",
    title: "Data e Hora",
    description: "Agende o horário",
    icon: <CalendarOutlined />,
  },
];

export function BookingSteps({ currentStep, steps = defaultSteps }: BookingStepsProps) {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-[#27272a] p-4 sm:p-6 md:p-8 mb-6 md:mb-8 transition-colors duration-300 shadow-sm">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-[#27272a] -z-0 -translate-y-1/2 rounded-full transition-colors duration-300" />
        
        <div
           className="absolute top-1/2 left-0 h-1 bg-slate-900 dark:bg-slate-50 transition-all duration-500 ease-out z-0 -translate-y-1/2 rounded-full shadow-lg shadow-slate-900/20 dark:shadow-[0_0_10px_rgba(255,255,255,0.5)]"
           style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group cursor-default bg-white dark:bg-[#18181b] px-4 -mx-4 transition-colors duration-300">
              <div
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg transition-all duration-500 border-2
                  ${isActive || isCompleted 
                    ? "bg-slate-900 dark:bg-[#09090b] border-slate-900 dark:border-slate-50 text-white dark:text-slate-50 shadow-lg shadow-slate-900/20 dark:shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] scale-110" 
                    : "bg-white dark:bg-[#18181b] border-slate-200 dark:border-[#27272a] text-slate-400 dark:text-slate-500 group-hover:border-slate-400 dark:group-hover:border-slate-600"}
                `}
              >
                {isCompleted ? <CheckCircleOutlined /> : step.icon}
              </div>
              <div className={`mt-3 text-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`text-sm font-bold tracking-tight transition-colors duration-300 ${isActive || isCompleted ? "text-slate-900 dark:text-slate-50" : "text-slate-400 dark:text-slate-500"}`}>
                  {step.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 font-medium hidden sm:block mt-1 transition-colors duration-300">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
