var express = require("express");
let {
  handleGetAllMovie,
  handleGetSeries,
  handleGetMovie,
  handleGetPopular,
  handleGetPlaylist,
  handleGetMovieDetail,
  handleSearchFilmByName,
  handleGetProfile,
  handleAddList,
  handleGetWatchTrailer,
  handleGetHomeAfterLogin,
  handleVoteRating,
  handleGetAdmin,
  handleAddFilm,
  handleGetDashboard
} = require("../controllers/movieController");
let router = express.Router();
let authMiddleware = require("../middleware/auth.middleware");

let initMovieAPIRoutes = (app) => {
  router.get("/", authMiddleware.loggedin, handleGetAllMovie);
  router.get("/api/series", handleGetSeries);
  router.get("/api/movie", handleGetMovie);
  router.get("/api/popular", handleGetPopular);
  router.get("/api/playlist", handleGetPlaylist);
  router.get("/api/movie-detail/:id", handleGetMovieDetail);
  router.get("/api/profile", handleGetProfile);
  router.get("/add-list/:id", handleAddList);
  router.post("/search", handleSearchFilmByName);
  router.get("/api/watch-trailer/:id", handleGetWatchTrailer)
  router.get("/api/get-home-after-login", handleGetHomeAfterLogin);

  router.post('/submit-rating', handleVoteRating)

  // admin function
  router.get("/get/admin", handleGetAdmin)
  router.post("/add-movie", handleAddFilm)
  router.get("/get-dashboard", handleGetDashboard)
  return app.use("/", router);
};

module.exports = {
  initMovieAPIRoutes,
};
