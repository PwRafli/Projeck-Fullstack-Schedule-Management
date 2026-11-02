/**
 * BeckEnd/views/index.js
 * Handler untuk menampilkan ringkasan data dashboard, jadwal, dan master data.
 */
const db = require("../db");

/**
 * Mengambil ringkasan statistik untuk dashboard utama
 */
function getDashboardSummary() {
  const totalSchedules = db.prepare("SELECT COUNT(*) AS count FROM schedules").get().count;
  const activeDosen = db.prepare("SELECT COUNT(*) AS count FROM dosen WHERE status = 'Active'").get().count;
  const availableRuangan = db.prepare("SELECT COUNT(*) AS count FROM ruangan WHERE status = 'Active'").get().count;
  const conflictCount = db.prepare("SELECT COUNT(*) AS count FROM schedules WHERE status = 'Conflict'").get().count;

  const today = "Senin";
  const todaySchedules = db.prepare(`
    SELECT 
      s.id,
      s.kode,
      m.nama AS matkul,
      d.nama AS dosen,
      ('S' || s.semester) AS semester,
      j.nama AS jurusan,
      s.kelas,
      s.hari,
      s.jamMulai,
      s.jamSelesai,
      r.nama AS ruangan,
      s.status
    FROM schedules s
    LEFT JOIN matkul m ON s.matkul_id = m.id
    LEFT JOIN dosen d ON s.dosen_id = d.id
    LEFT JOIN ruangan r ON s.ruangan_id = r.id
    LEFT JOIN jurusan j ON s.jurusan_id = j.id
    WHERE s.hari = ?
    ORDER BY s.jamMulai ASC
  `).all(today);

  return {
    totalSchedules,
    activeDosen,
    availableRuangan,
    conflictCount,
    today,
    todaySchedules
  };
}

/**
 * Mengambil daftar seluruh jadwal kuliah dengan relasi dan filter opsional
 */
function getAllSchedules(filters = {}) {
  let query = `
    SELECT 
      s.id,
      s.kode,
      s.matkul_id,
      m.nama AS matkul,
      m.kode AS matkul_kode,
      m.sks,
      s.dosen_id,
      d.nama AS dosen,
      ('S' || s.semester) AS semester,
      s.semester AS semester_num,
      s.jurusan_id,
      j.nama AS jurusan,
      s.kelas,
      s.hari,
      s.jamMulai,
      s.jamSelesai,
      s.ruangan_id,
      r.nama AS ruangan,
      r.tipe AS ruangan_tipe,
      s.status
    FROM schedules s
    LEFT JOIN matkul m ON s.matkul_id = m.id
    LEFT JOIN dosen d ON s.dosen_id = d.id
    LEFT JOIN ruangan r ON s.ruangan_id = r.id
    LEFT JOIN jurusan j ON s.jurusan_id = j.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.semester) {
    const semNum = parseInt(filters.semester.replace(/\D/g, ""), 10);
    if (semNum) {
      query += " AND s.semester = ?";
      params.push(semNum);
    }
  }

  if (filters.hari) {
    query += " AND s.hari = ?";
    params.push(filters.hari);
  }

  if (filters.dosen_id) {
    query += " AND s.dosen_id = ?";
    params.push(filters.dosen_id);
  }

  if (filters.ruangan_id) {
    query += " AND s.ruangan_id = ?";
    params.push(filters.ruangan_id);
  }

  if (filters.jurusan_id) {
    query += " AND s.jurusan_id = ?";
    params.push(filters.jurusan_id);
  }

  if (filters.search) {
    query += " AND (m.nama LIKE ? OR d.nama LIKE ? OR r.nama LIKE ? OR s.kelas LIKE ?)";
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  query += " ORDER BY CASE s.hari WHEN 'Senin' THEN 1 WHEN 'Selasa' THEN 2 WHEN 'Rabu' THEN 3 WHEN 'Kamis' THEN 4 WHEN 'Jumat' THEN 5 WHEN 'Sabtu' THEN 6 ELSE 7 END, s.jamMulai ASC";

  return db.prepare(query).all(...params);
}

/**
 * Mengambil jadwal yang dikelompokkan per hari untuk tampilan matriks mingguan
 */
function getWeeklyTimetable() {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const matrix = {};

  for (const day of days) {
    matrix[day] = getAllSchedules({ hari: day });
  }

  return matrix;
}

/**
 * Mengambil daftar master Dosen
 */
function getAllDosen(search = "") {
  if (search) {
    return db.prepare(`
      SELECT d.*, j.nama AS jurusan 
      FROM dosen d 
      LEFT JOIN jurusan j ON d.jurusan_id = j.id 
      WHERE d.nama LIKE ? OR d.nidn LIKE ?
      ORDER BY d.nama ASC
    `).all(`%${search}%`, `%${search}%`);
  }
  return db.prepare(`
    SELECT d.*, j.nama AS jurusan 
    FROM dosen d 
    LEFT JOIN jurusan j ON d.jurusan_id = j.id 
    ORDER BY d.nama ASC
  `).all();
}

/**
 * Mengambil daftar master Mata Kuliah
 */
function getAllMatkul(search = "") {
  if (search) {
    return db.prepare(`
      SELECT m.*, ('S' || m.semester) AS semester_label, j.nama AS jurusan 
      FROM matkul m 
      LEFT JOIN jurusan j ON m.jurusan_id = j.id 
      WHERE m.nama LIKE ? OR m.kode LIKE ?
      ORDER BY m.semester ASC, m.nama ASC
    `).all(`%${search}%`, `%${search}%`);
  }
  return db.prepare(`
    SELECT m.*, ('S' || m.semester) AS semester_label, j.nama AS jurusan 
    FROM matkul m 
    LEFT JOIN jurusan j ON m.jurusan_id = j.id 
    ORDER BY m.semester ASC, m.nama ASC
  `).all();
}

/**
 * Mengambil daftar master Ruangan
 */
function getAllRuangan(search = "") {
  if (search) {
    return db.prepare("SELECT * FROM ruangan WHERE nama LIKE ? ORDER BY nama ASC").all(`%${search}%`);
  }
  return db.prepare("SELECT * FROM ruangan ORDER BY nama ASC").all();
}

/**
 * Mengambil daftar master Jurusan
 */
function getAllJurusan() {
  return db.prepare("SELECT * FROM jurusan ORDER BY nama ASC").all();
}

module.exports = {
  getDashboardSummary,
  getAllSchedules,
  getWeeklyTimetable,
  getAllDosen,
  getAllMatkul,
  getAllRuangan,
  getAllJurusan
};
