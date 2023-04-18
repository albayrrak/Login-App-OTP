import { Router } from 'express';
const router = Router();

/* import all controllers */
import { Authenticate } from '../controllers/appControllers.js';
const controller = new Authenticate();

import { AuthMiddleware } from '../middleware/auth.js';
const authMiddleware = new AuthMiddleware();

/* POST METHODS */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(); // send mail
router.route('/authenticate').post((req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in app

/* GET METHODS */
router.route('/user/:username').get(controller.getUser); // user with username
router
  .route('/generateOTP')
  .get(
    controller.verifyUser,
    authMiddleware.LocalVariables,
    controller.generateOTP
  ); // generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables

/* PUT METHODS */
router.route('/updateuser').put(authMiddleware.Auth, controller.updateUser); // is use to update the user profile
router
  .route('/resetpassword')
  .put(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;
