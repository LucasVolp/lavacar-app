"use client";

import {
  CalendarOutlined,
  LineChartOutlined,
  GlobalOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const features = [
  {
    title: "Gestão de Agenda 24h Sem Interrupções",
    description:
      "Seu cliente agenda sozinho, a qualquer hora, direto pela sua vitrine. Chega de perder serviço porque estava ocupado no WhatsApp.",
    icon: <CalendarOutlined />,
    highlight: "Agendamento automático",
  },
  {
    title: "Dashboard de Receita em Tempo Real",
    description:
      "Veja a receita de cada dia, filial e serviço. Ticket médio, volume de atendimentos e histórico sempre à mão.",
    icon: <LineChartOutlined />,
    highlight: "Decisão por dado",
  },
  {
    title: "Seu Site de Alta Conversão",
    description:
      "Vitrine premium com URL personalizada: nexocar.com.br/shop/sua-estetica. Design dark de elite que você vai querer colocar na bio.",
    icon: <GlobalOutlined />,
    highlight: "Portfólio premium",
  },
  {
    title: "Múltiplas Filiais no Mesmo Painel",
    description:
      "Gerencie todas as unidades em um só lugar. Agenda, comanda e receita consolidados ou por filial — você escolhe.",
    icon: <AppstoreOutlined />,
    highlight: "Operação multi-unidade",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-28 px-6 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-600/20 mb-6">
            <span className="text-blue-600 dark:text-blue-500 text-xs font-semibold tracking-wide uppercase">
              Tecnologia
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-base-content mb-6 leading-[1.1]">
            Ferramentas que{" "}
            <span className="text-blue-600 dark:text-blue-500">
              geram controle
            </span>
          </h2>
          <p className="text-base-content/70 text-lg leading-[1.8]">
            Nada de recursos genéricos. Cada funcionalidade foi desenhada para
            quem opera um lava-rápido de verdade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-base-200 border border-base-content/10 hover:border-blue-600/40 rounded-2xl p-8 transition-colors duration-200"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-500 text-xl">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-base-content/50">
                    {feature.highlight}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-base-content mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/65 leading-[1.8] text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
