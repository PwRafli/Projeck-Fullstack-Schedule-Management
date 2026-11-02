/**
 * Dasbord/src/components/modal.js
 * Manajemen Modal Interaktif (Tambah/Edit Jadwal, Hapus, Detail, Logout)
 * STIKOM PGRI Banyuwangi
 */

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

export function openScheduleModal(scheduleData = null) {
  const modal = document.getElementById("modal-schedule");
  const form = document.getElementById("form-schedule");
  const title = document.getElementById("modal-title");
  const editId = document.getElementById("edit-schedule-id");

  if (!modal || !form) return;

  form.reset();

  if (scheduleData) {
    if (title) title.innerText = "Edit Jadwal Kuliah";
    if (editId) editId.value = scheduleData.id;
    document.getElementById("modal-matkul").value = scheduleData.matkul || "";
    document.getElementById("modal-dosen").value = scheduleData.dosen || "";
    document.getElementById("modal-semester").value = scheduleData.semester || "S1";
    document.getElementById("modal-jurusan").value = scheduleData.jurusan || "Teknik Informatika";
    document.getElementById("modal-kelas").value = scheduleData.kelas || "TI-1A";
    document.getElementById("modal-hari").value = scheduleData.hari || "Senin";
    document.getElementById("modal-jam-mulai").value = scheduleData.jamMulai || "08:00";
    document.getElementById("modal-jam-selesai").value = scheduleData.jamSelesai || "09:40";
    document.getElementById("modal-ruangan").value = scheduleData.ruangan || "Lab Komputer 1";
    document.getElementById("modal-status").value = scheduleData.status || "Scheduled";
  } else {
    if (title) title.innerText = "Tambah Jadwal Kuliah Baru";
    if (editId) editId.value = "";
  }

  openModal("modal-schedule");
}

export function openDeleteModal(title, message, onConfirm) {
  const modalTitle = document.getElementById("delete-modal-title");
  const modalSub = document.getElementById("delete-modal-sub");
  const confirmBtn = document.getElementById("btn-confirm-delete");

  if (modalTitle) modalTitle.innerText = title;
  if (modalSub) modalSub.innerText = message;
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      onConfirm();
      closeModal("modal-delete");
    };
  }

  openModal("modal-delete");
}

export function openLogoutModal() {
  openModal("modal-logout");
}

export function closeLogoutModal() {
  closeModal("modal-logout");
}
