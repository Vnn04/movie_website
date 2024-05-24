const UserService = require("../services/userService");
const bcrypt = require("bcrypt");
const mailer = require('../utils/mailer')
const db = require("../models/index");
const { add_new_user } = require("../../recommendationSystem/server");

exports.create = (req, res) => {
  let message = { errMessage: "" };
  res.render("auth/register.ejs", { message: message });
};

exports.register = async (req, res) => {
  const user = req.body;
  const message = await UserService.createNewUser(user);
  if (message.errCode == 0) {
    await add_new_user(message.user.id, message.user.gender, message.user.date_of_birth);
  }
  if (message.errCode == 1) {
    res.render("auth/register", { message: message.errMessage });
  }
  bcrypt.hash(user.email, parseInt(process.env.BRYPT_SALT_ROUND)).then((hashEmail)=>{
    console.log(`${process.env.APP_URL}/verify?email=${user.email}&token=${hashEmail}`);
    mailer.sendMail(user.email, "Verify Email", `<a href="${process.env.APP_URL}/verify?email=${user.email}&token=${hashEmail}"> Verify </a>`)
  })
  res.redirect("/login");
};

exports.verify = (req, res) => {
  bcrypt.compare(req.query.email, req.query.token, (err, result)=>{
    console.log(req.query.email, "   ", req.query.token)
    console.log(result);
    if(result == true){
      db.User.verify(req.query.email, (err, result) => {
        if(!err) {
          res.redirect("/login");
        } else {
          res.send("loi cmnr");
        }
      });
    }else {
      res.send("lai loi cmnr");
    }
  })

}

