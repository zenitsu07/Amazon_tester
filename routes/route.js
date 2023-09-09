const express = require('express');
const { signupController, loginController } = require('../controllers/user-controller.js');

const userRouter = express.Router();

userRouter.post('/signup', signupController);
userRouter.post('/login', loginController);
// router.post('/logout', logoutUser);
// router.post('/token', createNewToken);

module.exports = userRouter;
