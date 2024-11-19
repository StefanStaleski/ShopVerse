import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../middleware/validation/auth.validation';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

export default router; 