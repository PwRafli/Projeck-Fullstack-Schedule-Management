/**
 * BeckEnd/views/edit.js
 * Handler untuk pembaruan (update), penghapusan (delete), dan resolusi konflik data.
 */
const db = require("../db");
const { checkScheduleOverlap } = require("./add");

/**
 * Update Jadwal Kuliah
 */
function updateSchedule(id, data) {
  const existing = db.prepare("SELECT * FROM schedules WHERE id = ?").get(id);
  if (!existing) {
    throw new Error(`Jadwal dengan ID ${id} tidak ditemukan.`);
  }

  const matkul_id = data.matkul_id || existing.matkul_id;
  const dosen_id = data.dosen_id || existing.dosen_id;
  const semester = data.semester || existing.semester;
  const kelas = data.kelas || existing.kelas;
  const hari = data.hari || existing.hari;
  const ruangan_id = data.ruangan_id || existing.ruangan_id;
  const jamMulai = data.jamMulai || existing.jamMulai;
  const jamSelesai = data.jamSelesai || existing.jamSelesai;
  const jurusan_id = data.jurusan_id || existing.jurusan_id;

  const semNum = typeof semester === "string" ? parseInt(semester.replace(/\D/g, ""), 10) : semester;

  // Cek potensi bentrok dengan jadwal lain (exclude id sekarang)
  const conflict = checkScheduleOverlap({
    hari,
    ruangan_id,
    dosen_id,
    kelas,
    jamMulai,
    jamSelesai,
    excludeId: id
  });

  const finalStatus = conflict.hasConflict ? "Conflict" : (data.status || existing.status || "Active");

  const stmt = db.prepare(`
    UPDATE schedules SET
      matkul_id = ?,
      dosen_id = ?,
      semester = ?,
      kelas = ?,
      hari = ?,
      ruangan_id = ?,
      jamMulai = ?,
      jamSelesai = ?,
      jurusan_id = ?,
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(
    matkul_id,
    dosen_id,
    semNum,
    kelas,
    hari,
    ruangan_id,
    jamMulai,
    jamSelesai,
    jurusan_id,
    finalStatus,
    id
  );

  return {
    id,
    status: finalStatus,
    conflictWarning: conflict.hasConflict ? conflict.message : null
  };
}

/**
 * Hapus Jadwal Kuliah
 */
function deleteSchedule(id) {
  const stmt = db.prepare("DELETE FROM schedules WHERE id = ?");
  const info = stmt.run(id);
  return { success: info.changes > 0 };
}

/**
 * Update Dosen
 */
function updateDosen(id, data) {
  const { nama, nidn, email, jurusan_id, status } = data;
  const stmt = db.prepare(`
    UPDATE dosen SET
      nama = COALESCE(?, nama),
      nidn = COALESCE(?, nidn),
      email = COALESCE(?, email),
      jurusan_id = COALESCE(?, jurusan_id),
      status = COALESCE(?, status)
    WHERE id = ?
  `);
  stmt.run(nama, nidn, email, jurusan_id, status, id);
  return { success: true, id };
}

/**
 * Hapus Dosen
 */
function deleteDosen(id) {
  const stmt = db.prepare("DELETE FROM dosen WHERE id = ?");
  const info = stmt.run(id);
  return { success: info.changes > 0 };
}

/**
 * Update Matkul
 */
function updateMatkul(id, data) {
  const { kode, nama, sks, semester, jurusan_id, status } = data;
  const semNum = semester ? (typeof semester === "string" ? parseInt(semester.replace(/\D/g, ""), 10) : semester) : null;
  const stmt = db.prepare(`
    UPDATE matkul SET
      kode = COALESCE(?, kode),
      nama = COALESCE(?, nama),
      sks = COALESCE(?, sks),
      semester = COALESCE(?, semester),
      jurusan_id = COALESCE(?, jurusan_id),
      status = COALESCE(?, status)
    WHERE id = ?
  `);
  stmt.run(kode, nama, sks, semNum, jurusan_id, status, id);
  return { success: true, id };
}

/**
 * Hapus Matkul
 */
function deleteMatkul(id) {
  const stmt = db.prepare("DELETE FROM matkul WHERE id = ?");
  const info = stmt.run(id);
  return { success: info.changes > 0 };
}

/**
 * Update Ruangan
 */
function updateRuangan(id, data) {
  const { nama, tipe, kapasitas, status } = data;
  const stmt = db.prepare(`
    UPDATE ruangan SET
      nama = COALESCE(?, nama),
      tipe = COALESCE(?, tipe),
      kapasitas = COALESCE(?, kapasitas),
      status = COALESCE(?, status)
    WHERE id = ?
  `);
  stmt.run(nama, tipe, kapasitas, status, id);
  return { success: true, id };
}

/**
 * Hapus Ruangan
 */
function deleteRuangan(id) {
  const stmt = db.prepare("DELETE FROM ruangan WHERE id = ?");
  const info = stmt.run(id);
  return { success: info.changes > 0 };
}

/**
 * Update Jurusan
 */
function updateJurusan(id, data) {
  const { nama, kode, status } = data;
  const stmt = db.prepare(`
    UPDATE jurusan SET
      nama = COALESCE(?, nama),
      kode = COALESCE(?, kode),
      status = COALESCE(?, status)
    WHERE id = ?
  `);
  stmt.run(nama, kode, status, id);
  return { success: true, id };
}

/**
 * Hapus Jurusan
 */
function deleteJurusan(id) {
  const stmt = db.prepare("DELETE FROM jurusan WHERE id = ?");
  const info = stmt.run(id);
  return { success: info.changes > 0 };
}

/**
 * Fitur Resolusi Otomatis Konflik Jadwal:
 * Menggeser waktu atau memindahkan ruangan yang kosong
 */
function autoResolveConflict(scheduleId) {
  const target = db.prepare("SELECT * FROM schedules WHERE id = ?").get(scheduleId);
  if (!target) throw new Error("Jadwal tidak ditemukan.");

  // Cari alternatif ruangan atau geser jam ke sesi siang
  const altRooms = db.prepare("SELECT * FROM ruangan WHERE id != ? AND status = 'Active'").all(target.ruangan_id);
  
  let resolvedRoomId = target.ruangan_id;
  let newStart = target.jamMulai;
  let newEnd = target.jamSelesai;

  for (const r of altRooms) {
    const check = checkScheduleOverlap({
      hari: target.hari,
      ruangan_id: r.id,
      dosen_id: target.dosen_id,
      kelas: target.kelas,
      jamMulai: newStart,
      jamSelesai: newEnd,
      excludeId: target.id
    });
    if (!check.hasConflict) {
      resolvedRoomId = r.id;
      break;
    }
  }

  // Jika tetap bentrok, geser ke slot siang 13:00 - 15:00
  if (resolvedRoomId === target.ruangan_id) {
    newStart = "13:00";
    newEnd = "15:00";
  }

  db.prepare(`
    UPDATE schedules SET
      ruangan_id = ?,
      jamMulai = ?,
      jamSelesai = ?,
      status = 'Active',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(resolvedRoomId, newStart, newEnd, target.id);

  return { success: true, newRoomId: resolvedRoomId, newStart, newEnd };
}

module.exports = {
  updateSchedule,
  deleteSchedule,
  updateDosen,
  deleteDosen,
  updateMatkul,
  deleteMatkul,
  updateRuangan,
  deleteRuangan,
  updateJurusan,
  deleteJurusan,
  autoResolveConflict
};
