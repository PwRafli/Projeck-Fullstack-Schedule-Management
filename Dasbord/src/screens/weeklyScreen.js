/**
 * Dasbord/src/screens/weeklyScreen.js
 * Layar Matriks Mingguan (Weekly Timetable Matrix Grid)
 * STIKOM PGRI Banyuwangi
 */

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const TIME_SLOTS = [
  "08:00 - 09:40",
  "10:00 - 11:40",
  "13:00 - 14:40",
  "15:00 - 16:40"
];

export function renderWeeklyMatrix(schedules) {
  const container = document.getElementById("weekly-grid-container");
  if (!container) return;

  const html = `
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-slate-200 dark:border-dark-border text-xs">
        <thead>
          <tr class="bg-slate-100 dark:bg-slate-800">
            <th class="p-3 border border-slate-200 dark:border-dark-border text-left w-32">Waktu Sesi</th>
            ${DAYS.map(
              (d) =>
                `<th class="p-3 border border-slate-200 dark:border-dark-border text-center font-bold">${d}</th>`
            ).join("")}
          </tr>
        </thead>
        <tbody>
          ${TIME_SLOTS.map(
            (slot) => `
            <tr>
              <td class="p-2.5 font-bold border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300">
                ${slot}
              </td>
              ${DAYS.map((day) => {
                const match = schedules.find((s) => s.hari === day && slot.startsWith(s.jamMulai));
                if (match) {
                  return `
                    <td class="p-2 border border-slate-200 dark:border-dark-border bg-brand-50/50 dark:bg-brand-950/30">
                      <div class="p-2 rounded-xl bg-white dark:bg-dark-card border border-brand-200 dark:border-brand-900/60 shadow-sm">
                        <span class="font-bold text-slate-900 dark:text-white block truncate">${match.matkul}</span>
                        <span class="text-[10px] text-slate-400 block">${match.dosen}</span>
                        <span class="text-[10px] text-brand-600 dark:text-brand-400 font-semibold block">${match.ruangan} • Kelas ${match.kelas}</span>
                      </div>
                    </td>
                  `;
                }
                return `<td class="p-2 border border-slate-200 dark:border-dark-border text-center text-slate-300 dark:text-slate-700">-</td>`;
              }).join("")}
            </tr>
          `
          ).join("")}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}
