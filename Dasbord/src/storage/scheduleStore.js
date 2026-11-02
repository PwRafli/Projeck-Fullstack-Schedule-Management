/**
 * Dasbord/src/storage/scheduleStore.js
 * State Store & Algoritma Pendeteksi Bentrok Jadwal
 * STIKOM PGRI Banyuwangi
 */

export const store = {
  state: {
    role: "admin", // 'admin' | 'mahasiswa'
    userType: "lecturer", // 'student' | 'lecturer' | 'admin'
    activeView: "dashboard",
    isSidebarCollapsed: false,
    selectedSemesterFilter: null,
    todayDay: "Senin",
    roleScheduleFilter: "teaching", // 'all' | 'personal' | 'teaching'
    
    // Master collections
    jurusan: [],
    dosen: [],
    matkul: [],
    ruangan: [],
    schedules: [],
    notifications: []
  }
};

/**
 * Memeriksa apakah dua rentang waktu perkuliahan bertabrakan
 */
export function isTimeOverlap(startA, endA, startB, endB) {
  const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const aStart = toMinutes(startA);
  const aEnd = toMinutes(endA);
  const bStart = toMinutes(startB);
  const bEnd = toMinutes(endB);

  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

/**
 * Mendeteksi seluruh potensi konflik pada koleksi jadwal aktif
 */
export function detectAllScheduleConflicts(schedules = store.state.schedules) {
  const conflicts = [];
  const len = schedules.length;

  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const a = schedules[i];
      const b = schedules[j];

      if (a.hari === b.hari) {
        if (isTimeOverlap(a.jamMulai, a.jamSelesai, b.jamMulai, b.jamSelesai)) {
          const reasons = [];
          const types = [];

          if (a.ruangan === b.ruangan) {
            reasons.push(`Ruangan ${a.ruangan} digunakan bersamaan`);
            types.push("Ruangan");
          }
          if (a.dosen === b.dosen) {
            reasons.push(`Dosen ${a.dosen} dijadwalkan mengajar bersamaan`);
            types.push("Dosen");
          }
          if (a.kelas === b.kelas && a.kelas) {
            reasons.push(`Kelas ${a.kelas} memiliki jadwal ganda`);
            types.push("Kelas");
          }

          if (reasons.length > 0) {
            conflicts.push({
              scheduleA: a,
              scheduleB: b,
              reason: reasons.join(" & "),
              types: types.join(", "),
              day: a.hari,
              timeA: `${a.jamMulai} - ${a.jamSelesai}`,
              timeB: `${b.jamMulai} - ${b.jamSelesai}`
            });
          }
        }
      }
    }
  }

  return conflicts;
}
