/**
 * Dasbord/page.js
 * Entry metadata dan router helper untuk halaman Dasbor Jadwal Kuliah.
 */
const layout = require("./layout");
const indexView = require("./BeckEnd/views/index");

module.exports = {
  layout,
  getPageData: async () => {
    return {
      summary: indexView.getDashboardSummary(),
      schedules: indexView.getAllSchedules(),
      weekly: indexView.getWeeklyTimetable()
    };
  }
};
