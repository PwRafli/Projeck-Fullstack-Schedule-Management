/**
 * Dasbord/src/navigation/roleGuard.js
 * Manajemen Hak Akses, Proteksi Halaman & Visibilitas Switcher Role
 * STIKOM PGRI Banyuwangi
 */

import { getAuthSession, isStudentOrLecturerUser } from "../storage/authStorage.js";

/**
 * Memeriksa autentikasi saat aplikasi dimuat
 * Mengalihkan pengguna ke login portal jika belum login
 */
export function checkAuthGuard() {
  const session = getAuthSession();
  if (!session.isAuthenticated) {
    if (window.location.protocol.startsWith("http")) {
      window.location.replace("/");
    } else {
      window.location.replace("../LoginPage/(auth)/index_PortalLogin.html");
    }
    return false;
  }
  return true;
}

/**
 * Menyelaraskan seluruh elemen UI dengan peran pengguna saat ini:
 * - Menyembunyikan tombol [ Portal Dosen | Portal Mahasiswa ] untuk mahasiswa & dosen
 * - Menyembunyikan tombol Switch di sidebar untuk mahasiswa & dosen
 * - Membatasi akses menu master dan aksi penambahan data
 */
export function syncRoleUI(role = "admin") {
  const isAdmin = role === "admin";
  const hideRoleSwitcher = isStudentOrLecturerUser();

  // 1. Sembunyikan Tombol Switcher Portal untuk Mahasiswa & Dosen
  const roleSwitcherContainer = document.getElementById("role-switcher-container");
  const roleSwitchSidebarBtn = document.getElementById("role-switch-btn-sidebar");

  if (roleSwitcherContainer) {
    if (hideRoleSwitcher) {
      roleSwitcherContainer.classList.add("hidden");
      roleSwitcherContainer.style.setProperty("display", "none", "important");
    } else {
      roleSwitcherContainer.classList.remove("hidden");
      roleSwitcherContainer.style.removeProperty("display");
      roleSwitcherContainer.style.display = "flex";
    }
  }

  if (roleSwitchSidebarBtn) {
    if (hideRoleSwitcher) {
      roleSwitchSidebarBtn.classList.add("hidden");
      roleSwitchSidebarBtn.style.setProperty("display", "none", "important");
    } else {
      roleSwitchSidebarBtn.classList.remove("hidden");
      roleSwitchSidebarBtn.style.removeProperty("display");
    }
  }

  // 2. Perbarui Badge Topbar
  const topbarBadgeBox = document.getElementById("topbar-role-badge-box");
  if (topbarBadgeBox) {
    if (isAdmin) {
      topbarBadgeBox.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/30">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Portal Dosen • Akses terbatas
        </span>
        <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <i data-lucide="database" class="w-3.5 h-3.5 text-cyan-500"></i>
          Status: SQLite DB
        </span>
      `;
    } else {
      topbarBadgeBox.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Portal Mahasiswa • Lihat data saja
        </span>
        <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
          <i data-lucide="info" class="w-3.5 h-3.5 text-emerald-500"></i>
          Jadwal Kuliah Pribadi
        </span>
      `;
    }
  }

  // 3. Batasi Menu Admin jika Pengguna adalah Mahasiswa
  const adminMenuSection = document.getElementById("admin-menu-section");
  const adminOnlyElements = document.querySelectorAll(".admin-only");

  if (adminMenuSection) {
    if (isAdmin) adminMenuSection.classList.remove("hidden");
    else adminMenuSection.classList.add("hidden");
  }

  adminOnlyElements.forEach((el) => {
    if (isAdmin) el.classList.remove("hidden");
    else el.classList.add("hidden");
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}
