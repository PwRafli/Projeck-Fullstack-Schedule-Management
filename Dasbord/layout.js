/**
 * Dasbord/layout.js
 * Layout konfigurasi & metadata untuk Dasbor Sistem Manajemen Jadwal Kuliah
 * STIKOM PGRI Banyuwangi
 */

module.exports = {
  title: "Project Schedule Management - Sistem Manajemen Jadwal Kuliah",
  institution: "STIKOM PGRI Banyuwangi",
  academicYear: "2026/2027 Ganjil",
  theme: {
    fontFamily: "Plus Jakarta Sans, sans-serif",
    brandColor: "#1d4ee8",
    navyColor: "#022B55"
  },
  navigation: [
    { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { id: "schedules", label: "Jadwal Kuliah", icon: "calendar" },
    { id: "weekly-view", label: "Matriks Mingguan", icon: "calendar-days" },
    { id: "dosen", label: "Dosen Pengajar", icon: "users" },
    { id: "matkul", label: "Mata Kuliah", icon: "book-open" },
    { id: "ruangan", label: "Ruang Kuliah", icon: "door-closed" },
    { id: "jurusan", label: "Program Studi", icon: "graduation-cap" },
    { id: "conflicts", label: "Deteksi Konflik", icon: "alert-triangle" },
    { id: "reports", label: "Laporan & Cetak", icon: "file-bar-chart" },
    { id: "settings", label: "Pengaturan", icon: "settings" }
  ]
};
