const MovieService = require("../services/movieService");
const db = require("../models/index");
require("dotenv").config();
const { getJson } = require("serpapi");
const { add_new_movie, update_rating } = require("../../recommendationSystem/server");
const { where } = require("sequelize");

var MoviesRecommendByUserId;
class MovieController {
  static async handleGetAllMovie(req, res) {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const userID = req.session.user.id;
    let recommendations, allMovies, moviesTopRating;
    try {
      allMovies = await MovieService.getAllMovies();
      moviesTopRating = await MovieService.getMovieOrderByRating();
      recommendations = await MovieService.getAllMoviesRecommend(userID);
    } catch (e) {
      console.log(e);
    }
    return res.render("index.ejs", { listMovies: allMovies, moviesTopRating, listRCMDT: recommendations });
  }


  static handleGetMovie(req, res) {
    const movies = null;
    return res.render("utils/movie.ejs", { movies });
  }

  static async handleGetPopular(req, res) {
    let moviesTopView;
    try {
      moviesTopView = await MovieService.getMoviesTopView();
    } catch (e) {
      console.log(e);
    }
    return res.render("utils/popular.ejs", { moviesV: moviesTopView });
  }

  static async handleGetPlaylist(req, res) {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    let movies;
    try {
      movies = await MovieService.getAllMovieHistory(userId);
      console.log(movies[0])
    } catch (e) {
      console.log(e);
    }
    return res.render("utils/playlist.ejs", { movies });
  }

  static async handleGetMovieDetail(req, res) {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    let movieId = parseInt(req.params.id);
    if (isNaN(movieId)) {
      return res.status(400).send("Invalid movie ID");
    }
    let movie, movieTitle, user = "";
    
    try {
      movie = await MovieService.getMovieById(movieId);
      user = await db.User.findOne({
        where: {id: userId}
      })
      MoviesRecommendByUserId = await MovieService.getAllMoviesRecommend(userId);
      if (movie.title) {
        movieTitle = movie.title + " movie";
      }
    } catch (e) {
      console.log(e);
    }
      const results = await getJson({
        q: movieTitle,
        engine: "google_images",
        ijn: "0",
        api_key: process.env.SECRET_API_GG_IMG_KEY
      });
      const image_results = results["images_results"];
      return res.render("utils/movie_details.ejs", { movie: movie, images: image_results, movieRCM: MoviesRecommendByUserId, user: user});
    // return res.render("utils/movie_details.ejs", { movie, movieRCM: MoviesRecommendByUserId, user: user });
  }

  static async handleSearchFilmByName(req, res) {
    let name = req.body.search;
    let movies;
    try {
      movies = await MovieService.searchMovieByName(name);
    } catch (e) {
      console.log(e);
    }
    return res.render("utils/movie.ejs", { movies });
  }

  static async handleGetProfile(req, res) {
    if (!req.session.user || !req.session.user) {
      return res.redirect('/login');
    }
    const user = await db.User.findOne({
      where: {id: req.session.user.id}
    })
    return res.render("utils/profile.ejs", { user });
  }

  static async handleAddList(req, res) {
    const movieId = req.params.id;
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    let message;
    try {
      message = await MovieService.saveAddList(movieId, userId);
      console.log(message.errCode);
    } catch (e) {
      console.log(e);
    }
    return res.redirect(`/api/movie-detail/${movieId}`);
  }

  static async handleGetWatchTrailer(req, res) {
    let movieId = parseInt(req.params.id);
    let MoviesRecommendByMvId, movie, videoId;
    try {
      movie = await MovieService.getMovieById(movieId);
      videoId = movie.link.split("=")[1];
      console.log(videoId)
      MoviesRecommendByMvId = await MovieService.getAllMoviesRecommendByMovieID(movieId);
    } catch (e) {
      console.log(e);
    }
    return res.render('utils/watch_trailer.ejs', { videoId, moviesRCMDT: MoviesRecommendByMvId ,movieId: movieId});
  }

  static async handleGetHomeAfterLogin(req, res) {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    let userID = req.session.user ? req.session.user.id : 1;
    let recommendations, allMovies, moviesTopRating;
    try {
      recommendations = await MovieService.getAllMoviesRecommend(userID);
      allMovies = await MovieService.getAllMovies();
      moviesTopRating = await MovieService.getMovieOrderByRating();
    } catch (e) {
      console.log(e);
    }
    return res.render("index.ejs", { listMovies: allMovies, moviesTopRating, listRCMDT: recommendations });
  }

  static async handleVoteRating(req, res) {
    let body = req.body;
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    let userId = req.session.user ? req.session.user.id : 1;
    try {
      const checkQuery = `
        SELECT userID, movieID
        FROM rating
        WHERE userID = ? AND movieID = ?
      `;
      let existingVote = await db.sequelize.query(checkQuery, {
        replacements: [userId, body.movieId],
        type: db.sequelize.QueryTypes.SELECT,
      });

      if (existingVote.length > 0) {
        const updateQuery = `
          UPDATE rating
          SET rating = ?
          WHERE userID = ? AND movieID = ?
        `;
        await db.sequelize.query(updateQuery, {
          replacements: [body.rating, userId, body.movieId],
          type: db.sequelize.QueryTypes.UPDATE,
        });
      } else {
        const insertQuery = `
          INSERT INTO rating (userID, movieID, rating)
          VALUES (?, ?, ?)
        `;
        await db.sequelize.query(insertQuery, {
          replacements: [userId, body.movieId, body.rating],
          type: db.sequelize.QueryTypes.INSERT,
        });
      }

      const updateAverageRatingQuery = `
        UPDATE Movies m
        SET rating = (
          SELECT AVG(r.rating)
          FROM rating r
          WHERE r.movieID = m.id
        )
        WHERE m.id = ?
      `;
      await db.sequelize.query(updateAverageRatingQuery, {
        replacements: [body.movieId],
        type: db.sequelize.QueryTypes.UPDATE,
      });

      await update_rating(parseInt(userId), parseInt(body.movieId), parseInt(body.rating));
      MoviesRecommendByUserId = await MovieService.getAllMoviesRecommend(userId);

    } catch (error) {
      console.error('Error updating movie ratings:', error);
    }
    return res.redirect(req.headers.referer || '/');
  }
}

module.exports = MovieController;
