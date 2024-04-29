exports.loggedin = (req, res, next) => {
    if(req.session.loggedin) {
        res.locals.user = req.session.user
        next();
    }else {
        res.redirect('/login')
    }
}

exports.isAuth = (req, res, next) => {
    if(req.session.loggedin) {
        res.locals.user = req.session.user
        res.redirect('/')
    } else {
        next()
    }
}