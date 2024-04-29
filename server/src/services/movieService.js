import db from "../models/index";
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

let getAllMovies = () => {
    return new Promise(async(resolve, reject)=> {
        try {
            let movies = await db.Movie.findAll({
                order: [
                    ['release_date','DESC']
                ]
            });
            resolve(movies);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllMovieHistory = (userId) => {
    return new Promise(async(resolve, reject)=> {
        try {
            let movies = await db.sequelize.query(
                `SELECT * FROM Movies m
                LEFT JOIN Histories h ON m.id = h.movieId where h.userId = :userId`,
                {
                    replacements: { userId: userId },
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
            resolve(movies);
        } catch (e) {
            reject(e);
        }
    })
}

let getMovieById = (movieId) => {
    return new Promise(async(resolve, reject)=> {
        try {
            const movie = db.Movie.findOne({
                where: {id: movieId}
            });
            resolve(movie);
        } catch (e) {
            reject(e);
        }
    })
}

let searchMovieByName = (movieName) => {
    return new Promise(async(resolve, reject)=> {
        try {
            const movies = db.Movie.findAll({
                where: {
                    title: {[Op.substring] : movieName}
                }
            });
            resolve(movies);
        } catch (e) {
            reject(e);
        }
    })
}

let checkHistory = (userId, movieId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.History.findOne({
          where: {
            userId: userId,
            movieId: movieId
          },
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
  };

let saveAddList = (movieId, userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkHistory(userId, movieId);
            if (check) {
              resolve({
                errCode: 1,
                errMessage:
                  "History existed in database",
              });
            }else {
                await db.History.create({
                    userId: userId,
                    movieId: movieId
                })
                resolve({
                    errCode: 0,
                    errMessage: "Add list successfully",
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getAllMovies,
    getMovieById,
    searchMovieByName,
    saveAddList,
    getAllMovieHistory
}