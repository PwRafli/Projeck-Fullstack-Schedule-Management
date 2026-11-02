/**
 * Dasbord/src/storage/authStorage.js
 * Manajemen Sesi Autentikasi Pengguna & Role Guard Storage
 * STIKOM PGRI Banyuwangi
 */

export const AUTH_KEYS = {
  ROLE: "scheduler_user_role",      // 'mahasiswa' | 'dosen' | 'admin'
  TYPE: "scheduler_user_type",      // 'student' | 'lecturer' | 'admin'
  NAME: "scheduler_user_name",      // Nama lengkap pengguna
  ID: "scheduler_user_id"           // NIM atau Kode Dosen
};

/**
 * Menyimpan data sesi login pengguna
 */
export function setAuthSession({ role, type, name, id }) {
  try {
    sessionStorage.setItem(AUTH_KEYS.ROLE, role);
    sessionStorage.setItem(AUTH_KEYS.TYPE, type);
    sessionStorage.setItem(AUTH_KEYS.NAME, name);
    sessionStorage.setItem(AUTH_KEYS.ID, id);
  } catch (err) {
    console.error("Gagal menyimpan sesi login:", err);
  }
}

/**
 * Mengambil informasi sesi aktif pengguna
 */
export function getAuthSession() {
  try {
    return {
      role: sessionStorage.getItem(AUTH_KEYS.ROLE) || null,
      type: sessionStorage.getItem(AUTH_KEYS.TYPE) || null,
      name: sessionStorage.getItem(AUTH_KEYS.NAME) || null,
      id: sessionStorage.getItem(AUTH_KEYS.ID) || null,
      isAuthenticated: Boolean(sessionStorage.getItem(AUTH_KEYS.ROLE))
    };
  } catch (err) {
    return { role: null, type: null, name: null, id: null, isAuthenticated: false };
  }
}

/**
 * Memeriksa apakah pengguna saat ini adalah Mahasiswa atau Dosen
 * Digunakan untuk menyembunyikan tombol peralihan portal
 */
export function isStudentOrLecturerUser() {
  try {
    const session = getAuthSession();
    const role = (session.role || "").toLowerCase();
    const type = (session.type || "").toLowerCase();
    const id = (session.id || "").toLowerCase();

    // Administrator sistem diperbolehkan melihat tombol switcher
    if (type === "admin" || (role === "admin" && id.includes("admin") && !id.startsWith("dsn"))) {
      return false;
    }

    // Mahasiswa
    if (role === "mahasiswa" || type === "student" || id.startsWith("202")) {
      return true;
    }

    // Dosen / Pengajar
    if (role === "dosen" || type === "lecturer" || id.startsWith("dsn") || role === "admin") {
      return true;
    }

    return true;
  } catch (err) {
    return true;
  }
}

/**
 * Menghapus seluruh sesi autentikasi saat logout
 */
export function clearAuthSession() {
  try {
    sessionStorage.removeItem(AUTH_KEYS.ROLE);
    sessionStorage.removeItem(AUTH_KEYS.TYPE);
    sessionStorage.removeItem(AUTH_KEYS.NAME);
    sessionStorage.removeItem(AUTH_KEYS.ID);
  } catch (err) {
    console.error("Gagal menghapus sesi login:", err);
  }
}
