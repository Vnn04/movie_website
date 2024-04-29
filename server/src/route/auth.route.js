var express = require('express');
let router = express.Router();
const login = require("../controllers/login.controller");
const register = require("../controllers/register.controller");
const authMiddleware = require("../middleware/auth.middleware")
const forgotPassword = require("../controllers/forgotPassword.controller")

let initAuthRoutes = (app) => {
    
    router.get('/login', authMiddleware.isAuth, login.showLoginForm)
    .post('/login', login.login)

    .get('/register', authMiddleware.isAuth, register.create)
    .post('/register', register.register)

    .get('/logout', authMiddleware.loggedin, login.logout)
    .get('/verify', register.verify)

    .get('/password/reset', forgotPassword.showForgotForm)
    .post('/password/email', forgotPassword.sendResetLinkEmail)
    
    .get('/password/reset/:email', forgotPassword.showResetForm)
    .post('/password/reset', forgotPassword.reset)
    return app.use('/', router);
}

module.exports = {
    initAuthRoutes
}