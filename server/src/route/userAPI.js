var express = require('express');
let router = express.Router();
let {handleLogin, handleGetAllUsers, handleCreateNewUser, handleEditUser, handleDeleteUser, handleGetLogin, handleGetSignUp} = require('../controllers/userController')

let initUserAPIRoutes = (app) => {
    //API
    router.get('/api/get-all-users', handleGetAllUsers);

    router.post('/api/login', handleLogin);

    router.get('/api/getLogin', handleGetLogin);

    router.post('/api/create-new-user', handleCreateNewUser);

    router.get('/api/get-sign-up', handleGetSignUp)

    router.post('/api/edit-user', handleEditUser);
    
    router.delete('/api/delete-user', handleDeleteUser);
    

    return app.use('/', router);
}

module.exports = {
    initUserAPIRoutes
}