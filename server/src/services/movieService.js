import db from "../models/index";
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
let {getRecommendationsByUserID,getRecommendationsByMovieID} = require("../../recommendationSystem/server")

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
//recommendation
let getAllMoviesRecommend = (userID) => {
    return new Promise(async(resolve, reject)=>{
        try {
            const recommendations = await getRecommendationsByUserID(userID);
            const movies = recommendations.result;
            let moviesJson = []
            let movieJson = {}
            movies.forEach(async (movie) => {
                movieJson = await getMovieById(movie);
                moviesJson.push(movieJson);
            });
            resolve(moviesJson);
        } catch (e) {
            reject(e);
        }
    })
}

let getMovieOrderByRating = () => {
    return new Promise(async(resolve, reject)=> {
        try {
            let movies = await db.sequelize.query(
                `SELECT m.id, m.title, m.poster_path, m.release_date, r.rating FROM Movies m RIGHT JOIN rating r ON m.id = r.movieID 
                ORDER BY r.rating DESC`,
                {
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
            resolve(movies);
        } catch (e) {
            reject(e);
        }
    })
}

let getMoviesTopView = () => {
    return new Promise(async(resolve, reject)=> {
        try {
            let movies = await db.sequelize.query(
                `SELECT m.id, m.title, m.poster_path, m.release_date FROM Movies m RIGHT JOIN Viewed v ON m.id = v.movieID 
                ORDER BY v.view DESC`,
                {
                    type: db.sequelize.QueryTypes.SELECT
                }
            );
            resolve(movies);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllMoviesRecommendByMovieID = (movieId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            const movieID = parseInt(movieId)
            const recommendations = await getRecommendationsByMovieID(movieID);
            const movies = recommendations.result;
            let moviesJson = []
            let movieJson = {}
            movies.forEach(async (movie) => {
                movieJson = await getMovieById(movie);
                moviesJson.push(movieJson);
            });
            resolve(moviesJson);
        } catch (e) {
            reject(e);
        }
    })
}

let checkMovie = (title) => {
  return new Promise(async (resolve, reject) => {
    try {
      let movie = await db.Movie.findOne({
        where: {
          title: title,
        },
      });
      if (movie) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

// let addNewMovie = async(movie) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//           //check xem movie da ton tai chua
//           if(!movie.title) {
//             resolve({
//               errCode: 1,
//               errMessage: 'Missing email or password'
//             })
//           }
//           let check = await checkMovie(movie.title);
//           if (check) {
//             resolve({
//               errCode: 1,
//               errMessage:
//                 "Movie existed in database, please try another movie",
//             });
//           } else {
//             await db.Movie.create({
//               id: movie.id,
//               title: movie.title,
//             });
//             resolve({
//               errCode: 0,
//               errMessage: "Add new movie success",
//             });
//           }
//         } catch (e) {
//           reject(e);
//         }
//       });
// }

let addNewMovie = async (movie) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Kiểm tra xem movie đã tồn tại chưa
        if (!movie.title) {
          resolve({
            errCode: 1,
            errMessage: 'Thiếu tiêu đề phim'
          });
        }
        let check = await checkMovie(movie.title);
        if (check) {
          resolve({
            errCode: 1,
            errMessage: 'Phim đã tồn tại trong cơ sở dữ liệu, vui lòng chọn phim khác'
          });
        } else {
          // Tạo bộ phim mới trong cơ sở dữ liệu
          let newMovie = await db.Movie.create({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            rating: movie.rating,
            link: movie.link,
            Action: movie.Action ? 1 : 0,
            Adventure: movie.Adventure ? 1 : 0,
            Animation: movie.Animation ? 1 : 0,
            Comedy: movie.Comedy ? 1 : 0,
            Crime: movie.Crime ? 1 : 0,
            Documentary: movie.Documentary ? 1 : 0,
            Drama: movie.Drama ? 1 : 0,
            Family: movie.Family ? 1 : 0,
            Fantasy: movie.Fantasy ? 1 : 0,
            History: movie.History ? 1 : 0,
            Horror: movie.Horror ? 1 : 0,
            Music: movie.Music ? 1 : 0,
            Mystery: movie.Mystery ? 1 : 0,
            Romance: movie.Romance ? 1 : 0,
            'Science Fiction': movie['Science Fiction'] ? 1 : 0,
            'TV Movie': movie['TV Movie'] ? 1 : 0,
            Thriller: movie.Thriller ? 1 : 0,
            War: movie.War ? 1 : 0,
            Western: movie.Western ? 1 : 0,
            cast: movie.cast
          });
          resolve({
            errCode: 0,
            newMovie,
            errMessage: 'Thêm phim mới thành công'
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };
  
// overview: movie.overview,
// poster_path: movie.poster_path,
// release_date: movie.release_date,
// genres: movie.genres,
// rating: movie.rating,
// link: movie.link,
// cast: movie.cast

module.exports = {
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
}