let {
  getAllMovies,
  getMovieById,
  searchMovieByName,
  saveAddList,
  getAllMovieHistory,
  getAllMoviesRecommend,
  getMovieOrderByRating,
  getMoviesTopView,
  getAllMoviesRecommendByMovieID,
  addNewMovie
} = require("../services/movieService");
import db from "../models/index"
require("dotenv").config();
const { getJson } = require("serpapi");

var recommendations;
var allMovies;
var moviesTopRating;

let handleGetAllMovie = async (req, res) => {
  const userID = req.session.user.id;
  // let recommendMovies = await getAllMoviesRecommend(userID);
  try {
    recommendations = await getAllMoviesRecommend(userID);
    allMovies = await getAllMovies();
    moviesTopRating = await getMovieOrderByRating();
  } catch (e) {
    console.log(e)
  }
  return res.render("index.ejs", { listMovies: allMovies, moviesTopRating: moviesTopRating, listRCMDT: recommendations});
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
  let movieId = parseInt(req.params.id);
  // let MoviesRecommendByMvId = await getAllMoviesRecommendByMovieID(movieId);
  // let movie = await getMovieById(movieId);
  let MoviesRecommendByMvId;
  let movie;
  let movieTitle = ""
  try {
    MoviesRecommendByMvId = await getAllMoviesRecommendByMovieID(movieId)
    movie = await getMovieById(movieId);
    if(movie.title) {
      movieTitle = movie.title + "movie";
    }
  } catch (e) {
    console.log(e);
  }
  // const results = await getJson({
  //   q: movieTitle,
  //   engine: "google_images",
  //   ijn: "0",
  //   api_key: process.env.SECRET_API_GG_IMG_KEY
  // });
  // const image_results = results["images_results"];
  // return res.render("utils/movie_details.ejs", { movie: movie, images: image_results, movieRCM: MoviesRecommendByMvId});
  return res.render("utils/movie_details.ejs", { movie: movie, movieRCM: MoviesRecommendByMvId});
};

let handleSearchFilmByName = async (req, res) => {
  let name = req.body.search;
  let movies = await searchMovieByName(name);
  console.log(movies);
  return res.render("utils/movie.ejs", { movies: movies });
};

let handleGetProfile = async (req, res) => {
  const user = req.session.user;
  return res.render("utils/profile.ejs", { user: user });
};

let handleAddList = async (req, res) => {
  const movieId = req.params.id;
  const userId = req.session.user.id;
  console.log("hiiiiiiiiiiiiiiiiii");
  let message = await saveAddList(movieId, userId);
  console.log(message.errCode);
  return res.redirect(`/api/movie-detail/${movieId}`);
};

let handleGetWatchTrailer = async (req, res) => {
  let movieId = parseInt(req.params.id);
  let MoviesRecommendByMvId;
  let movie;
  try {
    MoviesRecommendByMvId = await getAllMoviesRecommendByMovieID(movieId)
    movie = await getMovieById(movieId);
  } catch (e) {
    console.log(e);
  }
  let videoId;
  try {
    videoId = movie.link.split("=")[1];
  } catch (error) {
    console.log(error)
  }
  return res.render('utils/watch_trailer.ejs', {videoId: videoId, moviesRCMDT: MoviesRecommendByMvId})
}

let handleGetHomeAfterLogin = (req, res) => {
  return res.render('index.ejs', {listMovies: allMovies, moviesTopRating: moviesTopRating, listRCMDT: recommendations});
}

//Admin function 
let handleGetAdmin = (req, res)=> {
  let message = "";
  res.render("utils/admin.ejs", {message: message})
}

let handleAddFilm = async (req, res) => {
  let movie = req.body;
  let message;
  try {
    message = await addNewMovie(movie);
  } catch (e) {
    console.log(e)
    message = {
      errCode: 1,
      errMessage: "Lỗi thêm phim"
    }
  }
  return res.render("utils/admin.ejs", {message: message});
}

let handleGetDashboard = async(req, res) => {
  let moviesCount = await db.Movie.count();
  let usersCount = await db.User.count();
  let visitsCount = await db.Visit.count();
  return res.render("dashboard.ejs", {
    moviesCount: moviesCount, 
    usersCount: usersCount,
    visitsCount: visitsCount
  }
  )
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
  handleGetWatchTrailer,
  handleGetHomeAfterLogin,
  handleGetAdmin,
  handleAddFilm,
  handleGetDashboard
};
