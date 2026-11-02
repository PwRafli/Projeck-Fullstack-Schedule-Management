/**
 * Dasbord/src/screens/conflictScreen.js
 * Layar Deteksi & Analisis Bentrok Jadwal Perkuliahan
 * STIKOM PGRI Banyuwangi
 */

export function renderConflictScreen(conflicts) {
  const container = document.getElementById("conflicts-list-container");
  const countBadge = document.getElementById("conflicts-count-badge");

  if (countBadge) {
    countBadge.innerText = `${conflicts.length} Konflik`;
  }

  if (!container) return;

  if (conflicts.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
        <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="shield-check" class="w-6 h-6"></i>
        </div>
        <h3 class="text-sm font-bold text-emerald-900 dark:text-emerald-200">Tidak Ada Bentrok Jadwal</h3>
        <p class="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
          Seluruh alokasi ruangan, waktu mengajar dosen, dan sesi kelas berjalan optimal tanpa tumpang tindih.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = conflicts
    .map(
      (c) => `
    <div class="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/80 dark:text-rose-300 flex items-center justify-center shrink-0">
          <i data-lucide="alert-triangle" class="w-5 h-5"></i>
        </div>
        <div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
            Bentrok ${c.types}
          </span>
          <h4 class="text-xs font-bold text-slate-900 dark:text-white mt-1">${c.reason}</h4>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">
            ${c.day}: ${c.scheduleA.matkul} (${c.scheduleA.ruangan}) VS ${c.scheduleB.matkul} (${c.scheduleB.ruangan})
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 self-end md:self-center">
        <button onclick="editSchedule('${c.scheduleB.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-dark-card border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50">
          Ubah Jadwal B
        </button>
      </div>
    </div>
  `
    )
    .join("");

  if (window.lucide) window.lucide.createIcons();
}
