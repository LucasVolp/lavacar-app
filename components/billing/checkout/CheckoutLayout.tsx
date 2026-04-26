interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-zinc-50/50 py-8 font-sans antialiased transition-colors duration-300 dark:bg-zinc-950 sm:px-6 sm:py-12 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/8 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[100px]" />
      <div className="relative z-10 px-4 sm:mx-auto sm:w-full sm:max-w-lg">{children}</div>
    </div>
  );
}
