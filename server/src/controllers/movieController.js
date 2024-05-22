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
let {add_new_movie, update, update_rating} = require("../../recommendationSystem/server")



let handleGetAllMovie = async (req, res) => {
  const userID = req.session.user.id;
  let recommendations;
  let allMovies;
  let moviesTopRating;
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
  if (isNaN(movieId)) {
    return res.status(400).send("Invalid movie ID");
  }
  console.log('movie id ne',movieId);
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

let handleGetHomeAfterLogin = async(req, res) => {
  const userID = req.session.user.id;
  let recommendations;
  let allMovies;
  let moviesTopRating;
  // let recommendMovies = await getAllMoviesRecommend(userID);
  try {
    recommendations = await getAllMoviesRecommend(userID);
    allMovies = await getAllMovies();
    moviesTopRating = await getMovieOrderByRating();
  } catch (e) {
    console.log(e)
  }
  return res.render("index.ejs", { listMovies: allMovies, moviesTopRating: moviesTopRating, listRCMDT: recommendations});}



//Admin function 
let handleGetAdmin = (req, res)=> {
  let message = "";
  res.render("utils/admin.ejs", {message: message})
}

let handleAddFilm = async (req, res) => {
  let movie = req.body;
  console.log(movie)
  let message = "";
  try {
    message = await addNewMovie(movie);
    let newMovie = message.newMovie;
    console.log(newMovie);
    await add_new_movie(newMovie.id, newMovie.Action, newMovie.Adventure, newMovie.Animation, newMovie.Comedy, newMovie.Crime, newMovie.Documentary, newMovie.Drama, newMovie.Family, newMovie.Fantasy, newMovie.History, newMovie.Horror, newMovie.Music, newMovie.Mystery, newMovie.Romance, newMovie['Science Fiction'], newMovie['TV Movie'], newMovie.Thriller, newMovie.War, newMovie.Western)
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

let handleVoteRating = async(req, res) => {
  let body = req.body;
  let userId = req.session.user.id;
  console.log(userId, body.movieId)
  const insertQuery = `
  INSERT INTO rating (userID, movieID, rating)
  VALUES (?, ?, ?)
`;
let newVote = await db.sequelize.query(insertQuery, {
  replacements: [userId, body.movieId, body.rating],
  type: db.sequelize.QueryTypes.INSERT,
});
  try {
    const query = `
      UPDATE Movies m
      SET rating = (
        SELECT AVG(r.rating)
        FROM rating r
        WHERE r.movieID = m.id
      )
    `; 
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.UPDATE });
    console.log('Movie ratings updated successfully');
  } catch (error) {
    console.error('Error updating movie ratings:', error);
  }
  await update_rating(newVote.userID, newVote.movieID, newVote.rating);
  console.log('newvote;',newVote) 
  return res.redirect(req.headers.referer || '/')
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
  handleVoteRating,
  handleGetAdmin,
  handleAddFilm,
  handleGetDashboard
};
