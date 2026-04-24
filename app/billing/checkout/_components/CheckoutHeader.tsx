import { BankOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

interface CheckoutHeaderProps {
    isActive: boolean;
    heading: string | null;
    subtitle: string;
}

export function CheckoutHeader({ isActive, heading, subtitle }: CheckoutHeaderProps) {
    return (
        <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                    {isActive
                        ? <BankOutlined className="text-3xl text-indigo-500" />
                        : <SafetyCertificateOutlined className="text-3xl text-indigo-500" />
                    }
                </div>
            </div>

            {heading ? (
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                    {heading}
                </h1>
            ) : (
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                    Assine o{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                        NexoCar
                    </span>
                </h1>
            )}

            <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
}
