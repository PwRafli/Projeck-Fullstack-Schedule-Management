/**
 * Dasbord/src/storage/apiClient.js
 * Klien REST API untuk Sinkronisasi Database SQLite
 * STIKOM PGRI Banyuwangi
 */

const API_BASE = "/api";

export async function fetchAllSchedules() {
  const res = await fetch(`${API_BASE}/schedules`);
  if (!res.ok) throw new Error("Gagal mengambil data jadwal dari database");
  return await res.json();
}

export async function createSchedule(data) {
  const res = await fetch(`${API_BASE}/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Gagal menambahkan jadwal baru");
  return await res.json();
}

export async function updateSchedule(id, data) {
  const res = await fetch(`${API_BASE}/schedules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Gagal memperbarui data jadwal");
  return await res.json();
}

export async function deleteSchedule(id) {
  const res = await fetch(`${API_BASE}/schedules/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Gagal menghapus jadwal");
  return await res.json();
}

export async function fetchMasterDosen() {
  const res = await fetch(`${API_BASE}/dosen`);
  return res.ok ? await res.json() : [];
}

export async function fetchMasterMatkul() {
  const res = await fetch(`${API_BASE}/matkul`);
  return res.ok ? await res.json() : [];
}

export async function fetchMasterRuangan() {
  const res = await fetch(`${API_BASE}/ruangan`);
  return res.ok ? await res.json() : [];
}

export async function fetchMasterJurusan() {
  const res = await fetch(`${API_BASE}/jurusan`);
  return res.ok ? await res.json() : [];
}
