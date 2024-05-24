var express = require("express");
const MovieController = require("../controllers/movieController");
let router = express.Router();
let authMiddleware = require("../middleware/auth.middleware");

let initMovieAPIRoutes = (app) => {
  router.get("/", authMiddleware.loggedin, MovieController.handleGetAllMovie);
  router.get("/api/movie", MovieController.handleGetMovie);
  router.get("/api/popular", MovieController.handleGetPopular);
  router.get("/api/playlist", MovieController.handleGetPlaylist);
  router.get("/api/movie-detail/:id", MovieController.handleGetMovieDetail);
  router.get("/api/profile", MovieController.handleGetProfile);
  router.get("/add-list/:id", MovieController.handleAddList);
  router.post("/search", MovieController.handleSearchFilmByName);
  router.get("/api/watch-trailer/:id", MovieController.handleGetWatchTrailer);
  router.get("/api/get-home-after-login", MovieController.handleGetHomeAfterLogin);

  router.post('/submit-rating', MovieController.handleVoteRating);
  return app.use("/", router);
};

module.exports = {
  initMovieAPIRoutes,
};
