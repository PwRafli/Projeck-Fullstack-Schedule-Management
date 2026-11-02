/**
 * Seed script for SQLite database
 * Populates master tables with initial data matching project_schedule_management_dashboard.html
 */
const db = require("./db");

function seedDatabase() {
  console.log("Memulai inisialisasi / seeding database...");

  // 1. Seed Jurusan
  const checkJurusan = db.prepare("SELECT COUNT(*) AS count FROM jurusan").get();
  if (checkJurusan.count === 0) {
    const insertJurusan = db.prepare(
      "INSERT INTO jurusan (nama, kode, status) VALUES (?, ?, ?)"
    );
    const jurusans = [
      ["Teknik Informatika", "TI", "Active"],
      ["Sistem Informasi", "SI", "Active"],
      ["Teknik Komputer", "TK", "Active"],
      ["Teknologi Informasi", "TIF", "Active"]
    ];
    for (const [nama, kode, status] of jurusans) {
      insertJurusan.run(nama, kode, status);
    }
    console.log("✓ Jurusan berhasil diisi (4 prodi).");
  }

  // 2. Seed Dosen
  const checkDosen = db.prepare("SELECT COUNT(*) AS count FROM dosen").get();
  if (checkDosen.count === 0) {
    const insertDosen = db.prepare(
      "INSERT INTO dosen (nama, nidn, email, jurusan_id, status) VALUES (?, ?, ?, ?, ?)"
    );
    const dosens = [
      ["Dr. Ir. Hendra Saputra, M.T.", "0412088501", "hendra.s@kampus.ac.id", 1, "Active"],
      ["Siti Rahmawati, S.Kom., M.Cs.", "0420059002", "siti.r@kampus.ac.id", 1, "Active"],
      ["Budi Santoso, M.Kom.", "0405108203", "budi.s@kampus.ac.id", 2, "Active"],
      ["Prof. Dr. Agus Prasetyo, M.Sc.", "0415037901", "agus.p@kampus.ac.id", 1, "Active"],
      ["Dewi Lestari, S.T., M.T.", "0422118804", "dewi.l@kampus.ac.id", 3, "Active"],
      ["Fajar Nugraha, M.Kom.", "0419078702", "fajar.n@kampus.ac.id", 4, "Active"]
    ];
    for (const [nama, nidn, email, jId, status] of dosens) {
      insertDosen.run(nama, nidn, email, jId, status);
    }
    console.log("✓ Dosen berhasil diisi (6 dosen pengampu).");
  }

  // 3. Seed Matkul
  const checkMatkul = db.prepare("SELECT COUNT(*) AS count FROM matkul").get();
  if (checkMatkul.count === 0) {
    const insertMatkul = db.prepare(
      "INSERT INTO matkul (kode, nama, sks, semester, jurusan_id, status) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const matkuls = [
      ["IF101", "Algoritma & Pemrograman", 3, 1, 1, "Active"],
      ["IF102", "Matematika Diskrit", 3, 1, 1, "Active"],
      ["IF103", "Dasar Pemrograman Web", 2, 1, 1, "Active"],
      ["IF201", "Struktur Data & Algoritma", 4, 2, 1, "Active"],
      ["IF202", "Sistem Basis Data Terdistribusi", 3, 2, 1, "Active"],
      ["IF301", "Pemrograman Web Lanjut", 3, 3, 1, "Active"],
      ["IF302", "Rekayasa Perangkat Lunak", 3, 3, 1, "Active"],
      ["IF401", "Jaringan Komputer & Cyber Security", 4, 4, 3, "Active"],
      ["IF501", "Kecerdasan Buatan & Machine Learning", 3, 5, 1, "Active"],
      ["IF601", "Cloud Computing Architecture", 3, 6, 4, "Active"],
      ["IF701", "Metodologi Penelitian & Pra-Skripsi", 2, 7, 1, "Active"]
    ];
    for (const [kode, nama, sks, smt, jId, status] of matkuls) {
      insertMatkul.run(kode, nama, sks, smt, jId, status);
    }
    console.log("✓ Matkul berhasil diisi (11 mata kuliah S1–S7).");
  }

  // 4. Seed Ruangan
  const checkRuangan = db.prepare("SELECT COUNT(*) AS count FROM ruangan").get();
  if (checkRuangan.count === 0) {
    const insertRuangan = db.prepare(
      "INSERT INTO ruangan (nama, tipe, kapasitas, status) VALUES (?, ?, ?, ?)"
    );
    const ruangans = [
      ["Ruang Teori 101", "Ruang Kelas", 45, "Active"],
      ["Ruang Teori 102", "Ruang Kelas", 45, "Active"],
      ["Lab Komputer 1", "Lab Komputer", 35, "Active"],
      ["Lab Komputer 2", "Lab Komputer", 35, "Active"],
      ["Lab Jaringan & IoT", "Lab Jaringan", 30, "Active"],
      ["Lab Multimedia & Game", "Lab Multimedia", 30, "Active"]
    ];
    for (const [nama, tipe, kap, status] of ruangans) {
      insertRuangan.run(nama, tipe, kap, status);
    }
    console.log("✓ Ruangan berhasil diisi (6 ruangan/lab).");
  }

  // 5. Seed Schedules
  const checkSchedules = db.prepare("SELECT COUNT(*) AS count FROM schedules").get();
  if (checkSchedules.count === 0) {
    const insertSchedule = db.prepare(`
      INSERT INTO schedules (
        kode, matkul_id, dosen_id, semester, kelas, hari, ruangan_id, jamMulai, jamSelesai, jurusan_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const schedules = [
      ["SCH-1", 6, 2, 3, "TI-3A", "Senin", 3, "08:00", "10:30", 1, "Active"],
      ["SCH-2", 4, 1, 2, "TI-2B", "Senin", 4, "08:00", "10:00", 1, "Active"],
      ["SCH-3", 1, 1, 1, "TI-1A", "Senin", 1, "10:30", "12:30", 1, "Active"],
      ["SCH-4", 3, 6, 1, "TI-1C", "Senin", 3, "09:00", "11:00", 4, "Conflict"],
      ["SCH-5", 7, 3, 3, "SI-3A", "Selasa", 2, "08:00", "10:30", 2, "Active"],
      ["SCH-6", 8, 5, 4, "TK-4A", "Selasa", 5, "10:00", "12:30", 3, "Active"],
      ["SCH-7", 9, 4, 5, "TI-5A", "Rabu", 4, "08:30", "11:00", 1, "Active"],
      ["SCH-8", 10, 6, 6, "TI-6A", "Kamis", 6, "13:00", "15:30", 4, "Active"],
      ["SCH-9", 11, 1, 7, "TI-7A", "Jumat", 1, "09:00", "11:00", 1, "Active"]
    ];

    for (const row of schedules) {
      insertSchedule.run(...row);
    }
    console.log("✓ Jadwal kuliah berhasil diisi (9 alokasi jadwal dengan 1 konflik real-time).");
  }

  console.log("Seeding database selesai secara menyeluruh.");
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
