/**
 * Dasbord/src/navigation/navigation.js
 * Manajemen Navigasi Tampilan, Breadcrumb, dan Sidebar Drawer
 * STIKOM PGRI Banyuwangi
 */

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", title: "Ringkasan Akademik" },
  { id: "schedules", label: "Jadwal Kuliah", title: "Master Jadwal Perkuliahan" },
  { id: "weekly", label: "Matriks Mingguan", title: "Jadwal Mingguan Terintegrasi" },
  { id: "dosen", label: "Dosen Pengajar", title: "Direktori Dosen" },
  { id: "matkul", label: "Mata Kuliah", title: "Kurikulum & Mata Kuliah" },
  { id: "ruangan", label: "Ruang & Lab", title: "Fasilitas Ruang Kuliah" },
  { id: "jurusan", label: "Program Studi", title: "Data Jurusan & Jenjang" },
  { id: "conflicts", label: "Deteksi Konflik", title: "Pemeriksaan Bentrok Jadwal" },
  { id: "reports", label: "Laporan & Cetak", title: "Pusat Laporan Jadwal" }
];

/**
 * Berpindah tampilan layar aktif di dalam dashboard
 */
export function navigateView(targetViewId) {
  // Sembunyikan semua container tampilan
  const views = document.querySelectorAll(".view-container");
  views.forEach((v) => v.classList.add("hidden"));

  // Tampilkan view yang dipilih
  const target = document.getElementById(`view-${targetViewId}`);
  if (target) {
    target.classList.remove("hidden");
  }

  // Perbarui status aktif pada item navigasi sidebar
  const navBtns = document.querySelectorAll(".nav-item-btn");
  navBtns.forEach((btn) => {
    const view = btn.getAttribute("data-view");
    if (view === targetViewId) {
      btn.classList.add("active", "bg-brand-50", "dark:bg-brand-950/40", "text-brand-600", "dark:text-brand-400", "font-bold");
    } else {
      btn.classList.remove("active", "bg-brand-50", "dark:bg-brand-950/40", "text-brand-600", "dark:text-brand-400", "font-bold");
    }
  });

  // Perbarui breadcrumb
  const currentNav = NAV_ITEMS.find((n) => n.id === targetViewId);
  const breadcrumb = document.getElementById("header-breadcrumb-current");
  if (breadcrumb && currentNav) {
    breadcrumb.innerText = currentNav.label;
  }

  // Tutup drawer mobile jika sedang terbuka
  closeMobileSidebar();
}

/**
 * Toggle sidebar untuk layar desktop (Mode Iconized / Compact)
 */
export function toggleDesktopSidebar() {
  const sidebar = document.getElementById("main-sidebar");
  if (!sidebar) return;

  const isCollapsed = sidebar.classList.contains("collapsed");
  if (isCollapsed) {
    sidebar.classList.remove("collapsed");
    localStorage.setItem("scheduler_sidebar_collapsed", "false");
  } else {
    sidebar.classList.add("collapsed");
    localStorage.setItem("scheduler_sidebar_collapsed", "true");
  }
}

/**
 * Toggle drawer sidebar untuk perangkat mobile (< 1024px)
 */
export function toggleMobileSidebar() {
  const sidebar = document.getElementById("main-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (!sidebar || !backdrop) return;

  const isOpen = !sidebar.classList.contains("-translate-x-full");
  if (isOpen) {
    closeMobileSidebar();
  } else {
    sidebar.classList.remove("-translate-x-full");
    backdrop.classList.remove("hidden");
    setTimeout(() => backdrop.classList.remove("opacity-0"), 10);
  }
}

export function closeMobileSidebar() {
  const sidebar = document.getElementById("main-sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (!sidebar || !backdrop) return;

  sidebar.classList.add("-translate-x-full");
  backdrop.classList.add("opacity-0");
  setTimeout(() => backdrop.classList.add("hidden"), 300);
}
