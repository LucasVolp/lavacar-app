"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonFilled, SunFilled } from "@ant-design/icons";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`h-10 w-10 ${className}`} />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 focus:outline-none ${
        theme === "dark"
          ? "bg-[#27272a] text-yellow-400 hover:bg-[#3f3f46] border border-[#3f3f46]"
          : "bg-white text-orange-500 hover:bg-slate-50 shadow-lg shadow-slate-200/50 border border-slate-100"
      } ${className}`}
      aria-label="Toggle Theme"
    >
      <SunFilled
        className={`text-lg transition-all duration-500 absolute ${
          theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <MoonFilled
        className={`text-lg transition-all duration-500 absolute ${
          theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
