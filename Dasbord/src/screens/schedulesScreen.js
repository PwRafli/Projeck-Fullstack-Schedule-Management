/**
 * Dasbord/src/screens/schedulesScreen.js
 * Layar Tabel Master Jadwal Perkuliahan & Kontrol Filter
 * STIKOM PGRI Banyuwangi
 */

export function renderScheduleTableRows(schedules, isAdmin = true) {
  const tbody = document.getElementById("schedule-table-body");
  if (!tbody) return;

  if (schedules.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400">
          <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
          <p class="text-xs">Tidak ada jadwal yang sesuai dengan filter pencarian.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = schedules
    .map((s, index) => `
      <tr class="hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors border-b border-slate-100 dark:border-dark-border">
        <td class="py-3 px-4 text-xs font-mono font-medium text-slate-500">${index + 1}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-xs text-slate-900 dark:text-white">${s.matkul}</div>
          <div class="text-[11px] text-slate-400">${s.jurusan} • Semester ${s.semester}</div>
        </td>
        <td class="py-3 px-4 text-xs text-slate-700 dark:text-slate-300">${s.dosen}</td>
        <td class="py-3 px-4 text-xs font-semibold text-slate-800 dark:text-slate-200">${s.kelas}</td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1 font-semibold text-xs text-slate-700 dark:text-slate-300">
            ${s.hari}, ${s.jamMulai} - ${s.jamSelesai}
          </span>
        </td>
        <td class="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">${s.ruangan}</td>
        <td class="py-3 px-4 text-right">
          ${
            isAdmin
              ? `
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="editSchedule('${s.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-dark-hover" title="Edit">
                  <i data-lucide="edit-3" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteSchedulePrompt('${s.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-dark-hover" title="Hapus">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            `
              : `
              <button onclick="viewScheduleDetail('${s.id}')" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Detail
              </button>
            `
          }
        </td>
      </tr>
    `)
    .join("");

  if (window.lucide) window.lucide.createIcons();
}
