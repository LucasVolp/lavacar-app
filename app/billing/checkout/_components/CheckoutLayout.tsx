interface CheckoutLayoutProps {
    children: React.ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-500/8 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
                {children}
            </div>
        </div>
    );
}
