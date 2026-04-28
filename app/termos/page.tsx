import Link from "next/link";

export const metadata = {
  title: "Termos de Uso — NexoCar",
  description: "Leia os Termos de Uso da plataforma NexoCar.",
};

export default function TermosPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-6 text-zinc-800 dark:text-zinc-200">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-10"
      >
        ← Voltar ao início
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
        Termos de Uso
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
        Última atualização: 28 de Abril de 2026
      </p>

      <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed space-y-8">

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            1. O que é o NexoCar
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            O NexoCar é uma plataforma SaaS (Software como Serviço) de gestão automotiva voltada
            para estéticas, lava-cars e centros automotivos. Nossa função é fornecer a tecnologia
            — agendamentos, gestão de clientes, relatórios e vitrine digital — necessária para
            que os estabelecimentos operem com mais eficiência.
          </p>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mt-3">
            <strong>Importante:</strong> o NexoCar fornece a ferramenta, não os serviços. Somos
            uma empresa de tecnologia, não uma empresa prestadora de serviços automotivos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            2. Responsabilidades do Estabelecimento
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mb-3">
            Ao utilizar o NexoCar, o estabelecimento assume integralmente as seguintes
            responsabilidades:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-300">
            <li>
              <strong>Qualidade dos serviços:</strong> o estabelecimento é o único responsável
              pela execução dos serviços oferecidos aos seus clientes, incluindo qualidade,
              prazo e atendimento.
            </li>
            <li>
              <strong>Danos a veículos:</strong> qualquer dano físico ou material causado a
              veículos durante a prestação de serviços é de responsabilidade exclusiva do
              estabelecimento. O NexoCar não possui vínculo com a execução dos serviços e
              isenta-se de qualquer responsabilidade por danos de natureza física, material
              ou moral decorrentes da relação entre o estabelecimento e o cliente final.
            </li>
            <li>
              <strong>Veracidade das informações:</strong> o estabelecimento garante que os
              preços, serviços e horários cadastrados na plataforma são verídicos e estão
              atualizados.
            </li>
            <li>
              <strong>Conduta legal:</strong> o uso da plataforma deve estar em conformidade
              com a legislação brasileira vigente.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            3. Disponibilidade do Sistema
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            O NexoCar envida seus melhores esforços para manter o sistema disponível, mas não
            garante uptime de 100%. O sistema pode passar por janelas de manutenção, instabilidades
            técnicas ou indisponibilidades causadas por terceiros (provedores de nuvem, gateways de
            pagamento, etc.).
          </p>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mt-3">
            O NexoCar não se responsabiliza por lucros cessantes, perda de agendamentos ou
            quaisquer prejuízos decorrentes de indisponibilidade temporária da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            4. Pagamentos e Assinatura
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            O acesso completo à plataforma exige uma assinatura ativa. As condições são:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-300 mt-3">
            <li>
              O valor da mensalidade é cobrado de forma recorrente, conforme o plano
              contratado.
            </li>
            <li>
              A inadimplência no pagamento resultará na suspensão automática do acesso
              à plataforma até a regularização.
            </li>
            <li>
              O NexoCar reserva-se o direito de alterar os preços dos planos mediante
              comunicação prévia de 30 dias.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            5. Cancelamento
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            O cancelamento da assinatura pode ser solicitado a qualquer momento pelo
            responsável da conta, diretamente no painel de configurações ou via e-mail para{" "}
            <a
              href="mailto:suporte@nexocar.com.br"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              suporte@nexocar.com.br
            </a>
            .
          </p>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mt-3">
            <strong>Política de reembolso:</strong> não realizamos reembolso de mensalidades
            já utilizadas ou em curso. O acesso permanece ativo até o final do período pago.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            6. Contato
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            Dúvidas sobre estes termos podem ser enviadas para{" "}
            <a
              href="mailto:suporte@nexocar.com.br"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              suporte@nexocar.com.br
            </a>
            .
          </p>
        </section>

      </div>

      <div className="mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          © {new Date().getFullYear()} NexoCar. Todos os direitos reservados.
        </p>
        <div className="flex gap-5">
          <Link href="/privacidade" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Política de Privacidade
          </Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Início
          </Link>
        </div>
      </div>
    </main>
  );
}
