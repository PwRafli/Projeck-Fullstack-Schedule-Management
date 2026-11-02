/**
 * Dasbord/src/theme/theme.js
 * Manajemen Tema Tampilan & Dark Mode Token
 * STIKOM PGRI Banyuwangi
 */

export const THEME_CONFIG = {
  storageKey: "scheduler_theme_mode",
  colors: {
    brand: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#1d4ee8",
      700: "#1d4ed8",
      900: "#1e3a8a"
    },
    dark: {
      bg: "#0B132B",
      card: "#111C3D",
      border: "#1E2C52",
      hover: "#18264A"
    }
  }
};

/**
 * Menginisialisasi preferensi tema saat aplikasi dimuat
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_CONFIG.storageKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

  applyTheme(isDark);
  return isDark;
}

/**
 * Menerapkan class dark pada dokumen HTML dan ikon toggle
 */
export function applyTheme(isDark) {
  const html = document.documentElement;
  const icon = document.getElementById("theme-toggle-icon");

  if (isDark) {
    html.classList.add("dark");
    localStorage.setItem(THEME_CONFIG.storageKey, "dark");
    if (icon) icon.setAttribute("data-lucide", "sun");
  } else {
    html.classList.remove("dark");
    localStorage.setItem(THEME_CONFIG.storageKey, "light");
    if (icon) icon.setAttribute("data-lucide", "moon");
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Toggle antara light mode dan dark mode
 */
export function toggleDarkMode() {
  const isDark = document.documentElement.classList.contains("dark");
  applyTheme(!isDark);
}
