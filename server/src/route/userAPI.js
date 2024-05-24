const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

const initUserAPIRoutes = (app) => {
    // API
    router.get('/api/get-all-users', UserController.handleGetAllUsers);
    router.get('/api/getLogin', UserController.handleGetLogin);
    router.post('/api/edit-user', UserController.handleEditUser);


    return app.use('/', router);
}

module.exports = {
    initUserAPIRoutes
};
