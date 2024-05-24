const UserService = require("../services/userService");
let db = require("../models/index")
class UserController {
  constructor() {
    this.userService = UserService;
  }

  async handleGetAllUsers(req, res) {
    let id = req.query.id; // All, id
    if (!id) {
      return res.status(404).json({
        errCode: 1,
        errMessage: "Missing id",
        users: {},
      });
    }
    let users = await UserService.getAllUser(id);
    return res.status(200).json({
      errCode: 0,
      errMessage: "Get user success",
      users,
    });
  }

  async handleEditUser(req, res) {
    let data = req.body;
    let user = req.session.user;
    let message = await UserService.updateUserData(data, user);
    res.render('utils/profile.ejs', { user: message.user });
  }

  async handleDeleteUser(req, res) {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameters!",
      });
    }
    let message = await this.userService.deleteUser(req.body.id);
    return res.status(200).json(message);
  }

  handleGetLogin(req, res) {
    let userData = { errCode: 0 };
    res.render("auth/login.ejs", { userData: userData });
  }

  async handleBuyVip(req, res) {
    if(!req.session || !req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    try {
      let user1 = await db.User.findOne({
        where: { id: userId },
      });
      if (user1) {
        user1.bought_vip = 1;
        await user1.save();
      }
    } catch (error) {
      console.log(error);
    }
    res.redirect("/api/profile")
  }

  async handleDeleteVip(req, res) {
    if(!req.session || !req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    try {
        let user1 = await db.User.findOne({
        where: { id: userId },
      });
      if (user1) {
        user1.bought_vip = 0;
        await user1.save();
      }
    } catch (error) {
      console.log(error);
    }
    res.redirect("/api/profile")
  }

}

module.exports = new UserController();
