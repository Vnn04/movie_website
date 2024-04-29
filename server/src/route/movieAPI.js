var express = require("express");
let {
  handleGetAllMovie,
  handleGetSeries,
  handleGetMovie,
  handleGetPopular,
  handleGetTrend,
  handleGetMovieDetail,
  handleSearchFilmByName,
  handleGetProfile,
  handleAddList,
} = require("../controllers/movieController");
let router = express.Router();
let authMiddleware = require("../middleware/auth.middleware");

let initMovieAPIRoutes = (app) => {
  router.get("/", authMiddleware.loggedin, handleGetAllMovie);
  router.get("/api/series", handleGetSeries);
  router.get("/api/movie", handleGetMovie);
  router.get("/api/popular", handleGetPopular);
  router.get("/api/playlist", handleGetTrend);
  router.get("/api/movie-detail/:id", handleGetMovieDetail);
  router.get("/api/profile", handleGetProfile);
  router.get("/add-list/:id", handleAddList);
  router.post("/search", handleSearchFilmByName);

  return app.use("/", router);
};

module.exports = {
  initMovieAPIRoutes,
};
