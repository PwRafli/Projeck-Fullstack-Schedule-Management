/**
 * Dasbord/server.js
 * Main Express server for Project Schedule Management Dashboard
 * STIKOM PGRI Banyuwangi
 */
const express = require("express");
const path = require("node:path");
require("dotenv").config();

const { seedDatabase } = require("./BeckEnd/seed");
const apiRoutes = require("./BeckEnd/routes/api/index");

const app = express();
const PORT = process.env.PORT || 3000;
const projectRoot = path.resolve(__dirname, "..");

// Middleware parsing JSON & urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Root (/) Route: Display Login Portal
app.get("/", (req, res) => {
  res.sendFile(path.resolve(projectRoot, "LoginPage", "(auth)", "index_PortalLogin.html"));
});

// Route shortcuts for portal login
app.get("/login", (req, res) => {
  res.sendFile(path.resolve(projectRoot, "LoginPage", "(auth)", "index_PortalLogin.html"));
});
app.get("/portal", (req, res) => {
  res.sendFile(path.resolve(projectRoot, "LoginPage", "(auth)", "index_PortalLogin.html"));
});

// Explicit route for Dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

// Serve LoginPage assets
app.use("/LoginPage", express.static(path.resolve(projectRoot, "LoginPage")));

// Serve static assets from Dasbord directory (prevent auto-serving index.html on root)
app.use("/Dasbord", express.static(__dirname));
app.use(express.static(path.resolve(__dirname), { index: false }));

// Mount REST API endpoints
app.use("/api", apiRoutes);

// Fallback to Login Portal for any unmatched route
app.use((req, res) => {
  res.sendFile(path.resolve(projectRoot, "LoginPage", "(auth)", "index_PortalLogin.html"));
});

// Seed initial database & start server
try {
  seedDatabase();
} catch (err) {
  console.warn("Peringatan saat inisialisasi database:", err.message);
}

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Sistem Jadwal Kuliah berjalan di port ${PORT}`);
  console.log(`🔗 Portal Login: http://localhost:${PORT}/`);
  console.log(`🔗 Dashboard:    http://localhost:${PORT}/dashboard`);
  console.log(`🔗 API Base:     http://localhost:${PORT}/api/`);
  console.log(`====================================================`);
});

module.exports = app;
