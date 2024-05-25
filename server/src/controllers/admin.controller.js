const AdminService = require("../services/adminService");
const MovieService = require("../services/movieService")
const UserService = require("../services/userService");
import db from "../models/index";
require("dotenv").config();
const { add_new_movie } = require("../../recommendationSystem/server");

class AdminController {
  static async handleGetAdmin(req, res) {
    let message = "";
    let users = await UserService.getAllUser("ALL")
    let movies = await MovieService.getAllMovies();
    res.render("utils/admin.ejs", { message: message, users: users, movies: movies });
  }

  static async handleAddFilm(req, res) {  
    let movie = req.body;
    console.log(movie);
    let message = "";
    try {
      message = await AdminService.addNewMovie(movie);
      console.log(message)
      let newMovie = message.newMovie;
      console.log(newMovie);
      await add_new_movie(
        newMovie.id,
        newMovie.Action,
        newMovie.Adventure,
        newMovie.Animation,
        newMovie.Comedy,
        newMovie.Crime,
        newMovie.Documentary,
        newMovie.Drama,
        newMovie.Family,
        newMovie.Fantasy,
        newMovie.History,
        newMovie.Horror,
        newMovie.Music,
        newMovie.Mystery,
        newMovie.Romance,
        newMovie['Science Fiction'],
        newMovie['TV Movie'],
        newMovie.Thriller,
        newMovie.War,
        newMovie.Western
      );
    } catch (e) {
      console.log(e);
      message = {
        errCode: 1,
        errMessage: "Lỗi thêm phim"
      };
    }
    let users = await UserService.getAllUser("ALL")
    let movies = await MovieService.getAllMovies();
    return res.render("utils/admin.ejs", { message: message, users: users, movies: movies});
  }

  static async handleGetDashboard(req, res) {
    try {
      let moviesCount = await db.Movie.count();
      let usersCount = await db.User.count();
      let visitsCount = await db.Visit.count();
      const actionMoviesCount = await db.Movie.count({ where: { Action: 1 } });
      const adventureMoviesCount = await db.Movie.count({ where: { Adventure: 1 } });
      const animationMoviesCount = await db.Movie.count({ where: { Animation: 1 } });
      const comedyMoviesCount = await db.Movie.count({ where: { Comedy: 1 } });
      const crimeMoviesCount = await db.Movie.count({ where: { Crime: 1 } });
      let moviesCountArray = [
        actionMoviesCount,
        adventureMoviesCount,
        animationMoviesCount,
        comedyMoviesCount,
        crimeMoviesCount
      ];
      return res.render("dashboard.ejs", {
        moviesCount: moviesCount,
        usersCount: usersCount,
        visitsCount: visitsCount,
        moviesCountArray: moviesCountArray
      });
    } catch (e) {
      console.log(e);
      return res.render("dashboard.ejs", {
        moviesCount: 0,
        usersCount: 0,
        visitsCount: 0
      });
    }
  }
  static async handleDeleteUser(req, res) {
    if (!req.params.id) {
      console.log(req.params)
      return res.redirect('/login') 
    }
    try {
      await UserService.deleteUser(req.params.id);
      console.log("oke rồi")
    } catch (e) {
      console.log(e);
    }

    return res.redirect(req.headers.referer || '/');
  }

  static async handleDeleteMovie(req, res) {
    if (!req.params.id) {
      console.log(req.params)
      return res.redirect('/login')
    }
    try {
      await AdminService.deleteMovie(req.params.id);
      console.log("oke rồi")
    } catch (e) {
      console.log(e);
    }

    return res.redirect(req.headers.referer || '/');
  }
}



module.exports = AdminController; 

