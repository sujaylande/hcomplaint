import express from 'express';
import { login, logout, myProfile, studentRegister, wardenRegister} from '../controllers/user.js';
import isAuthenticated  from '../middlewares/isAuth.js';
import validateEmail from '../middlewares/isValidmail.js';

const router = express.Router();

router.route('/student-register').post(validateEmail, studentRegister);

router.route('/warden-register').post(validateEmail, wardenRegister);

router.route('/login').post(login);

router.route('/logout').get(isAuthenticated, logout);

router.route('/my-profile').get(isAuthenticated, myProfile);




export default router;