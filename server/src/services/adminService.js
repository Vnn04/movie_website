import db from "../models/index";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class AdminService {
  static async checkMovie(title) {
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
  }

  static async addNewMovie(movie) {
    return new Promise(async (resolve, reject) => {
      try {
        // Kiểm tra xem movie đã tồn tại chưa
        if (!movie.title) {
          resolve({
            errCode: 1,
            errMessage: 'Thiếu tiêu đề phim'
          });
        }
        let check = await AdminService.checkMovie(movie.id);
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
  }
  static async deleteMovie(movieId) {
    return new Promise(async (resolve, reject) => {
      try {
        let movie = await db.Movie.findOne({
          where: { id: movieId },
        });
        if (!movie) {
          resolve({
            errCode: 2,
            errMessage: "The movie doesn't exist",
          });
        } else {
          try {
            await db.rating.destroy({
              where: {movieID: movieId}
            })
          } catch (error) {
            console.log(error)
          }
          try {
            await db.History.destroy({
              where: {movieId: movieId}
            })
          } catch (error) {
            console.log(error)
          }
          try {
            await db.Viewed.destroy({
              where: {movieID: movieId}
            })
          } catch (error) {
            console.log(error)
          }
            await db.watch_trailer.destroy({
              where: {movieID: movieId}
            })
            console.log("loi cmnr")

          await db.Movie.destroy({
            where: { id: movieId },
          });
          resolve({
            errCode: 0,
            errMessage: "The movie has been deleted",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = AdminService;
