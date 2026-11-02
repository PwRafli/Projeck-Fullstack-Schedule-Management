/**
 * Dasbord/src/screens/dashboardScreen.js
 * Layar Utama Dasbor Sistem Manajemen Jadwal Kuliah
 * STIKOM PGRI Banyuwangi
 */

export function renderDashboardOverview(state) {
  const container = document.getElementById("view-dashboard");
  if (!container) return;

  const totalDosen = state.dosen.length;
  const totalMatkul = state.matkul.length;
  const totalRuangan = state.ruangan.length;
  const totalJadwal = state.schedules.length;

  // Perbarui elemen metrik langsung di DOM
  const elDosen = document.getElementById("stat-total-dosen");
  const elMatkul = document.getElementById("stat-total-matkul");
  const elRuang = document.getElementById("stat-total-ruangan");
  const elJadwal = document.getElementById("stat-total-jadwal");

  if (elDosen) elDosen.innerText = totalDosen;
  if (elMatkul) elMatkul.innerText = totalMatkul;
  if (elRuang) elRuang.innerText = totalRuangan;
  if (elJadwal) elJadwal.innerText = totalJadwal;
}

export function renderTodaySchedule(schedules, today = "Senin") {
  const todayContainer = document.getElementById("dashboard-today-list");
  if (!todayContainer) return;

  const todayList = schedules.filter((s) => s.hari === today);

  if (todayList.length === 0) {
    todayContainer.innerHTML = `
      <div class="p-8 text-center text-slate-400">
        <i data-lucide="calendar-x" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
        <p class="text-xs">Tidak ada jadwal perkuliahan untuk hari ${today}.</p>
      </div>
    `;
    return;
  }

  todayContainer.innerHTML = todayList
    .map(
      (s) => `
    <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-dark-border">
      <div class="flex items-center gap-3">
        <div class="w-2.5 h-10 rounded-full bg-brand-500"></div>
        <div>
          <h4 class="text-xs font-bold text-slate-900 dark:text-white">${s.matkul}</h4>
          <p class="text-[11px] text-slate-400">${s.dosen} • Kelas ${s.kelas}</p>
        </div>
      </div>
      <div class="text-right">
        <span class="text-xs font-bold text-brand-600 dark:text-brand-400">${s.jamMulai} - ${s.jamSelesai}</span>
        <span class="block text-[11px] text-slate-400">${s.ruangan}</span>
      </div>
    </div>
  `
    )
    .join("");

  if (window.lucide) window.lucide.createIcons();
}
