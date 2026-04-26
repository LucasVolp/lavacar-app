import { BankOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

interface CheckoutHeaderProps {
  isActive: boolean;
  heading: string | null;
  subtitle: string;
}

export function CheckoutHeader({ isActive, heading, subtitle }: CheckoutHeaderProps) {
  return (
    <div className="mb-8 text-center font-sans antialiased">
      <div className="mb-5 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 shadow-lg shadow-indigo-500/10 dark:border-indigo-800 dark:bg-indigo-900/30">
          {isActive ? (
            <BankOutlined className="text-3xl text-indigo-500" />
          ) : (
            <SafetyCertificateOutlined className="text-3xl text-indigo-500" />
          )}
        </div>
      </div>

      {heading ? (
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">{heading}</h1>
      ) : (
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          Assine o <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">NexoCar</span>
        </h1>
      )}

      <p className="mt-3 text-base leading-relaxed tracking-tight text-zinc-600 dark:text-zinc-300">{subtitle}</p>
    </div>
  );
}
