let {
  handleUserLogin,
  getAllUser,
  createNewUser,
  updateUserData,
  deleteUser
} = require("../services/userService");

let {add_new_user} = require("../../recommendationSystem/server")

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let userData = await handleUserLogin(email, password);
  if(userData.errCode == 0) {
    res.redirect('/')
  }else res.render('auth/login.ejs', {userData: userData})
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; //All, id
  if (!id) {
    return res.status(404).json({
      errCode: 1,
      errMessage: "Missing id",
      users: {},
    });
  }
  let users = await getAllUser(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "get user success",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let user = req.body;
  let message = await createNewUser(user);
  if(message.errCode == 0) {
    await add_new_user(message.userInfo.id, message.userInfo.gender, message.userInfo.date_of_birth)
  }  
  return res.render("auth/register.ejs", {message: message});
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let user = req.session.user
  console.log(user.id)
  let message = await updateUserData(data, user);
  console.log(message.errCode)
  res.render('utils/profile.ejs', {user: message.user})
  // return res.status(200).json({message});
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await deleteUser(req.body.id);
  return res.status(200).json(message);
};

let handleGetLogin = (req, res) => {
  let userData = {errCode:0}
  res.render("auth/login.ejs", {userData: userData});
}

let handleGetSignUp = (req, res) => {
  let message = {errMessage: ""}
  res.render('auth/register.ejs', {message:message});
}

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  handleGetLogin,
  handleGetSignUp
};
