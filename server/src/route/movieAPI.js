var express = require("express");
let { handleGetAllMovie, handleGetSeries} = require("../controllers/movieController");
let router = express.Router();

let initMovieAPIRoutes = (app) => {
  router.get("/", handleGetAllMovie);
  router.get("/api/series", handleGetSeries)
  return app.use("/", router);
};

module.exports = {
  initMovieAPIRoutes,
};
