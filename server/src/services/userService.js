const db = require("../models/index");
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

class UserService {
  constructor() {}

  async handleUserLogin(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        let userData = {};
        let isExist = await UserService.checkUserEmail(email);
        if (isExist) {
          let user = await db.User.findOne({
            where: { email: email },
            raw: true,
          });
          if (user) {
            // Compare password
            let checkPasswordHash = bcrypt.compareSync(password, user.password);
            let checkPassword = password == user.password;
            delete user.password;
            if (checkPassword || checkPasswordHash) {
              await db.Visit.create({
                userID: user.id,
              });
              userData.errCode = 0;
              userData.errMessage = "Login successfully";
            } else {
              userData.errCode = 1;
              userData.errMessage = "Password is not true";
            }
          } else {
            userData.errCode = 1;
            userData.errMessage = "User email does not exist";
          }
          userData.user = user;
          resolve(userData);
        } else {
          userData.errCode = 1;
          userData.errMessage = "Your email doesn't exist in our system. Please try another email";
          userData.user = {};
          resolve(userData);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  static async checkUserEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.User.findOne({
          where: {
            email: email,
          },
        });
        resolve(user ? true : false);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAllUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let users = "";
        if (userId === "ALL") {
          users = await db.User.findAll({
            attributes: {
              exclude: ["password"],
            },
          });
        } else if (userId && userId !== "ALL") {
          users = await db.User.findOne({
            attributes: {
              exclude: ["password"],
            },
            where: { id: userId },
          });
        }
        resolve(users);
      } catch (e) {
        reject(e);
      }
    });
  }

  async createNewUser(newUser) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!newUser.email || !newUser.password) {
          resolve({
            errCode: 1,
            errMessage: 'Missing email or password'
          });
        }

        let check = await UserService.checkUserEmail(newUser.email);
        if (check) {
          resolve({
            errCode: 1,
            errMessage: "Your email existed in database, please try another email",
          });
        } else {
          let hashPasswordFromBcrypt = await UserService.hashUserPassword(newUser.password);
          let lenTable = await db.User.count();
          let user = await db.User.create({
            id: lenTable,
            email: newUser.email,
            username: newUser.username,
            password: hashPasswordFromBcrypt,
            date_of_birth: newUser.date_of_birth,
            phone: newUser.phone,
            fullname: newUser.fullname,
            gender: newUser.gender === 1,
            address: newUser.address,
            bought_vip: false,
          });
          resolve({
            errCode: 0,
            user,
            errMessage: "Create new user success",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  static async hashUserPassword(password) {
    return new Promise(async (resolve, reject) => {
      try {
        let hashPassword = await bcrypt.hashSync(password, salt);
        resolve(hashPassword);
      } catch (e) {
        reject(e);
      }
    });
  }

  async updateUserData(data, user) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!user || !user.id) {
          resolve({
            errCode: 2,
            errMessage: "Missing id parameter",
          });
        }
        let user1 = await db.User.findOne({
          where: { id: user.id },
        });
        if (user1) {
          user1.username = data.username;
          user1.phone = data.phone;
          user1.address = data.address;
          user1.date_of_birth = data.date_of_birth;
          await user1.save();
          resolve({
            errCode: 0,
            errMessage: "Update user success",
            user: user1
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "User does not exist",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async deleteUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.User.findOne({
          where: { id: userId },
        });
        if (!user) {
          resolve({
            errCode: 2,
            errMessage: "The user doesn't exist",
          });
        } else {
          try {
            await db.rating.destroy({
              where: {userID: userId}
            })
          } catch (error) {
            console.log(error)
          }
          try {
            await db.Viewed.destroy({
              where: {userID: userId}
            })
          } catch (error) {
            console.log(error)
          }
          try {
            await db.Visit.destroy({
              where: {userID: userId}
            });
          } catch (error) {
            console.log(error)
          }

            await db.watch_trailer.destroy({
              where: {userID: userId}
            })
            console.log("loi cmnr")

          await db.User.destroy({
            where: { id: userId },
          });
          resolve({
            errCode: 0,
            errMessage: "The user has been deleted",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  handleGetSignUp(req, res) {
    let message = { errMessage: "" };
    res.render('auth/register.ejs', message);
  }

  async handleAdminLogin(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        let adminData = {};
        let isExist = email === "dungkim200504@gmail.com";
        if (isExist) {
          let admin = await db.User.findOne({
            where: { email: email },
            raw: true,
          });
          if (admin) {
            // Compare password
            let checkPasswordHash = bcrypt.compareSync(password, "123456");
            let checkPassword = password === "123456";
            delete admin.password;
            if (checkPassword || checkPasswordHash) {
              await db.Visit.create({
                userID: admin.id,
              });
              adminData.errCode = 0;
              adminData.errMessage = "Login successfully";
            } else {
              adminData.errCode = 1;
              adminData.errMessage = "Password is not true";
            }
          } else {
            adminData.errCode = 1;
            adminData.errMessage = "User email does not exist";
          }
          adminData.admin = admin;
          resolve(adminData);
        } else {
          adminData.errCode = 1;
          adminData.errMessage = "Your email doesn't exist in our system. Please try another email";
          adminData.admin = {};
          resolve(adminData);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = new UserService();
