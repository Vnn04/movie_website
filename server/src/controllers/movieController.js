let {
  getAllMovies,
  getMovieById,
  searchMovieByName,
  saveAddList,
  getAllMovieHistory,
  getAllMoviesRecommend,
  getMovieOrderByRating,
  getMoviesTopView
} = require("../services/movieService");
require("dotenv").config();
const { getJson } = require("serpapi");
// var recommendations;
var allMovies;
var moviesTopRating;
let handleGetAllMovie = async (req, res) => {
  // const userID = req.session.user.id;
  // let recommendMovies = await getAllMoviesRecommend(userID);
  // recommendations = await getAllMoviesRecommend(userID);
  allMovies = await getAllMovies();
  moviesTopRating = await getMovieOrderByRating();
  return res.render("index.ejs", { listMovies: allMovies, moviesTopRating: moviesTopRating});
};

let handleGetSeries = (req, res) => {
  return res.render("utils/series.ejs");
};

let handleGetMovie = (req, res) => {
  const movies = null;
  return res.render("utils/movie.ejs", { movies: movies });
};

let handleGetPopular = async (req, res) => {
  let moviesTopView = await getMoviesTopView();
  return res.render("utils/popular.ejs", {moviesV: moviesTopView});
};

let handleGetPlaylist = async (req, res) => {
  const userId = req.session.user.id;
  let movies = await getAllMovieHistory(userId);
  console.log(movies);
  return res.render("utils/playlist.ejs", { movies: movies });
};

let handleGetMovieDetail = async (req, res) => {
  const movieId = req.params.id;
  let movie = await getMovieById(movieId);
  let movieTitle = ""
  if(movie.title) {
    movieTitle = movie.title + "movie";
  }
  console.log("movietitle neee: ", movieTitle);
  const results = await getJson({
    q: movieTitle,
    engine: "google_images",
    ijn: "0",
    api_key: process.env.SECRET_API_GG_IMG_KEY
  });
  const image_results = results["images_results"];
  res.render("utils/movie_details.ejs", { movie: movie, images: image_results });
};

let handleSearchFilmByName = async (req, res) => {
  let name = req.body.search;
  let movies = await searchMovieByName(name);
  console.log(movies);
  res.render("utils/movie.ejs", { movies: movies });
};

let handleGetProfile = async (req, res) => {
  const user = req.session.user;
  res.render("utils/profile.ejs", { user: user });
};

let handleAddList = async (req, res) => {
  const movieId = req.params.id;
  const userId = req.session.user.id;
  console.log("hiiiiiiiiiiiiiiiiii");
  let message = await saveAddList(movieId, userId);
  console.log(message.errCode);
  res.redirect(`/api/movie-detail/${movieId}`);
};

let handleGetHomeAfterLogin = (req, res) => {
  res.render('index.ejs', {listMovies: allMovies, moviesTopRating: moviesTopRating});
}
module.exports = {
  handleGetAllMovie,
  handleGetSeries,
  handleGetMovie,
  handleGetPopular,
  handleGetPlaylist,
  handleGetMovieDetail,
  handleSearchFilmByName,
  handleGetProfile,
  handleAddList,
  handleGetHomeAfterLogin
};
