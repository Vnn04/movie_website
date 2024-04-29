const { createNewUser } = require("../services/userService");
const bcrypt = require("bcrypt");
const mailer = require('../utils/mailer')
const db = require("../models/index");

exports.showForgotForm = (req, res) => {
  let message = "";
  res.render("auth/passwords/email", {message:message});
};

exports.sendResetLinkEmail = async(req, res) => {
    if(!req.body.email) {
        res.redirect('/password/reset')
    } else {

        // await db.User.findOne({
        //     where: {email: req.body.email}
        // }, (user, err) => {
        //     if(!user) {

        //         res.redirect('/password/reset')
        //     } else {
                
        //         bcrypt.hash(user.email, parseInt(process.env.BRYPT_SALT_ROUND)).then((hashEmail)=>{
        //             console.log(`${process.env.APP_URL}/password/reset/${user.email}&token=${hashEmail}`);
        //             mailer.sendMail(user.email, "Reset password", `<a href="${process.env.APP_URL}/password/reset/${user.email}&token=${hashEmail}"> Reset password </a>`)
        //           })
        //         res.redirect('/password/reset?status=success')
        //     }
        // })
        let user = await db.User.findOne({
            where: {email: req.body.email}
        });
        console.log(user);
        if(!user) {
            let message = "loi roi"
            res.render('auth/passwords/email', {message:message})
        } else {
            bcrypt.hash(user.email, parseInt(process.env.BRYPT_SALT_ROUND)).then((hashEmail)=>{
                console.log(`${process.env.APP_URL}/password/reset/${user.email}&token=${hashEmail}`);
                mailer.sendMail(user.email, "Reset password", `<a href="${process.env.APP_URL}/password/reset/${user.email}?token=${hashEmail}"> Reset password </a>`)
              })
            res.redirect('/password/reset?status=success')
        }
    }
}

exports.showResetForm = (req, res) => {
    if(!req.params.email || !req.query.token) {
        res.redirect('/password/reset');
    }else {
        console.log("loo")
        res.render('auth/passwords/reset', {email: req.params.email, token: req.query.token})
    }
}


exports.reset = (req, res) => {
    const {email, token, password} = req.body;
    console.log(email, token, password);
    if(!email || !token || !password) {
        res.redirect('/password/reset');
    } else {
        bcrypt.compare(email, token, (err, result) => {
            console.log('compare', result);
            if(result == true) {
                
                bcrypt.hash(password, parseInt(process.env.BRYPT_SALT_ROUND)).then(async(hashPassword) => {
                    let user = await db.User.findOne({
                        where: {email: email}
                    })
                    
                    if(user) {
                        
                        let updateUser = await user.update({
                            password: hashPassword,
                            username: "dungdeptrai"
                        })
                        console.log(updateUser);
                        if(updateUser) {
                            res.redirect('/login');
                        }else {
                            res.send('loi cmnr')
                        }
                    }
                })
            } else {
                res.redirect('/password/reset');
            }
        })
    }
  
  }
  
  

