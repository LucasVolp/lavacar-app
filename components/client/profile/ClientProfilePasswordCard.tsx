"use client";

import React from "react";
import { Alert, Button, Card } from "antd";
import { LockOutlined, MailOutlined, CheckCircleFilled } from "@ant-design/icons";

interface ClientProfilePasswordCardProps {
  userEmail: string | undefined;
  isGoogleLogin?: boolean;
  isSending: boolean;
  hasRequested: boolean;
  errorMessage?: string | null;
  onRequestReset: () => void;
  onDismissError?: () => void;
}

export const ClientProfilePasswordCard: React.FC<ClientProfilePasswordCardProps> = ({
  userEmail,
  isGoogleLogin,
  isSending,
  hasRequested,
  errorMessage,
  onRequestReset,
  onDismissError,
}) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2 font-semibold">
          <LockOutlined className="text-amber-500" />
          <span>Alteração de Senha</span>
        </div>
      }
      className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
    >
      <div className="space-y-5">
        {isGoogleLogin && (
          <Alert
            message="Conta conectada ao Google"
            description={
              <span>
                Para alterar a senha da sua conta Google, acesse{" "}
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline"
                >
                  myaccount.google.com/security
                </a>
                . Se preferir definir uma senha própria no NexoCar, siga o fluxo abaixo.
              </span>
            }
            type="info"
            showIcon
            className="rounded-xl"
          />
        )}

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            showIcon
            closable
            onClose={onDismissError}
            className="rounded-xl border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50"
          />
        )}

        {hasRequested ? (
          <RequestedState email={userEmail} />
        ) : (
          <ExplanationBlock email={userEmail} />
        )}

        <div className="flex justify-end pt-1">
          <Button
            type="primary"
            size="large"
            icon={<MailOutlined />}
            loading={isSending}
            onClick={onRequestReset}
            disabled={!userEmail}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 border-none shadow-md shadow-amber-500/20"
          >
            {hasRequested ? "Reenviar link" : "Enviar link de redefinição"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ExplanationBlock: React.FC<{ email?: string }> = ({ email }) => (
  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 leading-[1.7]">
    <p className="text-sm text-zinc-700 dark:text-zinc-300">
      Por segurança, enviaremos um link único para o e-mail cadastrado. Use o link para criar uma nova senha — ele é válido por <strong>60 minutos</strong>.
    </p>
    {email && (
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-2 flex-wrap">
        <MailOutlined />
        <span className="break-all font-medium text-zinc-700 dark:text-zinc-200">{email}</span>
      </p>
    )}
  </div>
);

const RequestedState: React.FC<{ email?: string }> = ({ email }) => (
  <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 flex items-start gap-3 leading-[1.7]">
    <CheckCircleFilled className="text-emerald-500 text-xl mt-0.5" />
    <div>
      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-1">
        Link enviado
      </p>
      <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80">
        Enviamos um link de redefinição para{" "}
        <strong className="break-all">{email ?? "seu e-mail"}</strong>. Abra a mensagem e clique no link para criar sua nova senha. Lembre-se de verificar a caixa de spam.
      </p>
    </div>
  </div>
);
