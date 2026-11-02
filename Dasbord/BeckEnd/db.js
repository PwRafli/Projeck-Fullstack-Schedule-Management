
const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const databasePath = path.resolve(
    __dirname,
    process.env.DATABASE_PATH || "../database/database.sqlite"
);

// Pastikan folder database tersedia.
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

// Membuka atau membuat database SQLite.
const db = new Database(databasePath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

// Membuat tabel master dan jadwal.
db.exec(`
  CREATE TABLE IF NOT EXISTS jurusan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL UNIQUE,
    kode TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS dosen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    nidn TEXT NOT NULL UNIQUE,
    email TEXT,
    jurusan_id INTEGER,
    status TEXT NOT NULL DEFAULT 'Active',
    FOREIGN KEY (jurusan_id)
      REFERENCES jurusan(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS matkul (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kode TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    sks INTEGER NOT NULL DEFAULT 2
      CHECK (sks BETWEEN 1 AND 8),
    semester INTEGER NOT NULL
      CHECK (semester BETWEEN 1 AND 7),
    jurusan_id INTEGER,
    status TEXT NOT NULL DEFAULT 'Active',
    FOREIGN KEY (jurusan_id)
      REFERENCES jurusan(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS ruangan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL UNIQUE,
    tipe TEXT NOT NULL DEFAULT 'Kelas',
    kapasitas INTEGER NOT NULL DEFAULT 30
      CHECK (kapasitas > 0),
    status TEXT NOT NULL DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kode TEXT UNIQUE,
    matkul_id INTEGER NOT NULL,
    dosen_id INTEGER NOT NULL,
    semester INTEGER NOT NULL
      CHECK (semester BETWEEN 1 AND 7),
    kelas TEXT NOT NULL,
    hari TEXT NOT NULL CHECK (
      hari IN (
        'Senin', 'Selasa', 'Rabu',
        'Kamis', 'Jumat', 'Sabtu'
      )
    ),
    ruangan_id INTEGER NOT NULL,
    jamMulai TEXT NOT NULL,
    jamSelesai TEXT NOT NULL,
    jurusan_id INTEGER,
    status TEXT NOT NULL DEFAULT 'Active'
      CHECK (status IN ('Active', 'Conflict', 'Cancelled')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CHECK (jamMulai < jamSelesai),

    FOREIGN KEY (matkul_id)
      REFERENCES matkul(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (dosen_id)
      REFERENCES dosen(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (ruangan_id)
      REFERENCES ruangan(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    FOREIGN KEY (jurusan_id)
      REFERENCES jurusan(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_schedules_semester
    ON schedules(semester);

  CREATE INDEX IF NOT EXISTS idx_schedules_hari
    ON schedules(hari);

  CREATE INDEX IF NOT EXISTS idx_schedules_dosen
    ON schedules(dosen_id);

  CREATE INDEX IF NOT EXISTS idx_schedules_ruangan
    ON schedules(ruangan_id);
`);

console.log("Database SQLite berhasil terhubung.");

module.exports = db;
