import express from 'express'

import { signupUser,loginUser} from '../controllers/user-controller'
import createNewToken from '../controllers/jwt-controller'

const router = express.Router();

router.post('/signup',signupUser);
router.post('/login',loginUser);
router.post('/logout', logoutUser);
router.post('/token', createNewToken);
export default router;
