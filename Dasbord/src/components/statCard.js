/**
 * Dasbord/src/components/statCard.js
 * Komponen Metrik Kartu Statistik (KPI Card)
 * STIKOM PGRI Banyuwangi
 */

export function renderStatCard({ title, value, subtitle, icon, trend, colorScheme = "blue" }) {
  return `
    <div class="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm flex flex-col justify-between">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">${title}</span>
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-${colorScheme}-50 text-${colorScheme}-600 dark:bg-${colorScheme}-950/60 dark:text-${colorScheme}-400">
          <i data-lucide="${icon}" class="w-4 h-4"></i>
        </div>
      </div>
      <div>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${value}</h3>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">${subtitle}</p>
      </div>
      ${
        trend
          ? `<div class="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border flex items-center gap-1.5 text-[11px] text-${colorScheme}-600 dark:text-${colorScheme}-400 font-bold">
              <span>${trend}</span>
            </div>`
          : ""
      }
    </div>
  `;
}
