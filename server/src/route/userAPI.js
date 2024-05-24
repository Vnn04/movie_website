const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

const initUserAPIRoutes = (app) => {
    // API
    router.get('/api/get-all-users', UserController.handleGetAllUsers);
    router.get('/api/getLogin', UserController.handleGetLogin);
    router.post('/api/edit-user', UserController.handleEditUser);
    router.post('/buy-vip', UserController.handleBuyVip)
    router.post('/delete-vip', UserController.handleDeleteVip)


    return app.use('/', router);
}

module.exports = {
    initUserAPIRoutes
};
