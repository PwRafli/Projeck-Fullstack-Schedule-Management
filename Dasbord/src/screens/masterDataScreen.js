/**
 * Dasbord/src/screens/masterDataScreen.js
 * Layar Pengelolaan Data Master (Dosen, Mata Kuliah, Ruangan, Program Studi)
 * STIKOM PGRI Banyuwangi
 */

export function renderDosenTable(dosenList) {
  const tbody = document.getElementById("dosen-table-body");
  if (!tbody) return;

  tbody.innerHTML = dosenList
    .map(
      (d, i) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-dark-hover border-b border-slate-100 dark:border-dark-border text-xs">
      <td class="p-3 font-mono text-slate-400">${i + 1}</td>
      <td class="p-3 font-bold text-slate-900 dark:text-white">${d.nama}</td>
      <td class="p-3 font-mono text-slate-600 dark:text-slate-400">${d.nidn}</td>
      <td class="p-3 text-slate-700 dark:text-slate-300">${d.jurusan}</td>
      <td class="p-3 text-slate-500">${d.email}</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
          ${d.status}
        </span>
      </td>
    </tr>
  `
    )
    .join("");
}

export function renderMatkulTable(matkulList) {
  const tbody = document.getElementById("matkul-table-body");
  if (!tbody) return;

  tbody.innerHTML = matkulList
    .map(
      (m, i) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-dark-hover border-b border-slate-100 dark:border-dark-border text-xs">
      <td class="p-3 font-mono text-slate-400">${i + 1}</td>
      <td class="p-3 font-mono font-bold text-brand-600 dark:text-brand-400">${m.kode}</td>
      <td class="p-3 font-bold text-slate-900 dark:text-white">${m.nama}</td>
      <td class="p-3 font-bold text-slate-700 dark:text-slate-300">${m.sks} SKS</td>
      <td class="p-3 text-slate-600 dark:text-slate-400">Semester ${m.semester}</td>
      <td class="p-3 text-slate-700 dark:text-slate-300">${m.jurusan}</td>
    </tr>
  `
    )
    .join("");
}

export function renderRuanganTable(ruangList) {
  const tbody = document.getElementById("ruangan-table-body");
  if (!tbody) return;

  tbody.innerHTML = ruangList
    .map(
      (r, i) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-dark-hover border-b border-slate-100 dark:border-dark-border text-xs">
      <td class="p-3 font-mono text-slate-400">${i + 1}</td>
      <td class="p-3 font-bold text-slate-900 dark:text-white">${r.nama}</td>
      <td class="p-3 text-slate-600 dark:text-slate-400">${r.gedung}</td>
      <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">${r.kapasitas} Kursi</td>
      <td class="p-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
          r.jenis === "Laboratorium Komputer"
            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400"
            : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
        }">
          ${r.jenis}
        </span>
      </td>
    </tr>
  `
    )
    .join("");
}
