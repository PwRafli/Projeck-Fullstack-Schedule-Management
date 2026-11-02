/**
 * Dasbord/src/screens/reportScreen.js
 * Layar Laporan Statistik & Pratinjau Cetak Jadwal
 * STIKOM PGRI Banyuwangi
 */

export function renderReportsView(schedules) {
  const containerLec = document.getElementById("report-lecturers-list");
  const containerDays = document.getElementById("report-days-list");

  if (!containerLec || !containerDays) return;

  // Beban mengajar per dosen
  const lecMap = {};
  schedules.forEach((s) => {
    lecMap[s.dosen] = (lecMap[s.dosen] || 0) + 1;
  });

  containerLec.innerHTML = Object.entries(lecMap)
    .map(
      ([dosen, count]) => `
    <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-dark-border">
      <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${dosen}</span>
      <span class="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950 font-bold text-xs">${count} Mata Kuliah</span>
    </div>
  `
    )
    .join("");

  // Utilisasi hari perkuliahan
  const dayMap = { Senin: 0, Selasa: 0, Rabu: 0, Kamis: 0, Jumat: 0, Sabtu: 0 };
  schedules.forEach((s) => {
    if (dayMap[s.hari] !== undefined) dayMap[s.hari]++;
  });

  containerDays.innerHTML = Object.entries(dayMap)
    .map(
      ([day, count]) => `
    <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-dark-border">
      <span class="font-bold text-xs text-slate-800 dark:text-slate-200">${day}</span>
      <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 font-bold text-xs">${count} Sesi Kelas</span>
    </div>
  `
    )
    .join("");
}

export function printScheduleReport() {
  window.print();
}
