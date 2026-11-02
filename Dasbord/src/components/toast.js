/**
 * Dasbord/src/components/toast.js
 * Komponen Notifikasi Toast Interaktif
 * STIKOM PGRI Banyuwangi
 */

export function showToast(message, type = "info", duration = 3500) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-3 opacity-0 ${
    type === "success"
      ? "bg-emerald-900/90 text-emerald-100 border-emerald-700"
      : type === "danger"
      ? "bg-rose-900/90 text-rose-100 border-rose-700"
      : type === "warning"
      ? "bg-amber-900/90 text-amber-100 border-amber-700"
      : "bg-slate-900/90 text-slate-100 border-slate-700"
  }`;

  const iconName =
    type === "success"
      ? "check-circle"
      : type === "danger"
      ? "alert-circle"
      : type === "warning"
      ? "alert-triangle"
      : "info";

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 shrink-0"></i>
    <span class="text-xs font-semibold leading-relaxed flex-1">${message}</span>
    <button class="text-slate-400 hover:text-white shrink-0 p-1 rounded-lg" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Animasi masuk
  setTimeout(() => {
    toast.classList.remove("translate-y-3", "opacity-0");
  }, 50);

  // Animasi keluar otomatis
  setTimeout(() => {
    toast.classList.add("translate-y-3", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
