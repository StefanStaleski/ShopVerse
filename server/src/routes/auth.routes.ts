import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../middleware/validation/auth.validation';

const router = Router();

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);

export default router; 