/**
 * BeckEnd/routes/api/index.js
 * Express Router untuk seluruh API RESTful sistem jadwal kuliah.
 */
const express = require("express");
const router = express.Router();

const indexView = require("../../views/index");
const addView = require("../../views/add");
const editView = require("../../views/edit");

// ==========================================
// 1. DASHBOARD & STATISTIK
// ==========================================
router.get("/dashboard/summary", (req, res) => {
  try {
    const summary = indexView.getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 2. JADWAL KULIAH (SCHEDULES)
// ==========================================
router.get("/schedules", (req, res) => {
  try {
    const filters = {
      semester: req.query.semester,
      hari: req.query.hari,
      dosen_id: req.query.dosen_id,
      ruangan_id: req.query.ruangan_id,
      jurusan_id: req.query.jurusan_id,
      search: req.query.search
    };
    const schedules = indexView.getAllSchedules(filters);
    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/schedules", (req, res) => {
  try {
    const result = addView.createSchedule(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/schedules/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.updateSchedule(id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/schedules/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.deleteSchedule(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 3. MATRIKS JADWAL MINGGUAN
// ==========================================
router.get("/weekly-matrix", (req, res) => {
  try {
    const matrix = indexView.getWeeklyTimetable();
    res.json({ success: true, data: matrix });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. MASTER DOSEN
// ==========================================
router.get("/dosen", (req, res) => {
  try {
    const data = indexView.getAllDosen(req.query.search);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/dosen", (req, res) => {
  try {
    const result = addView.createDosen(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/dosen/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.updateDosen(id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/dosen/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.deleteDosen(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 5. MASTER MATA KULIAH
// ==========================================
router.get("/matkul", (req, res) => {
  try {
    const data = indexView.getAllMatkul(req.query.search);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/matkul", (req, res) => {
  try {
    const result = addView.createMatkul(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/matkul/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.updateMatkul(id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/matkul/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.deleteMatkul(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 6. MASTER RUANGAN
// ==========================================
router.get("/ruangan", (req, res) => {
  try {
    const data = indexView.getAllRuangan(req.query.search);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/ruangan", (req, res) => {
  try {
    const result = addView.createRuangan(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/ruangan/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.updateRuangan(id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/ruangan/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.deleteRuangan(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 7. MASTER JURUSAN
// ==========================================
router.get("/jurusan", (req, res) => {
  try {
    const data = indexView.getAllJurusan();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/jurusan", (req, res) => {
  try {
    const result = addView.createJurusan(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/jurusan/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.updateJurusan(id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/jurusan/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.deleteJurusan(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 8. RESOLUSI KONFLIK JADWAL
// ==========================================
router.post("/conflicts/resolve/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = editView.autoResolveConflict(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
