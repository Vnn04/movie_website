import db from "../models/index";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
let { getRecommendationsByUserID, getRecommendationsByMovieID } = require("../../recommendationSystem/server");

class MovieService {
  static async getAllMovies() {
    console.log(await db.User.count())
    return new Promise(async (resolve, reject) => {
      try {
        let movies = await db.Movie.findAll({
          order: [['release_date', 'DESC']]
        });
        resolve(movies);
      } catch (e) {
        reject(e);
      }
    });
  }

  static async getAllMovieHistory(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let movies = await db.sequelize.query(
          `SELECT * FROM Movies m
           LEFT JOIN Histories h ON m.id = h.movieId 
           WHERE h.userId = :userId`,
          {
            replacements: { userId: userId },
            type: db.sequelize.QueryTypes.SELECT
          }
        );
        resolve(movies);
      } catch (e) {
        reject(e);
      }
    });
  }

  static async getMovieById(movieId) {
    return new Promise(async (resolve, reject) => {
      try {
        const movie = await db.Movie.findOne({
          where: { id: movieId }
        });
        resolve(movie);
      } catch (e) {
        reject(e);
      }
    });
  }

  static async searchMovieByName(movieName) {
    return new Promise(async (resolve, reject) => {
      try {
        const movies = await db.Movie.findAll({
          where: {
            title: { [Op.substring]: movieName }
          }
        });
        resolve(movies);
      } catch (e) {
        reject(e);
      }
    });
  }

  static async checkHistory(userId, movieId) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.History.findOne({
          where: {
            userId: userId,
            movieId: movieId
          }
        });
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  static async saveAddList(movieId, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let check = await this.checkHistory(userId, movieId);
        if (check) {
          resolve({
            errCode: 1,
            errMessage: "History existed in database"
          });
        } else {
          await db.History.create({
            userId: userId,
            movieId: movieId
          });
          resolve({
            errCode: 0,
            errMessage: "Add list successfully"
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  // Recommendation
  static async getAllMoviesRecommend(userID) {
    return new Promise(async (resolve, reject) => {
      try {
        const recommendations = await getRecommendationsByUserID(userID);

        const movies = recommendations.result;
        let moviesJson = [];
        for (let movie of movies) {
          let movieJson = await this.getMovieById(movie);
          moviesJson.push(movieJson);
        }
        resolve(moviesJson);
      } catch (e) {
        reject(e);
      }
    });
  }

  static async getMovieOrderByRating() {
    return new Promise(async (resolve, reject) => {
      try {
        let movies = await db.sequelize.query(
          `SELECT m.id, m.title, m.poster_path, m.release_date, m.overview, m.rating 
           FROM Movies m 
           ORDER BY m.rating DESC`,
          {
            type: db.sequelize.QueryTypes.SELECT
          }
        );
        resolve(movies);
      } catch (e) {
        reject(e);
      }
    });
  }

  static async getMoviesTopView() {
    return new Promise(async (resolve, reject) => {
      try {
        let movies = await db.sequelize.query(
          `SELECT m.id, m.title, m.poster_path, m.overview, m.release_date 
           FROM Movies m 
           RIGHT JOIN Viewed v ON m.id = v.movieID 
           ORDER BY v.view DESC`,
          {
            type: db.sequelize.QueryTypes.SELECT
          }
        );
        resolve(movies);
      } catch (e) {
        reject(e);
      }
    });
  }

  static async getAllMoviesRecommendByMovieID(movieId) {
    return new Promise(async (resolve, reject) => {
      try {
        const movieID = parseInt(movieId);
        const recommendations = await getRecommendationsByMovieID(movieID);
        const movies = recommendations.result;
        let moviesJson = [];
        for (let movie of movies) {
          let movieJson = await this.getMovieById(movie);
          moviesJson.push(movieJson);
        }
        resolve(moviesJson);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = MovieService;
