const UserService = require("../services/userService");

exports.showLoginForm = (req, res) => {
  let userData = { errCode: 0 };
  res.render("auth/login.ejs", { userData: userData });
};
exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await UserService.handleUserLogin(email, password);
  if (user.errCode == 1) {
    res.render("auth/login", { userData: user });
  } else if (user.errCode == 0) {
    req.session.loggedin = true;
    req.session.user = user.user;
    res.redirect("/");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) res.render("index.ejs");
    res.redirect("/login");
  });
};

//Admin
exports.showLoginAdminForm = (req, res) => {
  let userData = { errCode: 0 };
  res.render("auth/login_admin.ejs", { userData: userData });
};

exports.loginAdmin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await UserService.handleAdminLogin(email, password);
  if (user.errCode == 1) {
    res.render("auth/login_admin", { userData: user });
  } else if (user.errCode == 0) {
    req.session.loggedin = true;
    req.session.user = user.user;
    res.redirect("/get-dashboard");
  }
};
