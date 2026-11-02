/**
 * BeckEnd/views/add.js
 * Handler untuk penambahan data baru (Jadwal, Dosen, Matkul, Ruangan, Jurusan)
 * Dilengkapi dengan validasi pendeteksian bentrok jadwal (Conflict Detection).
 */
const db = require("../db");

/**
 * Konversi string waktu format "HH:mm" ke total menit
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

/**
 * Pengecekan bentrok jadwal sebelum disimpan
 */
function checkScheduleOverlap({ hari, ruangan_id, dosen_id, kelas, jamMulai, jamSelesai, excludeId = null }) {
  const newStart = timeToMinutes(jamMulai);
  const newEnd = timeToMinutes(jamSelesai);

  let query = `
    SELECT 
      s.id,
      s.kode,
      s.hari,
      s.jamMulai,
      s.jamSelesai,
      s.ruangan_id,
      r.nama AS ruangan,
      s.dosen_id,
      d.nama AS dosen,
      s.kelas
    FROM schedules s
    LEFT JOIN ruangan r ON s.ruangan_id = r.id
    LEFT JOIN dosen d ON s.dosen_id = d.id
    WHERE s.hari = ?
  `;
  const params = [hari];

  if (excludeId) {
    query += " AND s.id != ?";
    params.push(excludeId);
  }

  const existing = db.prepare(query).all(...params);

  for (const s of existing) {
    const sStart = timeToMinutes(s.jamMulai);
    const sEnd = timeToMinutes(s.jamSelesai);

    // Cek apakah ada irisan rentang waktu
    const isOverlap = newStart < sEnd && newEnd > sStart;
    if (isOverlap) {
      if (Number(s.ruangan_id) === Number(ruangan_id)) {
        return {
          hasConflict: true,
          type: "Ruangan",
          message: `Ruangan ${s.ruangan} sudah digunakan pada hari ${hari} (${s.jamMulai} - ${s.jamSelesai})`
        };
      }
      if (Number(s.dosen_id) === Number(dosen_id)) {
        return {
          hasConflict: true,
          type: "Dosen",
          message: `Dosen ${s.dosen} sudah memiliki jadwal mengajar pada hari ${hari} (${s.jamMulai} - ${s.jamSelesai})`
        };
      }
      if (s.kelas && kelas && s.kelas.trim().toLowerCase() === kelas.trim().toLowerCase()) {
        return {
          hasConflict: true,
          type: "Kelas",
          message: `Kelas ${kelas} sudah memiliki sesi perkuliahan pada waktu yang sama (${s.jamMulai} - ${s.jamSelesai})`
        };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Menambahkan Jadwal Kuliah Baru
 */
function createSchedule(data) {
  const {
    matkul_id,
    dosen_id,
    semester,
    kelas,
    hari,
    ruangan_id,
    jamMulai,
    jamSelesai,
    jurusan_id,
    status = "Active"
  } = data;

  if (!matkul_id || !dosen_id || !semester || !kelas || !hari || !ruangan_id || !jamMulai || !jamSelesai) {
    throw new Error("Semua field wajib diisi lengkap.");
  }

  // Generate kode unik jika tidak disediakan
  const count = db.prepare("SELECT COUNT(*) AS count FROM schedules").get().count;
  const kode = data.kode || `SCH-${count + 1}`;

  // Cek potensi bentrok
  const conflict = checkScheduleOverlap({ hari, ruangan_id, dosen_id, kelas, jamMulai, jamSelesai });
  const finalStatus = conflict.hasConflict ? "Conflict" : (status || "Active");

  const semNum = typeof semester === "string" ? parseInt(semester.replace(/\D/g, ""), 10) : semester;

  const stmt = db.prepare(`
    INSERT INTO schedules (
      kode, matkul_id, dosen_id, semester, kelas, hari, ruangan_id, jamMulai, jamSelesai, jurusan_id, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    kode,
    matkul_id,
    dosen_id,
    semNum,
    kelas,
    hari,
    ruangan_id,
    jamMulai,
    jamSelesai,
    jurusan_id || null,
    finalStatus
  );

  return {
    id: info.lastInsertRowid,
    kode,
    status: finalStatus,
    conflictWarning: conflict.hasConflict ? conflict.message : null
  };
}

/**
 * Menambahkan Dosen Baru
 */
function createDosen(data) {
  const { nama, nidn, email, jurusan_id, status = "Active" } = data;
  if (!nama || !nidn) {
    throw new Error("Nama dan NIDN dosen wajib diisi.");
  }

  const stmt = db.prepare(`
    INSERT INTO dosen (nama, nidn, email, jurusan_id, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(nama, nidn, email || null, jurusan_id || null, status);
  return { id: info.lastInsertRowid, nama, nidn };
}

/**
 * Menambahkan Mata Kuliah Baru
 */
function createMatkul(data) {
  const { kode, nama, sks = 3, semester = 1, jurusan_id, status = "Active" } = data;
  if (!kode || !nama) {
    throw new Error("Kode dan nama mata kuliah wajib diisi.");
  }

  const semNum = typeof semester === "string" ? parseInt(semester.replace(/\D/g, ""), 10) : semester;

  const stmt = db.prepare(`
    INSERT INTO matkul (kode, nama, sks, semester, jurusan_id, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(kode, nama, sks, semNum, jurusan_id || null, status);
  return { id: info.lastInsertRowid, kode, nama };
}

/**
 * Menambahkan Ruangan Baru
 */
function createRuangan(data) {
  const { nama, tipe = "Ruang Kelas", kapasitas = 40, status = "Active" } = data;
  if (!nama) {
    throw new Error("Nama ruangan wajib diisi.");
  }

  const stmt = db.prepare(`
    INSERT INTO ruangan (nama, tipe, kapasitas, status)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(nama, tipe, kapasitas, status);
  return { id: info.lastInsertRowid, nama };
}

/**
 * Menambahkan Jurusan / Program Studi Baru
 */
function createJurusan(data) {
  const { nama, kode, status = "Active" } = data;
  if (!nama) {
    throw new Error("Nama jurusan wajib diisi.");
  }

  const stmt = db.prepare(`
    INSERT INTO jurusan (nama, kode, status)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(nama, kode || null, status);
  return { id: info.lastInsertRowid, nama, kode };
}

module.exports = {
  checkScheduleOverlap,
  createSchedule,
  createDosen,
  createMatkul,
  createRuangan,
  createJurusan
};
