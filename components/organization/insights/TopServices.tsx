"use client";

import React from "react";

export const TopServices = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl h-full shadow-sm dark:shadow-none">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
        Serviços Mais Populares
      </h3>
      <div className="space-y-5">
        {[
          { name: "Lavagem Completa", count: 450, percent: "75%" },
          { name: "Polimento", count: 120, percent: "45%" },
          { name: "Higienização", count: 85, percent: "30%" },
          { name: "Enceramento", count: 60, percent: "15%" },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.name}</span>
              <span className="text-zinc-500">{item.count}</span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: item.percent }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
