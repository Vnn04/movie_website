var express = require("express");
const login = require("../controllers/login.controller");
let AdminController= require("../controllers/admin.controller");
let router = express.Router();
let authMiddleware = require("../middleware/auth.middleware");

let initAdminAPIRoutes = (app) => {
  // admin function
  router.get('/login-admin', authMiddleware.isAuthAdmin, login.showLoginAdminForm)
  router.post('/login-admin', login.loginAdmin)
  router.get("/get/admin", AdminController.handleGetAdmin)
  router.post("/add-movie", AdminController.handleAddFilm)
  router.get("/get-dashboard", authMiddleware.Adminloggedin,AdminController.handleGetDashboard)
  router.post('/api/delete-user/:id', AdminController.handleDeleteUser);
  return app.use("/", router);
};

module.exports = {
  initAdminAPIRoutes,
};
