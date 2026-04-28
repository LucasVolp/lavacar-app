import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — NexoCar",
  description: "Política de privacidade e tratamento de dados (LGPD) da plataforma NexoCar.",
};

export default function PrivacidadePage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-6 text-zinc-800 dark:text-zinc-200">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-10"
      >
        ← Voltar ao início
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
        Política de Privacidade e Tratamento de Dados
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
        Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
        Última atualização: 28 de Abril de 2026
      </p>

      <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed space-y-8">

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            1. Dados Coletados
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mb-4">
            O NexoCar coleta duas categorias de dados, conforme descrito abaixo:
          </p>

          <h3 className="text-base font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
            Do Estabelecimento (titular da conta)
          </h3>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-600 dark:text-zinc-300 mb-5">
            <li>CNPJ ou CPF do responsável</li>
            <li>Nome completo e razão social</li>
            <li>Endereço de e-mail e telefone de contato</li>
            <li>Endereço completo do estabelecimento</li>
            <li>Informações de faturamento para processamento do pagamento da assinatura</li>
          </ul>

          <h3 className="text-base font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
            Do Cliente Final (usuário do agendamento)
          </h3>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-600 dark:text-zinc-300">
            <li>Nome completo</li>
            <li>Número de WhatsApp e/ou e-mail</li>
            <li>Modelo e placa do veículo</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            2. Finalidade do Uso dos Dados
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mb-3">
            Os dados coletados são utilizados exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-300">
            <li>Viabilizar o funcionamento da plataforma de agendamentos</li>
            <li>
              Enviar notificações de confirmação, lembrete e atualização via WhatsApp e/ou
              e-mail ao cliente final
            </li>
            <li>Processar o pagamento da assinatura do estabelecimento</li>
            <li>Gerar relatórios e insights de uso para o estabelecimento</li>
            <li>Cumprir obrigações legais e regulatórias</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            3. Compartilhamento de Dados
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong>O NexoCar não vende, aluga ou comercializa dados pessoais.</strong> O
            compartilhamento ocorre apenas com parceiros técnicos estritamente necessários para
            o funcionamento da plataforma:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-300 mt-3">
            <li>
              <strong>Gateway de pagamento</strong> — para processar cobranças de assinatura
              com segurança (dados de cobrança do estabelecimento)
            </li>
            <li>
              <strong>Infraestrutura em nuvem</strong> — para hospedagem segura dos dados
              da plataforma
            </li>
            <li>
              <strong>APIs de notificação</strong> — para envio de mensagens via WhatsApp e
              e-mail aos clientes finais
            </li>
          </ul>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mt-3">
            Todos os parceiros são contratualmente obrigados a tratar os dados com
            confidencialidade e em conformidade com a LGPD.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            4. Segurança
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            Adotamos medidas técnicas e organizacionais para proteger as informações contra
            acesso não autorizado, perda ou alteração indevida, incluindo:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-zinc-600 dark:text-zinc-300 mt-3">
            <li>Criptografia de dados em trânsito (TLS/HTTPS) e em repouso</li>
            <li>Infraestrutura em nuvem com padrões de segurança de nível enterprise</li>
            <li>Controle de acesso por autenticação e autorização baseada em papéis (RBAC)</li>
            <li>Monitoramento contínuo de atividades suspeitas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            5. Direitos do Titular
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mb-3">
            Nos termos da LGPD, você possui os seguintes direitos sobre seus dados pessoais:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-300">
            <li><strong>Acesso:</strong> solicitar a visualização dos dados que armazenamos sobre você</li>
            <li><strong>Correção:</strong> corrigir dados incompletos, inexatos ou desatualizados</li>
            <li><strong>Exclusão:</strong> solicitar a remoção dos seus dados pessoais da plataforma</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
            <li><strong>Revogação do consentimento:</strong> retirar o consentimento para tratamento dos dados</li>
          </ul>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 mt-4">
            Para exercer qualquer um desses direitos, envie um e-mail para{" "}
            <a
              href="mailto:suporte@nexocar.com.br"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              suporte@nexocar.com.br
            </a>{" "}
            com o assunto <em>"Solicitação LGPD"</em>. Responderemos em até 15 dias úteis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            6. Retenção de Dados
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            Os dados são mantidos enquanto a conta estiver ativa. Após o cancelamento, os
            dados são retidos por até 90 dias para fins de auditoria e cumprimento de
            obrigações legais, sendo então excluídos definitivamente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
            7. Contato e Encarregado (DPO)
          </h2>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            Para questões relacionadas à privacidade e proteção de dados, entre em contato com
            nosso time responsável:
          </p>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            <strong>E-mail:</strong>{" "}
            <a
              href="mailto:suporte@nexocar.com.br"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              suporte@nexocar.com.br
            </a>
          </p>
        </section>

      </div>

      <div className="mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          © {new Date().getFullYear()} NexoCar. Todos os direitos reservados.
        </p>
        <div className="flex gap-5">
          <Link href="/termos" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Termos de Uso
          </Link>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Início
          </Link>
        </div>
      </div>
    </main>
  );
}
