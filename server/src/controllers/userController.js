let {
  handleUserLogin,
  getAllUser,
  createNewUser,
  updateUserData,
  deleteUser
} = require("../services/userService");
let handleLogin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing input parameter!!!",
      user: {},
    });
  }

  let userData = await handleUserLogin(username, password);
  return res.status(200).json(userData);
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
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await updateUserData(data);
  return res.status(200).json({message});
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
module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
};
